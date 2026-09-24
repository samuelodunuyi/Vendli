import { badRequest, notFound, now, num, paginate, requireRole, requireUser, assertStoreAccess, type Ctx, type createRouter } from "../http";
import { nextId, persist } from "../db";
import { findStore, findUser, toStoreDto } from "../views";
import { UserRole, isStoreScoped } from "@/lib/roles";

const pickStoreFields = (body: Record<string, unknown>) => ({
  storeName: String(body.storeName ?? "").trim(),
  storeAddress: String(body.storeAddress ?? "").trim(),
  storePhoneNumber: String(body.storePhoneNumber ?? "").trim(),
  storeEmailAddress: String(body.storeEmailAddress ?? "").trim(),
  storeType: String(body.storeType ?? "Retail").trim(),
});

export function registerStores(router: ReturnType<typeof createRouter>) {
  router.add("GET", "Store", (ctx: Ctx) => {
    const user = requireUser(ctx);
    const rows = isStoreScoped(user.roleId) ? ctx.db.stores.filter((s) => s.storeId === user.storeId) : ctx.db.stores;
    const { items, pagination } = paginate(rows, ctx.query, 100);
    return { stores: items.map((s) => toStoreDto(ctx.db, s)), pagination };
  });

  router.add("GET", "Store/:id", (ctx: Ctx) => {
    const store = findStore(ctx.db, Number(ctx.params.id));
    if (!store) throw notFound("Store");
    assertStoreAccess(ctx, store.storeId);
    return toStoreDto(ctx.db, store);
  });

  router.add("POST", "Store", (ctx: Ctx) => {
    requireRole(ctx, UserRole.SuperAdmin);
    const fields = pickStoreFields(ctx.body ?? {});
    if (!fields.storeName) throw badRequest("Store name is required");
    const admin = findUser(ctx.db, num(String(ctx.body?.userId ?? "")));
    const store = {
      storeId: nextId(ctx.db.stores, "storeId"),
      ...fields,
      isActive: true,
      userId: admin?.id ?? null,
      storeAdmin: admin ? `${admin.firstName} ${admin.lastName}` : "",
      createdAt: now(),
      updatedAt: now(),
    };
    ctx.db.stores.push(store);
    persist();
    return toStoreDto(ctx.db, store);
  });

  router.add("PUT", "Store/:id", (ctx: Ctx) => {
    const user = requireRole(ctx, UserRole.SuperAdmin, UserRole.StoreAdmin);
    const store = findStore(ctx.db, Number(ctx.params.id));
    if (!store) throw notFound("Store");
    assertStoreAccess(ctx, store.storeId);
    Object.assign(store, pickStoreFields({ ...store, ...ctx.body }), { updatedAt: now() });
    // Only super admins decide who runs a store and whether it is open.
    if (user.roleId === UserRole.SuperAdmin) {
      if (typeof ctx.body?.isActive === "boolean") store.isActive = ctx.body.isActive;
      const admin = findUser(ctx.db, Number(ctx.body?.userId));
      if (admin) {
        store.userId = admin.id;
        store.storeAdmin = `${admin.firstName} ${admin.lastName}`;
      }
    }
    persist();
    return toStoreDto(ctx.db, store);
  });

  router.add("DELETE", "Store/:id", (ctx: Ctx) => {
    requireRole(ctx, UserRole.SuperAdmin);
    const id = Number(ctx.params.id);
    if (ctx.db.orders.some((o) => o.storeId === id)) {
      throw badRequest("Stores with order history cannot be deleted. Deactivate it instead.");
    }
    ctx.db.stores = ctx.db.stores.filter((s) => s.storeId !== id);
    persist();
    return { success: true };
  });
}
