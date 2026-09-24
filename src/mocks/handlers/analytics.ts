import { num, requireRole, scopedStoreId, type Ctx, type createRouter } from "../http";
import { findCategory, findProduct, findStore, findUser, isRevenueOrder, orderTotal, totalStock } from "../views";
import type { Db, DbOrder } from "../types";
import { ADMIN_ROLES } from "@/lib/roles";
import { LOYALTY_TIER, CUSTOMER_CLASSIFICATION, KYC_STATUS, CUSTOMER_STATUS, PAYMENT_OPTION, ORDER_STATUS } from "@/lib/enums";

const DAY = 86_400_000;

function periodFor(timeline: string | undefined, startDate?: string, endDate?: string) {
  const end = new Date();
  const start = new Date(end);
  start.setHours(0, 0, 0, 0);
  switch (timeline) {
    case "today": break;
    case "week": start.setDate(start.getDate() - 6); break;
    case "month": start.setDate(1); break;
    case "year": case "thisYear": start.setMonth(0, 1); break;
    case "last7days": start.setDate(start.getDate() - 6); break;
    case "last90days": start.setDate(start.getDate() - 89); break;
    case "custom":
      if (startDate) return { start: new Date(startDate), end: endDate ? new Date(new Date(endDate).getTime() + DAY - 1) : end };
      start.setDate(start.getDate() - 29);
      break;
    default: start.setDate(start.getDate() - 29); // last30days and anything unknown
  }
  return { start, end };
}

const inRange = (o: DbOrder, start: Date, end: Date) => {
  const t = new Date(o.orderDate).getTime();
  return t >= start.getTime() && t <= end.getTime();
};

/** Buckets revenue by hour, day or month depending on how wide the window is. */
function trend(orders: DbOrder[], start: Date, end: Date, value: (o: DbOrder) => number) {
  const span = end.getTime() - start.getTime();
  const unit = span <= DAY ? "hour" : span <= 62 * DAY ? "day" : "month";
  const labels: string[] = [];
  const keys: string[] = [];
  const cursor = new Date(start);
  const keyOf = (d: Date) => (unit === "hour" ? `${d.toDateString()}-${d.getHours()}` : unit === "day" ? d.toDateString() : `${d.getFullYear()}-${d.getMonth()}`);
  while (cursor <= end) {
    keys.push(keyOf(cursor));
    labels.push(
      unit === "hour" ? cursor.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        : unit === "day" ? cursor.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
          : cursor.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
    );
    if (unit === "hour") cursor.setHours(cursor.getHours() + 1);
    else if (unit === "day") cursor.setDate(cursor.getDate() + 1);
    else cursor.setMonth(cursor.getMonth() + 1, 1);
  }
  const totals = new Map(keys.map((k) => [k, 0]));
  for (const o of orders) {
    const k = keyOf(new Date(o.orderDate));
    if (totals.has(k)) totals.set(k, totals.get(k)! + value(o));
  }
  return { labels, values: keys.map((k) => Math.round(totals.get(k)!)) };
}

function productBreakdown(db: Db, orders: DbOrder[], categoryId?: number) {
  const byProduct = new Map<number, { qty: number; amount: number }>();
  for (const o of orders) for (const it of o.items) {
    const p = findProduct(db, it.productId);
    if (!p || (categoryId !== undefined && p.categoryId !== categoryId)) continue;
    const row = byProduct.get(it.productId) ?? { qty: 0, amount: 0 };
    row.qty += it.quantity;
    row.amount += it.quantity * it.price;
    byProduct.set(it.productId, row);
  }
  return byProduct;
}

function categoryBreakdown(db: Db, byProduct: Map<number, { qty: number; amount: number }>) {
  const byCat = new Map<number, { qty: number; amount: number }>();
  for (const [pid, v] of byProduct) {
    const cid = findProduct(db, pid)!.categoryId;
    const row = byCat.get(cid) ?? { qty: 0, amount: 0 };
    row.qty += v.qty;
    row.amount += v.amount;
    byCat.set(cid, row);
  }
  return [...byCat].map(([categoryId, v]) => ({ categoryId, categoryName: findCategory(db, categoryId)?.categoryName ?? "", totalSales: v.qty, totalAmount: v.amount })).sort((a, b) => b.totalAmount - a.totalAmount);
}

const sum = (orders: DbOrder[]) => orders.reduce((s, o) => s + orderTotal(o), 0);

export function registerAnalytics(router: ReturnType<typeof createRouter>) {
  router.add("GET", "Statistics", (ctx: Ctx) => {
    requireRole(ctx, ...ADMIN_ROLES);
    const { db, query } = ctx;
    const storeId = scopedStoreId(ctx, query.storeId);
    const { start, end } = periodFor(query.timeline, query.startDate, query.endDate);
    const prevStart = new Date(start.getTime() - (end.getTime() - start.getTime()));

    const storeOrders = db.orders.filter((o) => storeId === undefined || o.storeId === storeId);
    const orders = storeOrders.filter((o) => inRange(o, start, end));
    const previous = storeOrders.filter((o) => inRange(o, prevStart, start) && isRevenueOrder(o));
    const revenue = orders.filter(isRevenueOrder);
    const byProduct = productBreakdown(db, revenue);
    const products = [...byProduct].map(([productId, v]) => ({ productId, productName: findProduct(db, productId)!.productName, totalSales: v.qty, totalAmount: v.amount }));
    const unitsSold = products.reduce((s, p) => s + p.totalSales, 0);

    const customerIds = new Set(orders.map((o) => o.customerId).filter(Boolean) as number[]);
    const returning = [...customerIds].filter((id) => storeOrders.some((o) => o.customerId === id && new Date(o.orderDate) < start)).length;

    const topCustomers = [...customerIds].map((id) => {
      const mine = revenue.filter((o) => o.customerId === id);
      const u = findUser(db, id)!;
      return { userId: id, userName: `${u.firstName} ${u.lastName}`, email: u.email, totalOrders: mine.length, totalAmount: sum(mine) };
    }).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5);

    const stores = db.stores.filter((s) => storeId === undefined || s.storeId === storeId);
    const count = (status: number) => orders.filter((o) => o.status === status).length;

    return {
      totalOrders: orders.length,
      totalStores: stores.length,
      activeStores: stores.filter((s) => s.isActive).length,
      pendingOrders: count(0),
      confirmedOrders: count(1),
      deliveredOrders: count(4),
      failedOrders: count(5),
      returnedOrders: count(6),
      cancelledOrders: count(7),
      delayedOrders: orders.filter((o) => o.status === 3 && o.estimatedDeliveryDate && new Date(o.estimatedDeliveryDate) < new Date()).length,
      totalOfflineOrders: orders.filter((o) => o.orderType === 1).length,
      activeCustomers: customerIds.size,
      productsSold: unitsSold,
      totalProducts: unitsSold,
      totalProductsPrevious: previous.reduce((s, o) => s + o.items.reduce((q, i) => q + i.quantity, 0), 0),
      totalSales: sum(revenue),
      totalSalesPrevious: sum(previous),
      averageOrderValue: revenue.length ? sum(revenue) / revenue.length : 0,
      topPerformingStores: stores.map((s) => {
        const mine = revenue.filter((o) => o.storeId === s.storeId);
        return { storeId: s.storeId, storeName: s.storeName, totalOrders: mine.length, totalSales: sum(mine), productsSold: mine.reduce((q, o) => q + o.items.reduce((a, i) => a + i.quantity, 0), 0), activeCustomers: new Set(mine.map((o) => o.customerId)).size };
      }).sort((a, b) => b.totalSales - a.totalSales),
      topSellingCategories: categoryBreakdown(db, byProduct),
      topSellingProducts: [...products].sort((a, b) => b.totalSales - a.totalSales).slice(0, 5),
      lowSellingProducts: [...products].sort((a, b) => a.totalSales - b.totalSales).slice(0, 5),
      topCustomers,
      salesChart: trend(revenue, start, end, orderTotal),
      retentionRate: { newUsers: customerIds.size - returning, returningUsers: returning, labels: ["New", "Returning"], values: [customerIds.size - returning, returning] },
    };
  });

  router.add("GET", "Statistics/Sales", (ctx: Ctx) => {
    requireRole(ctx, ...ADMIN_ROLES);
    const { db, query } = ctx;
    const storeId = scopedStoreId(ctx, query.storeId);
    const categoryId = num(query.categoryId);
    const { start, end } = periodFor(query.dateRangeTimeline ?? "last30days");
    const orders = db.orders.filter((o) => (storeId === undefined || o.storeId === storeId) && inRange(o, start, end));
    const revenue = orders.filter(isRevenueOrder);
    const byProduct = productBreakdown(db, revenue, categoryId);
    const inCategory = (pid: number) => categoryId === undefined || findProduct(db, pid)?.categoryId === categoryId;
    const catOrders = categoryId === undefined ? revenue : revenue.filter((o) => o.items.some((i) => inCategory(i.productId)));
    const categoryAmount = (o: DbOrder) => o.items.filter((i) => inCategory(i.productId)).reduce((s, i) => s + i.price * i.quantity, 0);
    const totalSales = catOrders.reduce((s, o) => s + categoryAmount(o), 0);

    const catalogue = db.products.filter((p) => inCategory(p.productId));
    const stockOf = (pid: number) => storeId === undefined ? totalStock(db, findProduct(db, pid)!) : db.inventory.find((i) => i.productId === pid && i.storeId === storeId)?.quantity ?? 0;
    const inventoryValue = catalogue.reduce((s, p) => s + stockOf(p.productId) * p.costPrice, 0);
    const salesTrend = trend(catOrders, start, end, categoryAmount);

    return {
      totalProducts: catalogue.length,
      totalSales,
      totalOrders: catOrders.length,
      averageOrderValue: catOrders.length ? totalSales / catOrders.length : 0,
      lowStockProducts: catalogue.filter((p) => { const q = stockOf(p.productId); return q > 0 && q <= p.minimumStockLevel; }).length,
      outOfStockProducts: catalogue.filter((p) => stockOf(p.productId) <= 0).length,
      inventoryValue,
      topSellingProducts: [...byProduct].map(([productId, v]) => ({ productId, productName: findProduct(db, productId)!.productName, totalQuantity: v.qty, totalAmount: v.amount })).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 10),
      recentOrders: [...orders].sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1)).slice(0, 10).map((o) => ({ orderId: o.id, orderDate: o.orderDate, status: ORDER_STATUS[o.status].label, storeId: o.storeId, storeName: findStore(db, o.storeId)?.storeName ?? "", totalAmount: orderTotal(o) })),
      cashRemittanceByStore: db.stores.filter((s) => storeId === undefined || s.storeId === storeId).map((s) => ({ storeId: s.storeId, storeName: s.storeName, amount: revenue.filter((o) => o.storeId === s.storeId && o.paymentOption === 0).reduce((a, o) => a + orderTotal(o), 0) })),
      salesByCategory: categoryBreakdown(db, byProduct),
      salesTrend,
      // Walk current value backwards through the period's sales at cost to approximate the trend.
      inventoryValueTrend: { labels: salesTrend.labels, values: salesTrend.values.map((_, i) => Math.round(inventoryValue + salesTrend.values.slice(i + 1).reduce((s, v) => s + v * 0.7, 0))) },
    };
  });

  router.add("GET", "Customer/analytics", (ctx: Ctx) => {
    requireRole(ctx, ...ADMIN_ROLES);
    const { db, query } = ctx;
    const storeId = scopedStoreId(ctx, query.storeId);
    const { start, end } = periodFor(query.timeline ?? "year", query.startDate, query.endDate);
    const orders = db.orders.filter((o) => (storeId === undefined || o.storeId === storeId) && inRange(o, start, end) && isRevenueOrder(o));
    const shopperIds = new Set(orders.map((o) => o.customerId).filter(Boolean));
    const customers = storeId === undefined ? db.customers : db.customers.filter((c) => shopperIds.has(c.userId) || c.preferredStoreId === storeId);
    const tally = <T extends string>(labels: readonly T[], pick: (c: (typeof customers)[number]) => number) =>
      labels.map((label, i) => ({ label, count: customers.filter((c) => pick(c) === i).length }));
    const revenue = sum(orders);
    const repeat = [...shopperIds].filter((id) => orders.filter((o) => o.customerId === id).length > 1).length;
    const newInPeriod = customers.filter((c) => new Date(c.createdAt) >= start).length;
    const top = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);
    const complaints = db.complaints.filter((c) => storeId === undefined || c.storeId === storeId);
    const acquisition = trend(customers.map((c) => ({ orderDate: c.createdAt, items: [] }) as unknown as DbOrder), start, end, () => 1);

    return {
      period: { startDate: start.toISOString(), endDate: end.toISOString() },
      storeFilter: storeId ?? null,
      demographics: {
        totalCustomers: customers.length,
        byLoyaltyTier: tally(LOYALTY_TIER, (c) => c.loyaltyTier).map(({ label, count }) => ({ loyaltyTier: label, count })),
        byClassification: tally(CUSTOMER_CLASSIFICATION, (c) => c.customerClassification).map(({ label, count }) => ({ classification: label, count })),
        byKYCStatus: tally(KYC_STATUS, (c) => c.kycStatus).map(({ label, count }) => ({ kycStatus: label, count })),
        byStatus: tally(CUSTOMER_STATUS, (c) => c.customerStatus).map(({ label, count }) => ({ status: label, count })),
      },
      financialMetrics: {
        totalRevenue: revenue,
        averageOrderValue: orders.length ? revenue / orders.length : 0,
        revenuePerCustomer: shopperIds.size ? revenue / shopperIds.size : 0,
      },
      categoryDistribution: { totalRevenue: revenue, averageOrderValue: orders.length ? revenue / orders.length : 0, revenuePerCustomer: shopperIds.size ? revenue / shopperIds.size : 0 },
      activityMetrics: {
        activeCustomers: shopperIds.size,
        repeatCustomers: repeat,
        customerRetentionRate: shopperIds.size ? Math.round((repeat / shopperIds.size) * 1000) / 10 : 0,
        newCustomersInPeriod: newInPeriod,
      },
      topCustomers: top.map((c) => {
        const u = findUser(db, c.userId)!;
        return { customerId: c.id, customerName: `${u.firstName} ${u.lastName}`, email: u.email, loyaltyTier: LOYALTY_TIER[c.loyaltyTier], totalSpent: c.totalSpent, loyaltyPoints: c.loyaltyPoints };
      }),
      topCustomersByLifetimeValue: top.map((c) => {
        const u = findUser(db, c.userId)!;
        return { customerUserId: c.userId, customerName: `${u.firstName} ${u.lastName}`, email: u.email, customerClassification: c.customerClassification, totalSpent: c.totalSpent, loyaltyPoints: c.loyaltyPoints, loyaltyTier: LOYALTY_TIER[c.loyaltyTier], lastTransactionDate: c.lastTransactionDate, customerSince: c.createdAt };
      }),
      customerAcquisitionTrend: acquisition.labels.map((date, i) => ({ date, newCustomers: acquisition.values[i] })),
      ordersByLoyaltyTier: LOYALTY_TIER.map((tier, i) => ({ loyaltyTier: tier, orderCount: orders.filter((o) => db.customers.find((c) => c.userId === o.customerId)?.loyaltyTier === i).length })),
      paymentMethodPreferences: Object.entries(PAYMENT_OPTION).map(([k, label]) => ({ paymentMethod: label, count: orders.filter((o) => o.paymentOption === Number(k)).length })),
      complaints: {
        openComplaints: complaints.filter((c) => c.status === 0).length,
        inProgressComplaints: complaints.filter((c) => c.status === 1).length,
        resolvedComplaints: complaints.filter((c) => c.status >= 2).length,
      },
    };
  });

  router.add("GET", "customer-behaviour-analytics", (ctx: Ctx) => {
    requireRole(ctx, ...ADMIN_ROLES);
    const { db } = ctx;
    const storeId = scopedStoreId(ctx);
    const windowStart = Date.now() - (num(ctx.query.windowDays) ?? 90) * DAY;
    return {
      stores: db.stores.filter((s) => storeId === undefined || s.storeId === storeId).map((s) => {
        const all = db.orders.filter((o) => o.storeId === s.storeId && o.customerId);
        const recent = all.filter((o) => new Date(o.orderDate).getTime() >= windowStart);
        const ids = new Set(recent.map((o) => o.customerId));
        const returning = [...ids].filter((id) => all.some((o) => o.customerId === id && new Date(o.orderDate).getTime() < windowStart)).length;
        const loyal = [...ids].filter((id) => (db.customers.find((c) => c.userId === id)?.loyaltyTier ?? 0) > 0).length;
        return { storeId: s.storeId, storeName: s.storeName, newCustomers: ids.size - returning, returningCustomers: returning, loyaltyMembers: loyal, avgVisitsPerMonth: ids.size ? Math.round((recent.length / ids.size / 3) * 10) / 10 : 0 };
      }),
    };
  });

  router.add("GET", "store-migration-analytics", (ctx: Ctx) => {
    requireRole(ctx, ...ADMIN_ROLES);
    const from = Number(ctx.query.fromStoreId);
    const to = Number(ctx.query.toStoreId);
    const byCustomer = new Map<number, DbOrder[]>();
    for (const o of [...ctx.db.orders].sort((a, b) => (a.orderDate < b.orderDate ? -1 : 1))) {
      if (o.customerId) byCustomer.set(o.customerId, [...(byCustomer.get(o.customerId) ?? []), o]);
    }
    const migrationCount = [...byCustomer.values()].filter((list) => {
      const firstFrom = list.findIndex((o) => o.storeId === from);
      return firstFrom >= 0 && list.slice(firstFrom + 1).some((o) => o.storeId === to);
    }).length;
    return { fromStoreId: from, toStoreId: to, migrationCount };
  });

  router.add("GET", "regional-preferences-analytics", (ctx: Ctx) => {
    requireRole(ctx, ...ADMIN_ROLES);
    const { db } = ctx;
    const storeId = scopedStoreId(ctx);
    return {
      stores: db.stores.filter((s) => storeId === undefined || s.storeId === storeId).map((s) => {
        const cats = categoryBreakdown(db, productBreakdown(db, db.orders.filter((o) => o.storeId === s.storeId && isRevenueOrder(o))));
        const total = cats.reduce((a, c) => a + c.totalSales, 0) || 1;
        return { storeId: s.storeId, storeName: s.storeName, categories: cats.map((c) => ({ categoryId: c.categoryId, categoryName: c.categoryName, orderPercentage: Math.round((c.totalSales / total) * 1000) / 10 })) };
      }),
    };
  });
}
