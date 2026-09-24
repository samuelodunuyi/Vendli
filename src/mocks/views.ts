import type { Db, DbComplaint, DbCustomer, DbOrder, DbProduct, DbStore, DbTransaction, DbUser } from "./types";
import { roleLabel } from "@/lib/roles";

const byId = <T, K extends keyof T>(rows: T[], key: K, id: T[K]) => rows.find((r) => r[key] === id);

export const findUser = (db: Db, id: number | null | undefined) => (id == null ? undefined : byId(db.users, "id", id));
export const findStore = (db: Db, id: number | null | undefined) => (id == null ? undefined : byId(db.stores, "storeId", id));
export const findProduct = (db: Db, id: number) => byId(db.products, "productId", id);
export const findCategory = (db: Db, id: number) => byId(db.categories, "categoryId", id);

export const orderTotal = (o: DbOrder) => o.items.reduce((s, i) => s + i.price * i.quantity, 0);

/** Orders that represent real revenue. */
export const isRevenueOrder = (o: DbOrder) => [1, 2, 3, 4].includes(o.status);

export const storeStock = (db: Db, productId: number, storeId: number) =>
  db.inventory.find((i) => i.productId === productId && i.storeId === storeId);

export const totalStock = (db: Db, p: DbProduct) =>
  p.warehouseStock + db.inventory.filter((i) => i.productId === p.productId).reduce((s, i) => s + i.quantity, 0);

export const stockStatus = (qty: number, min: number) =>
  qty <= 0 ? "out of stock" : qty <= min ? "low stock" : "instock";

export const userSummary = (u?: DbUser) =>
  u ? { id: u.id, username: u.username, email: u.email, firstName: u.firstName, lastName: u.lastName, roleName: roleLabel(u.roleId) } : null;

export const toStoreDto = (db: Db, s: DbStore) => ({
  ...s,
  totalSales: db.orders.filter((o) => o.storeId === s.storeId && isRevenueOrder(o)).reduce((sum, o) => sum + orderTotal(o), 0),
});

export const toUserDto = (db: Db, u: DbUser) => {
  const { password: _password, ...rest } = u; // never leak credentials
  return {
    ...rest,
    role: roleLabel(u.roleId),
    roleName: roleLabel(u.roleId),
    storeId: u.storeId ?? undefined,
    storeName: findStore(db, u.storeId)?.storeName,
  };
};

export const toProductDto = (db: Db, p: DbProduct, storeId?: number) => {
  const store = storeId ? findStore(db, storeId) : undefined;
  return {
    ...p,
    categoryName: findCategory(db, p.categoryId)?.categoryName,
    storeId: storeId ?? 0,
    storeName: store?.storeName,
    basestock: storeId ? storeStock(db, p.productId, storeId)?.quantity ?? 0 : totalStock(db, p),
    additionalImages: [],
    createdByUser: userSummary(findUser(db, p.createdBy)),
  };
};

export const toOrderDto = (db: Db, o: DbOrder) => {
  const store = findStore(db, o.storeId);
  const customer = findUser(db, o.customerId);
  const creator = findUser(db, o.createdBy);
  return {
    id: o.id,
    orderDate: o.orderDate,
    storeId: o.storeId,
    store: { storeId: o.storeId, storeName: store?.storeName ?? "" },
    status: o.status,
    paymentOption: o.paymentOption,
    paymentStatus: o.paymentStatus,
    orderType: o.orderType,
    transactionRef: o.transactionRef,
    createdBy: creator ? `${creator.firstName} ${creator.lastName}` : "System",
    lastUpdatedAt: o.lastUpdatedAt,
    lastUpdatedBy: creator ? `${creator.firstName} ${creator.lastName}` : "System",
    estimatedDeliveryDate: o.estimatedDeliveryDate,
    rating: o.rating,
    customer: customer
      ? { id: customer.id, firstName: customer.firstName, lastName: customer.lastName, email: customer.email, phoneNumber: customer.phoneNumber, createdAt: customer.createdAt }
      : { id: 0, firstName: "Walk-in", lastName: "Customer", email: "", phoneNumber: null, createdAt: o.orderDate },
    orderItems: o.items.map((it, idx) => {
      const p = findProduct(db, it.productId);
      return {
        id: o.id * 10 + idx,
        productId: it.productId,
        productName: p?.productName ?? "Unknown product",
        productDescription: p?.description ?? "",
        productCategory: p ? findCategory(db, p.categoryId)?.categoryName ?? "" : "",
        sku: p?.sku ?? "",
        productImageUrl: p?.imageUrl ?? "",
        quantity: it.quantity,
        priceAtOrder: it.price,
        originalPriceAtOrder: p?.basePrice ?? it.price,
      };
    }),
  };
};

export const toCustomerDto = (db: Db, c: DbCustomer) => {
  const u = findUser(db, c.userId);
  const preferredStore = findStore(db, c.preferredStoreId)?.storeName ?? null;
  return {
    ...c,
    preferredStore,
    userInfo: {
      firstName: u?.firstName ?? "",
      lastName: u?.lastName ?? "",
      email: u?.email ?? "",
      phoneNumber: u?.phoneNumber ?? null,
      joinedDate: u?.joinedDate ?? c.createdAt,
      preferredStore: preferredStore ?? "",
    },
  };
};

export const toTransactionDto = (db: Db, t: DbTransaction) => {
  const p = findProduct(db, t.productId);
  const s = findStore(db, t.storeId);
  const u = findUser(db, t.createdBy);
  return {
    id: t.id,
    type: t.type,
    quantity: t.quantity,
    reference: t.reference ?? "",
    reason: t.reason ?? "",
    createdOn: t.createdOn,
    createdBy: { id: u?.id, email: u?.email ?? "", username: u?.username ?? "", firstName: u?.firstName ?? "", lastName: u?.lastName ?? "" },
    store: { id: t.storeId, name: s?.storeName ?? "" },
    product: { id: t.productId, name: p?.productName ?? "", sku: p?.sku ?? "" },
    fromStore: t.type === 3 ? s?.storeName : undefined,
    toStore: t.toStoreId ? findStore(db, t.toStoreId)?.storeName : undefined,
    unitPrice: p?.costPrice ?? 0,
  };
};

export const toComplaintDto = (db: Db, c: DbComplaint) => {
  const cust = findUser(db, c.customerId);
  const store = findStore(db, c.storeId);
  const assignee = findUser(db, c.assignedToUserId);
  return {
    id: c.id,
    title: c.title,
    complaintText: c.complaintText,
    priority: c.priority,
    status: c.status,
    customer: { id: cust?.id ?? 0, firstName: cust?.firstName ?? "", lastName: cust?.lastName ?? "", email: cust?.email ?? "", phoneNumber: cust?.phoneNumber ?? null },
    store: { storeId: c.storeId, storeName: store?.storeName ?? "", storeAddress: store?.storeAddress ?? "", storePhoneNumber: store?.storePhoneNumber ?? "" },
    assignedTo: assignee ? { id: assignee.id, firstName: assignee.firstName, lastName: assignee.lastName, email: assignee.email } : undefined,
    dateClosed: c.dateClosed,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
};
