import { HttpError, assertStoreAccess, badRequest, contains, notFound, now, num, paginate, requireRole, requireUser, scopedStoreId, type Ctx, type createRouter } from "../http";
import { nextId, persist } from "../db";
import { findProduct, findStore, findUser, isRevenueOrder, orderTotal, storeStock, toComplaintDto, toCustomerDto, toOrderDto } from "../views";
import type { DbCustomer, DbOrder, DbUser } from "../types";
import { STAFF_ROLES, UserRole } from "@/lib/roles";
import { findDiscount, lineDiscount } from "@/lib/pricing";

const ADMINS = [UserRole.SuperAdmin, UserRole.StoreAdmin] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const tierFor = (spent: number) => (spent > 3_000_000 ? 3 : spent > 1_200_000 ? 2 : spent > 400_000 ? 1 : 0);

const findOrder = (ctx: Ctx) => {
  const order = ctx.db.orders.find((o) => o.id === Number(ctx.params.id));
  if (!order) throw notFound("Order");
  assertStoreAccess(ctx, order.storeId);
  return order;
};

const CUSTOMER_FIELDS = ["loyaltyTier", "kycStatus", "loyaltyPoints", "customerClassification", "companyName", "industryClass", "notes", "customerStatus"] as const;

function upsertCustomerFields(customer: DbCustomer, user: DbUser, body: Record<string, unknown>) {
  if (body.firstName) user.firstName = String(body.firstName).trim();
  if (body.lastName) user.lastName = String(body.lastName).trim();
  if (body.phoneNumber !== undefined) user.phoneNumber = String(body.phoneNumber);
  for (const key of CUSTOMER_FIELDS) {
    if (body[key] !== undefined) (customer as unknown as Record<string, unknown>)[key] = body[key];
  }
  customer.updatedAt = now();
}

export function registerSales(router: ReturnType<typeof createRouter>) {
  // ---------------- Orders ----------------
  router.add("GET", "Order", (ctx: Ctx) => {
    requireRole(ctx, ...STAFF_ROLES);
    const storeId = scopedStoreId(ctx, ctx.query.storeId);
    const status = num(ctx.query.status);
    const paymentStatus = num(ctx.query.paymentStatus);
    const productId = num(ctx.query.productId);
    const customerId = num(ctx.query.userId);
    const rows = ctx.db.orders
      .filter((o) => customerId === undefined || o.customerId === customerId)
      .filter((o) => storeId === undefined || o.storeId === storeId)
      .filter((o) => status === undefined || o.status === status)
      .filter((o) => paymentStatus === undefined || o.paymentStatus === paymentStatus)
      .filter((o) => productId === undefined || o.items.some((i) => i.productId === productId))
      .filter((o) => {
        if (!ctx.query.search && !ctx.query.customerEmail) return true;
        const c = findUser(ctx.db, o.customerId);
        return contains([o.id, o.transactionRef, c?.firstName, c?.lastName, c?.email, c?.phoneNumber], ctx.query.search) &&
          contains([c?.email], ctx.query.customerEmail);
      })
      .sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1));
    const { items, pagination } = paginate(rows, ctx.query, 50);
    const rated = rows.filter((o) => o.rating);
    return {
      orders: items.map((o) => toOrderDto(ctx.db, o)),
      pagination,
      tiles: {
        pending: rows.filter((o) => o.status === 0).length,
        delivered: rows.filter((o) => o.status === 4).length,
        completed: rows.filter((o) => o.status === 2).length,
        cancelled: rows.filter((o) => o.status === 7).length,
        averageRating: rated.length ? rated.reduce((s, o) => s + (o.rating ?? 0), 0) / rated.length : 0,
        revenue: rows.filter(isRevenueOrder).reduce((s, o) => s + orderTotal(o), 0),
      },
    };
  });

  router.add("GET", "Order/:id", (ctx: Ctx) => {
    requireRole(ctx, ...STAFF_ROLES);
    return toOrderDto(ctx.db, findOrder(ctx));
  });

  router.add("POST", "Order", (ctx: Ctx) => {
    const user = requireRole(ctx, ...STAFF_ROLES);
    const storeId = scopedStoreId(ctx, ctx.body?.storeId);
    if (!storeId || !findStore(ctx.db, storeId)) throw badRequest("A valid store is required");
    const lines: { productId: number; quantity: number; discountId?: string }[] = ctx.body?.orderItems ?? [];
    if (!lines.length) throw badRequest("An order needs at least one item");

    // Validate everything before touching stock so a failed order leaves no trace.
    const items = lines.map((l) => {
      const product = findProduct(ctx.db, Number(l.productId));
      const qty = Math.floor(Number(l.quantity));
      if (!product || !product.isActive) throw badRequest("One of the products is no longer available");
      if (!(qty > 0)) throw badRequest("Quantities must be at least 1");
      const available = storeStock(ctx.db, product.productId, storeId)?.quantity ?? 0;
      if (available < qty) throw new HttpError(409, `Only ${available} × ${product.productName} left in stock`);
      // Price always comes from the catalogue and discounts from the approved list, never from the client.
      const off = lineDiscount(product.basePrice, qty, findDiscount(l.discountId));
      return { productId: product.productId, quantity: qty, price: (product.basePrice * qty - off) / qty };
    });

    const customer = ctx.body?.customerId ? findUser(ctx.db, Number(ctx.body.customerId)) : undefined;
    const order: DbOrder = {
      id: nextId(ctx.db.orders, "id"),
      storeId,
      customerId: customer?.id ?? null,
      status: 2,
      paymentOption: Number(ctx.body?.paymentOption ?? 0),
      paymentStatus: 1,
      orderType: 1,
      transactionRef: `POS-${Date.now().toString(36).toUpperCase()}`,
      createdBy: user.id,
      orderDate: now(),
      lastUpdatedAt: now(),
      estimatedDeliveryDate: null,
      rating: null,
      items,
    };
    ctx.db.orders.push(order);

    for (const it of items) {
      storeStock(ctx.db, it.productId, storeId)!.quantity -= it.quantity;
      ctx.db.transactions.unshift({ id: nextId(ctx.db.transactions, "id"), type: 1, storeId, productId: it.productId, quantity: it.quantity, reference: `ORD-${order.id}`, reason: "POS sale", createdBy: user.id, createdOn: now() });
    }

    const profile = customer && ctx.db.customers.find((c) => c.userId === customer.id);
    if (profile) {
      const total = orderTotal(order);
      const points = Math.floor(total / 1000);
      profile.totalSpent += total;
      profile.loyaltyPoints += points;
      profile.loyaltyTier = tierFor(profile.totalSpent);
      profile.lastTransactionDate = order.orderDate;
      ctx.db.loyaltyActivity.push({ id: nextId(ctx.db.loyaltyActivity, "id"), customerId: customer.id, orderId: order.id, pointsEarned: points, pointsRedeemed: 0, createdAt: order.orderDate });
    }
    persist();
    return toOrderDto(ctx.db, order);
  });

  router.add("PUT", "Order/:id/status", (ctx: Ctx) => {
    requireRole(ctx, ...ADMINS);
    const order = findOrder(ctx);
    const status = Number(ctx.body?.status);
    if (!(status >= 0 && status <= 7)) throw badRequest("Invalid status");
    order.status = status;
    order.lastUpdatedAt = now();
    persist();
    return { message: "Order status updated" };
  });

  // Voids and returns need a store admin's credentials, checked here rather than in the browser.
  router.add("POST", "Order/:id/reverse", (ctx: Ctx) => {
    const user = requireRole(ctx, ...STAFF_ROLES);
    const order = findOrder(ctx);
    const { type, reason, approverEmail, approverPassword } = ctx.body ?? {};
    if (type !== "void" && type !== "return") throw badRequest("Unknown reversal type");
    if (!String(reason ?? "").trim()) throw badRequest("A reason is required");
    if (![1, 2, 4].includes(order.status)) throw badRequest("Only completed orders can be voided or returned");

    const approver = ctx.db.users.find((u) => u.email.toLowerCase() === String(approverEmail ?? "").toLowerCase());
    const canApprove = approver?.isActive && approver.password === approverPassword &&
      (approver.roleId === UserRole.SuperAdmin || (approver.roleId === UserRole.StoreAdmin && approver.storeId === order.storeId));
    if (!canApprove) throw new HttpError(403, "Approval failed. A store admin for this store must approve.");

    order.status = type === "void" ? 7 : 6;
    order.paymentStatus = 3;
    order.lastUpdatedAt = now();
    for (const it of order.items) {
      const row = storeStock(ctx.db, it.productId, order.storeId);
      if (row) row.quantity += it.quantity;
      ctx.db.transactions.unshift({ id: nextId(ctx.db.transactions, "id"), type: 0, storeId: order.storeId, productId: it.productId, quantity: it.quantity, reference: `ORD-${order.id}`, reason: `${type === "void" ? "Void" : "Return"}: ${reason} (approved by ${approver!.firstName} ${approver!.lastName}, requested by ${user.firstName})`, createdBy: approver!.id, createdOn: now() });
    }
    const profile = ctx.db.customers.find((c) => c.userId === order.customerId);
    if (profile) {
      const total = orderTotal(order);
      profile.totalSpent = Math.max(0, profile.totalSpent - total);
      profile.loyaltyPoints = Math.max(0, profile.loyaltyPoints - Math.floor(total / 1000));
      profile.loyaltyTier = tierFor(profile.totalSpent);
    }
    persist();
    return toOrderDto(ctx.db, order);
  });

  router.add("PUT", "Order/:id/EstimatedDeliveryDate", (ctx: Ctx) => {
    requireRole(ctx, ...ADMINS);
    const order = findOrder(ctx);
    order.estimatedDeliveryDate = new Date(ctx.body?.estimatedDeliveryDate).toISOString();
    persist();
    return { message: "Delivery date updated" };
  });

  router.add("PUT", "Order/:id/Rating", (ctx: Ctx) => {
    requireRole(ctx, ...STAFF_ROLES);
    const order = findOrder(ctx);
    const rating = Number(ctx.body?.rating);
    if (!(rating >= 1 && rating <= 5)) throw badRequest("Rating must be between 1 and 5");
    order.rating = rating;
    persist();
    return { message: "Rating saved", rating };
  });

  router.add("GET", "LoyaltyActivity", (ctx: Ctx) => {
    requireRole(ctx, ...STAFF_ROLES);
    const customerId = num(ctx.query.customer_id);
    const from = ctx.query.from ? new Date(ctx.query.from).getTime() : -Infinity;
    const to = ctx.query.to ? new Date(ctx.query.to).getTime() : Infinity;
    return ctx.db.loyaltyActivity
      .filter((a) => customerId === undefined || a.customerId === customerId)
      .filter((a) => {
        const at = new Date(a.createdAt).getTime();
        return at >= from && at <= to;
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });

  // ---------------- Customers ----------------
  router.add("GET", "Customer", (ctx: Ctx) => {
    requireRole(ctx, ...STAFF_ROLES);
    const classification = num(ctx.query.classification);
    const loyaltyTier = num(ctx.query.loyaltyTier);
    const status = num(ctx.query.status);
    const rows = ctx.db.customers
      .filter((c) => classification === undefined || c.customerClassification === classification)
      .filter((c) => loyaltyTier === undefined || c.loyaltyTier === loyaltyTier)
      .filter((c) => status === undefined || c.customerStatus === status)
      .filter((c) => {
        const u = findUser(ctx.db, c.userId);
        return contains([u?.firstName, u?.lastName, u?.email, u?.phoneNumber, c.companyName], ctx.query.search);
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);
    const { items, pagination } = paginate(rows, ctx.query, 100);
    return { customers: items.map((c) => toCustomerDto(ctx.db, c)), pagination };
  });

  router.add("GET", "Customer/:id", (ctx: Ctx) => {
    requireRole(ctx, ...STAFF_ROLES);
    const c = ctx.db.customers.find((x) => x.id === Number(ctx.params.id));
    if (!c) throw notFound("Customer");
    return toCustomerDto(ctx.db, c);
  });

  router.add("POST", "Customer", (ctx: Ctx) => {
    requireRole(ctx, ...STAFF_ROLES);
    const b = ctx.body ?? {};
    const email = String(b.email ?? "").trim().toLowerCase();
    if (!b.firstName || !b.lastName) throw badRequest("First and last name are required");
    if (email && !EMAIL.test(email)) throw badRequest("Enter a valid email address");
    if (email && ctx.db.users.some((u) => u.email.toLowerCase() === email)) throw new HttpError(409, "A customer with this email already exists");
    const user: DbUser = {
      id: nextId(ctx.db.users, "id"),
      firstName: "", lastName: "", phoneNumber: "",
      email: email || `walkin-${Date.now()}@vendli.local`,
      username: email || `walkin-${Date.now()}`,
      roleId: UserRole.Customer, storeId: null, isActive: true, joinedDate: now(), createdAt: now(),
    };
    const customer: DbCustomer = {
      id: nextId(ctx.db.customers, "id"), userId: user.id, loyaltyTier: 0, kycStatus: 0, loyaltyPoints: 0, totalSpent: 0,
      lastTransactionDate: null, customerClassification: 2, companyName: null, industryClass: null,
      preferredStoreId: Number(b.preferredStoreId) || requireUser(ctx).storeId, customerStatus: 1, notes: "", createdAt: now(), updatedAt: now(),
    };
    upsertCustomerFields(customer, user, b);
    ctx.db.users.push(user);
    ctx.db.customers.push(customer);
    persist();
    return { message: "Customer created", id: customer.id, userId: user.id };
  });

  router.add("PUT", "Customer/:id", (ctx: Ctx) => {
    requireRole(ctx, ...ADMINS);
    const c = ctx.db.customers.find((x) => x.id === Number(ctx.params.id));
    const u = c && findUser(ctx.db, c.userId);
    if (!c || !u) throw notFound("Customer");
    upsertCustomerFields(c, u, ctx.body ?? {});
    persist();
    return { message: "Customer updated" };
  });

  router.add("DELETE", "Customer/:id", (ctx: Ctx) => {
    requireRole(ctx, UserRole.SuperAdmin);
    const c = ctx.db.customers.find((x) => x.id === Number(ctx.params.id));
    if (!c) throw notFound("Customer");
    c.customerStatus = 0; // soft delete keeps order history consistent
    persist();
    return { message: "Customer deactivated" };
  });

  // ---------------- Complaints ----------------
  const visibleComplaints = (ctx: Ctx) => {
    const storeId = scopedStoreId(ctx);
    return ctx.db.complaints.filter((c) => storeId === undefined || c.storeId === storeId);
  };

  router.add("GET", "Complaints", (ctx: Ctx) => {
    requireRole(ctx, ...ADMINS);
    const priority = num(ctx.query.priority);
    const status = num(ctx.query.status);
    const rows = visibleComplaints(ctx)
      .filter((c) => priority === undefined || c.priority === priority)
      .filter((c) => status === undefined || c.status === status)
      .filter((c) => contains([c.title, c.complaintText], ctx.query.search))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const { items, pagination } = paginate(rows, ctx.query, 100);
    return { complaints: items.map((c) => toComplaintDto(ctx.db, c)), pagination };
  });

  router.add("POST", "Complaints", (ctx: Ctx) => {
    requireRole(ctx, ...ADMINS);
    const b = ctx.body ?? {};
    const storeId = scopedStoreId(ctx, b.storeId);
    if (!b.title || !b.complaintText) throw badRequest("Title and details are required");
    if (!storeId || !findStore(ctx.db, storeId)) throw badRequest("Select a store");
    if (!findUser(ctx.db, Number(b.customerId))) throw badRequest("Select a customer");
    ctx.db.complaints.push({
      id: nextId(ctx.db.complaints, "id"), title: String(b.title), complaintText: String(b.complaintText),
      priority: Number(b.priority ?? 1), status: 0, customerId: Number(b.customerId), storeId,
      assignedToUserId: b.assignedToUserId ? Number(b.assignedToUserId) : null, dateClosed: null, createdAt: now(), updatedAt: now(),
    });
    persist();
    return { message: "Complaint logged" };
  });

  router.add("PUT", "Complaints/:id", (ctx: Ctx) => {
    requireRole(ctx, ...ADMINS);
    const c = visibleComplaints(ctx).find((x) => x.id === Number(ctx.params.id));
    if (!c) throw notFound("Complaint");
    const b = ctx.body ?? {};
    if (b.title !== undefined) c.title = String(b.title);
    if (b.complaintText !== undefined) c.complaintText = String(b.complaintText);
    if (b.priority !== undefined) c.priority = Number(b.priority);
    if (b.assignedToUserId !== undefined) c.assignedToUserId = Number(b.assignedToUserId) || null;
    if (b.status !== undefined) {
      c.status = Number(b.status);
      c.dateClosed = c.status >= 2 ? now() : null;
    }
    c.updatedAt = now();
    persist();
    return { message: "Complaint updated" };
  });

  router.add("DELETE", "Complaints/:id", (ctx: Ctx) => {
    requireRole(ctx, UserRole.SuperAdmin);
    ctx.db.complaints = ctx.db.complaints.filter((c) => c.id !== Number(ctx.params.id));
    persist();
    return { message: "Complaint deleted" };
  });

  // ---------------- Promotions ----------------
  router.add("GET", "Promotions", (ctx: Ctx) => {
    requireRole(ctx, ...STAFF_ROLES);
    const storeId = scopedStoreId(ctx, ctx.query.storeId);
    const productId = num(ctx.query.productId);
    const includeDeleted = ctx.query.includeDeleted === "true";
    return ctx.db.promotions
      .filter((p) => includeDeleted || !p.isDeleted)
      .filter((p) => storeId === undefined || p.appliesToAllStores || p.applicableStoreIds?.includes(storeId))
      .filter((p) => productId === undefined || p.appliesToAllProducts || p.applicableProductIds?.includes(productId));
  });

  const writePromotion = (ctx: Ctx, id?: number) => {
    const user = requireRole(ctx, ...ADMINS);
    const b = ctx.body ?? {};
    const existing = id ? ctx.db.promotions.find((p) => p.id === id) : undefined;
    if (id && !existing) throw notFound("Promotion");
    const promo = existing ?? { id: nextId(ctx.db.promotions, "id"), isDeleted: false, customCouponCode: null, applicableProductIds: null, applicableStoreIds: null, appliesToAllProducts: true, appliesToAllStores: true, description: "", title: "", discountType: 0, discountValue: 0, startDate: now(), endDate: now() };
    Object.assign(promo, Object.fromEntries(Object.entries(b).filter(([k]) => k in promo && k !== "id")));
    // A store admin's promotions only ever apply to their own store.
    if (user.roleId === UserRole.StoreAdmin) Object.assign(promo, { appliesToAllStores: false, applicableStoreIds: [user.storeId] });
    if (!promo.title) throw badRequest("Title is required");
    if (!existing) ctx.db.promotions.push(promo);
    persist();
    return promo;
  };
  router.add("POST", "Promotions", (ctx: Ctx) => writePromotion(ctx));
  router.add("PUT", "Promotions/:id", (ctx: Ctx) => writePromotion(ctx, Number(ctx.params.id)));
  router.add("PATCH", "Promotions/:id", (ctx: Ctx) => writePromotion(ctx, Number(ctx.params.id)));
  router.add("DELETE", "Promotions/:id", (ctx: Ctx) => {
    requireRole(ctx, ...ADMINS);
    const promo = ctx.db.promotions.find((p) => p.id === Number(ctx.params.id));
    if (!promo) throw notFound("Promotion");
    promo.isDeleted = true;
    persist();
    return { success: true };
  });
}
