import { badRequest, contains, forbidden, notFound, now, num, paginate, requireRole, requireUser, scopedStoreId, type Ctx, type createRouter } from "../http";
import { nextId, persist } from "../db";
import { findCategory, findProduct, findStore, stockStatus, storeStock, toProductDto, toTransactionDto, userSummary, findUser } from "../views";
import type { Db, DbProduct, DbUser } from "../types";
import { UserRole } from "@/lib/roles";
import { INVENTORY_TX_TYPE } from "@/lib/enums";

const ADMINS = [UserRole.SuperAdmin, UserRole.StoreAdmin] as const;

const bool = (v: string | undefined) => (v === undefined ? undefined : v === "true");

const PRODUCT_FIELDS = [
  "productName", "description", "sku", "barcode", "categoryId", "basePrice", "costPrice", "unitOfMeasure",
  "imageUrl", "showInWeb", "showInPOS", "isActive", "minimumStockLevel", "maximumStockLevel",
] as const;

function applyProductFields(db: Db, product: Partial<DbProduct>, body: Record<string, unknown>) {
  for (const key of PRODUCT_FIELDS) {
    if (body[key] !== undefined) (product as Record<string, unknown>)[key] = body[key];
  }
  for (const key of ["categoryId", "basePrice", "costPrice", "minimumStockLevel", "maximumStockLevel"] as const) {
    if (product[key] !== undefined) product[key] = Number(product[key]);
  }
  if (!product.productName?.trim()) throw badRequest("Product name is required");
  if (!(Number(product.basePrice) > 0)) throw badRequest("Price must be greater than zero");
  if (!findCategory(db, Number(product.categoryId))) throw badRequest("A valid category is required");
}

function adjustStock(db: Db, user: DbUser, productId: number, storeId: number | undefined, delta: number, type: number, reference: string, reason: string) {
  const product = findProduct(db, productId);
  if (!product) throw notFound("Product");
  if (storeId) {
    let row = storeStock(db, productId, storeId);
    if (!row) {
      row = { storeId, productId, quantity: 0, createdAt: now(), updatedAt: now(), updatedBy: user.id };
      db.inventory.push(row);
    }
    if (row.quantity + delta < 0) throw badRequest(`Only ${row.quantity} units available in this store`);
    row.quantity += delta;
    row.updatedAt = now();
    row.updatedBy = user.id;
  } else {
    if (product.warehouseStock + delta < 0) throw badRequest(`Only ${product.warehouseStock} units in the warehouse`);
    product.warehouseStock += delta;
  }
  db.transactions.unshift({
    id: nextId(db.transactions, "id"),
    type,
    storeId: storeId ?? 0,
    productId,
    quantity: Math.abs(delta),
    reference,
    reason,
    createdBy: user.id,
    createdOn: now(),
  });
  return product;
}

export function registerCatalog(router: ReturnType<typeof createRouter>) {
  // ---------------- Products ----------------
  router.add("GET", "Product", (ctx: Ctx) => {
    const user = requireUser(ctx);
    const storeId = scopedStoreId(ctx, ctx.query.storeId);
    const categoryId = num(ctx.query.categoryId);
    const filters = { isActive: bool(ctx.query.isActive), showInWeb: bool(ctx.query.showInWeb), showInPOS: bool(ctx.query.showInPOS) };
    // POS staff should only ever see sellable items.
    if (user.roleId === UserRole.Employee) Object.assign(filters, { isActive: true, showInPOS: true });

    const rows = ctx.db.products
      .filter((p) => categoryId === undefined || p.categoryId === categoryId)
      .filter((p) => Object.entries(filters).every(([k, v]) => v === undefined || p[k as keyof DbProduct] === v))
      .filter((p) => contains([p.productName, p.sku, p.barcode], ctx.query.search));
    const { items, pagination } = paginate(rows, ctx.query, 100);
    return { products: items.map((p) => toProductDto(ctx.db, p, storeId)), pagination };
  });

  router.add("GET", "Product/:id", (ctx: Ctx) => {
    const p = findProduct(ctx.db, Number(ctx.params.id));
    if (!p) throw notFound("Product");
    return toProductDto(ctx.db, p, scopedStoreId(ctx));
  });

  // The catalogue is shared by every store, so only super admins may change it.
  router.add("POST", "Product", (ctx: Ctx) => {
    const user = requireRole(ctx, UserRole.SuperAdmin);
    const product = { warehouseStock: 0, createdAt: now(), updatedAt: now(), createdBy: user.id, imageUrl: "", showInWeb: true, showInPOS: true, isActive: true, minimumStockLevel: 5, maximumStockLevel: 100, costPrice: 0 } as DbProduct;
    applyProductFields(ctx.db, product, ctx.body ?? {});
    product.productId = nextId(ctx.db.products, "productId");
    product.sku ||= `VD-${String(product.categoryId).padStart(2, "0")}${String(product.productId).padStart(3, "0")}`;
    ctx.db.products.push(product);
    const opening = Number(ctx.body?.basestock) || 0;
    if (opening > 0) adjustStock(ctx.db, user, product.productId, scopedStoreId(ctx), opening, 0, "OPENING", "Opening stock");
    persist();
    return toProductDto(ctx.db, product);
  });

  const updateProduct = (ctx: Ctx) => {
    requireRole(ctx, UserRole.SuperAdmin);
    const product = findProduct(ctx.db, Number(ctx.params.id));
    if (!product) throw notFound("Product");
    applyProductFields(ctx.db, product, { ...product, ...ctx.body });
    product.updatedAt = now();
    persist();
    return toProductDto(ctx.db, product);
  };
  router.add("PUT", "Product/:id", updateProduct);
  router.add("PATCH", "Product/:id", updateProduct);

  router.add("DELETE", "Product/:id", (ctx: Ctx) => {
    requireRole(ctx, UserRole.SuperAdmin);
    const id = Number(ctx.params.id);
    const product = findProduct(ctx.db, id);
    if (!product) throw notFound("Product");
    // Keep history intact: products that have been sold are archived, not removed.
    if (ctx.db.orders.some((o) => o.items.some((i) => i.productId === id))) product.isActive = false;
    else ctx.db.products = ctx.db.products.filter((p) => p.productId !== id);
    persist();
    return null;
  });

  const restock = (direction: 1 | -1) => (ctx: Ctx) => {
    const user = requireRole(ctx, ...ADMINS);
    const qty = Number(ctx.body?.quantity);
    if (!(qty > 0)) throw badRequest("Quantity must be greater than zero");
    const storeId = scopedStoreId(ctx, ctx.body?.storeId);
    const product = adjustStock(ctx.db, user, Number(ctx.body?.productId), storeId, direction * qty, direction > 0 ? 0 : 2, ctx.body?.reference || "MANUAL", ctx.body?.reason || (direction > 0 ? "Restock" : "Stock removal"));
    persist();
    const dto = toProductDto(ctx.db, product, storeId);
    return { message: direction > 0 ? "Stock added" : "Stock removed", productId: product.productId, basestock: dto.basestock };
  };
  router.add("POST", "Products/restock", restock(1));
  router.add("POST", "Products/unstock", restock(-1));

  router.add("POST", "Product/upload-image", () => {
    throw badRequest("Image upload is not available in demo mode");
  });

  // ---------------- Categories ----------------
  router.add("GET", "Category", (ctx: Ctx) => {
    requireUser(ctx);
    const isActive = bool(ctx.query.isActive);
    const rows = ctx.db.categories.filter((c) => isActive === undefined || c.isActive === isActive);
    const { items, pagination } = paginate(rows, ctx.query, 100);
    return { categories: items, pagination };
  });

  router.add("GET", "Category/:id", (ctx: Ctx) => {
    requireUser(ctx);
    const c = findCategory(ctx.db, Number(ctx.params.id));
    if (!c) throw notFound("Category");
    return c;
  });

  router.add("POST", "Category", (ctx: Ctx) => {
    requireRole(ctx, UserRole.SuperAdmin);
    const name = String(ctx.body?.categoryName ?? "").trim();
    if (!name) throw badRequest("Category name is required");
    const category = { categoryId: nextId(ctx.db.categories, "categoryId"), categoryName: name, description: String(ctx.body?.description ?? ""), storeId: 0, isActive: true, createdAt: now(), updatedAt: now() };
    ctx.db.categories.push(category);
    persist();
    return category;
  });

  const updateCategory = (ctx: Ctx) => {
    requireRole(ctx, UserRole.SuperAdmin);
    const c = findCategory(ctx.db, Number(ctx.params.id));
    if (!c) throw notFound("Category");
    if (ctx.body?.categoryName !== undefined) c.categoryName = String(ctx.body.categoryName).trim();
    if (ctx.body?.description !== undefined) c.description = String(ctx.body.description);
    c.updatedAt = now();
    persist();
    return c;
  };
  router.add("PUT", "Category/:id", updateCategory);
  router.add("PATCH", "Category/:id", updateCategory);

  router.add("DELETE", "Category/:id", (ctx: Ctx) => {
    requireRole(ctx, UserRole.SuperAdmin);
    const id = Number(ctx.params.id);
    if (ctx.db.products.some((p) => p.categoryId === id)) throw badRequest("Move or delete this category's products first");
    ctx.db.categories = ctx.db.categories.filter((c) => c.categoryId !== id);
    persist();
    return null;
  });

  // ---------------- Inventory ----------------
  router.add("GET", "Inventory/inventory-products", (ctx: Ctx) => {
    requireRole(ctx, ...ADMINS);
    const storeId = scopedStoreId(ctx, ctx.query.storeId);
    const productId = num(ctx.query.productId);
    const categoryId = num(ctx.query.categoryId);
    const rows = ctx.db.inventory
      .filter((i) => storeId === undefined || i.storeId === storeId)
      .filter((i) => productId === undefined || i.productId === productId)
      .map((i) => ({ i, p: findProduct(ctx.db, i.productId)!, s: findStore(ctx.db, i.storeId)! }))
      .filter(({ p, s }) => p && s)
      .filter(({ p }) => categoryId === undefined || p.categoryId === categoryId)
      .filter(({ p }) => contains([p.productName, p.sku], ctx.query.customSearch ?? ctx.query.sku));
    const { items, pagination } = paginate(rows, ctx.query, 100);
    return {
      items: items.map(({ i, p, s }) => {
        const category = findCategory(ctx.db, p.categoryId);
        return {
          store: { id: s.storeId, name: s.storeName },
          product: { id: p.productId, name: p.productName, sku: p.sku, barcode: p.barcode, description: p.description, category: category ? { id: category.categoryId, name: category.categoryName } : null, imageUrl: p.imageUrl, unitOfMeasure: p.unitOfMeasure, basePrice: p.basePrice, minimumStockLevel: p.minimumStockLevel, showInWeb: p.showInWeb, isActive: p.isActive },
          quantity: i.quantity,
          price: p.basePrice,
          stockStatus: stockStatus(i.quantity, p.minimumStockLevel),
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
          updatedBy: userSummary(findUser(ctx.db, i.updatedBy)),
        };
      }),
      pagination,
    };
  });

  router.add("POST", "Inventory/bulk-product-stock-adjustment/:productId", (ctx: Ctx) => {
    const user = requireRole(ctx, UserRole.SuperAdmin);
    const productId = Number(ctx.params.productId);
    const product = findProduct(ctx.db, productId);
    if (!product) throw notFound("Product");
    const adjustments: { storeId: number; newQuantity: number; reason: string; reference: string }[] = Array.isArray(ctx.body) ? ctx.body : [];
    const updates = adjustments.map((a) => {
      const storeId = scopedStoreId(ctx, a.storeId)!;
      const previousQuantity = storeStock(ctx.db, productId, storeId)?.quantity ?? 0;
      const delta = Number(a.newQuantity) - previousQuantity;
      if (delta > product.warehouseStock) throw badRequest(`Only ${product.warehouseStock} units left in the warehouse`);
      if (delta !== 0) {
        adjustStock(ctx.db, user, productId, storeId, delta, 3, a.reference, a.reason);
        product.warehouseStock -= delta;
      }
      return { storeId, productId, previousQuantity, newQuantity: Number(a.newQuantity), delta, updated: delta !== 0 };
    });
    persist();
    return { productId, updates, totalUpdated: updates.filter((u) => u.updated).length };
  });

  router.add("GET", "Inventory/transactions", (ctx: Ctx) => {
    requireRole(ctx, ...ADMINS);
    const storeId = scopedStoreId(ctx, ctx.query.storeId);
    const productId = num(ctx.query.productId);
    const typeKey = ctx.query.type;
    const typeIndex = typeKey === undefined ? undefined : ["in", "out", "adjustment", "transfer"].indexOf(typeKey) >= 0 ? ["in", "out", "adjustment", "transfer"].indexOf(typeKey) : num(typeKey);
    const from = ctx.query.startDate ? new Date(ctx.query.startDate).getTime() : -Infinity;
    const to = ctx.query.endDate ? new Date(ctx.query.endDate).getTime() : Infinity;
    const rows = ctx.db.transactions
      .filter((t) => storeId === undefined || t.storeId === storeId || t.toStoreId === storeId)
      .filter((t) => productId === undefined || t.productId === productId)
      .filter((t) => typeIndex === undefined || t.type === typeIndex)
      .filter((t) => {
        const at = new Date(t.createdOn).getTime();
        return at >= from && at <= to;
      });
    const { items, pagination } = paginate(rows, ctx.query, 200);
    const transactions = items.map((t) => toTransactionDto(ctx.db, t));
    return {
      transactions,
      items: transactions,
      pagination,
      summary: INVENTORY_TX_TYPE.map((_, type) => {
        const ofType = rows.filter((t) => t.type === type);
        return { type, count: ofType.length, totalQuantity: ofType.reduce((s, t) => s + t.quantity, 0) };
      }),
    };
  });

  router.add("POST", "Inventory/transactions", (ctx: Ctx) => {
    const user = requireRole(ctx, ...ADMINS);
    const b = ctx.body ?? {};
    const type = Number(b.transactionType);
    const qty = Math.abs(Number(b.quantity));
    if (!(qty > 0)) throw badRequest("Quantity must be greater than zero");
    if (type === 3) {
      // Moving stock between stores is a network decision, so only super admins can do it.
      if (user.roleId !== UserRole.SuperAdmin) throw forbidden("Only a super admin can transfer stock between stores");
      const from = scopedStoreId(ctx, b.fromStore);
      const to = Number(b.toStore);
      if (!from || !findStore(ctx.db, to) || from === to) throw badRequest("Choose two different stores for a transfer");
      adjustStock(ctx.db, user, Number(b.productId), from, -qty, 3, b.reference || "TRANSFER", b.reason);
      adjustStock(ctx.db, user, Number(b.productId), to, qty, 0, b.reference || "TRANSFER", `Transfer from ${findStore(ctx.db, from)?.storeName}`);
      ctx.db.transactions[1].toStoreId = to;
    } else {
      const storeId = scopedStoreId(ctx, b.storeId);
      if (!storeId) throw badRequest("Select a store");
      const delta = type === 0 ? qty : type === 1 ? -qty : Number(b.quantity);
      adjustStock(ctx.db, user, Number(b.productId), storeId, delta, type, b.reference || "MANUAL", b.reason);
    }
    persist();
    return toTransactionDto(ctx.db, ctx.db.transactions[0]);
  });
}
