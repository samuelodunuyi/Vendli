import { HttpError, badRequest, contains, forbidden, notFound, now, num, paginate, requireRole, type Ctx, type createRouter } from "../http";
import { nextId, persist } from "../db";
import { findStore, findUser, toUserDto } from "../views";
import type { DbUser } from "../types";
import { ROLE_LABELS, UserRole, assignableRoles } from "@/lib/roles";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parseRole = (value: unknown): UserRole | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const asNum = Number(value);
  if (!Number.isNaN(asNum) && asNum in ROLE_LABELS) return asNum;
  const entry = Object.entries(ROLE_LABELS).find(([, label]) => label.toLowerCase() === String(value).toLowerCase());
  return entry ? (Number(entry[0]) as UserRole) : undefined;
};

/** Users an actor may see and manage. Store admins only manage staff in their store. */
const canManage = (actor: DbUser, target: DbUser) => {
  if (actor.roleId === UserRole.SuperAdmin) return true;
  return actor.roleId === UserRole.StoreAdmin && target.storeId === actor.storeId && target.roleId === UserRole.Employee;
};

const visibleTo = (actor: DbUser, target: DbUser) =>
  actor.roleId === UserRole.SuperAdmin ||
  (target.storeId === actor.storeId && target.roleId !== UserRole.Customer);

function applyRoleAndStore(ctx: Ctx, actor: DbUser, target: Partial<DbUser>, roleInput: unknown, storeInput: unknown) {
  const role = parseRole(roleInput) ?? target.roleId;
  if (role === undefined || !assignableRoles(actor.roleId).includes(role)) {
    throw forbidden("You are not allowed to assign that role");
  }
  let storeId = storeInput === undefined || storeInput === null || storeInput === "" ? target.storeId ?? null : Number(storeInput);
  if (actor.roleId === UserRole.StoreAdmin) storeId = actor.storeId;
  if (role === UserRole.SuperAdmin) storeId = null;
  if (role !== UserRole.SuperAdmin && !findStore(ctx.db, storeId)) throw badRequest("A valid store is required for this role");
  target.roleId = role;
  target.storeId = storeId;
}

function syncStoreAdmin(ctx: Ctx, user: DbUser) {
  if (user.roleId !== UserRole.StoreAdmin) return;
  const store = findStore(ctx.db, user.storeId);
  if (store) {
    store.userId = user.id;
    store.storeAdmin = `${user.firstName} ${user.lastName}`;
  }
}

export function registerUsers(router: ReturnType<typeof createRouter>) {
  router.add("GET", "UserManagement/get-users", (ctx: Ctx) => {
    const actor = requireRole(ctx, UserRole.SuperAdmin, UserRole.StoreAdmin);
    const role = parseRole(ctx.query.role);
    const storeId = num(ctx.query.storeId);
    const visible = ctx.db.users.filter((u) => visibleTo(actor, u));
    const rows = visible
      // Customers have their own section; only list them when explicitly asked for.
      .filter((u) => (role === undefined ? u.roleId !== UserRole.Customer : u.roleId === role))
      .filter((u) => storeId === undefined || u.storeId === storeId)
      .filter((u) => contains([u.firstName, u.lastName, u.email, u.phoneNumber], ctx.query.search))
      .sort((a, b) => a.roleId - b.roleId || a.firstName.localeCompare(b.firstName));
    const { items, pagination } = paginate(rows, ctx.query);
    const count = (r: UserRole) => visible.filter((u) => u.roleId === r).length;
    return {
      users: items.map((u) => toUserDto(ctx.db, u)),
      pagination,
      tiles: {
        activeUsers: visible.filter((u) => u.isActive).length,
        superAdmins: count(UserRole.SuperAdmin),
        storeAdmins: count(UserRole.StoreAdmin),
        employees: count(UserRole.Employee),
        customers: count(UserRole.Customer),
      },
    };
  });

  router.add("POST", "UserManagement/create-user", (ctx: Ctx) => {
    const actor = requireRole(ctx, UserRole.SuperAdmin, UserRole.StoreAdmin);
    const b = ctx.body ?? {};
    const email = String(b.email ?? "").trim().toLowerCase();
    if (!EMAIL.test(email)) throw badRequest("A valid email is required");
    if (!b.firstName || !b.lastName) throw badRequest("First and last name are required");
    if (typeof b.password !== "string" || b.password.length < 8) throw badRequest("Password must be at least 8 characters");
    if (ctx.db.users.some((u) => u.email.toLowerCase() === email)) throw new HttpError(409, "A user with this email already exists");

    const user: DbUser = {
      id: nextId(ctx.db.users, "id"),
      firstName: String(b.firstName).trim(),
      lastName: String(b.lastName).trim(),
      email,
      username: email,
      password: b.password,
      phoneNumber: String(b.phoneNumber ?? ""),
      roleId: UserRole.Employee,
      storeId: null,
      isActive: true,
      joinedDate: b.joinedDate ? new Date(b.joinedDate).toISOString() : now(),
      createdAt: now(),
    };
    applyRoleAndStore(ctx, actor, user, b.roleId ?? b.role, b.storeId);
    ctx.db.users.push(user);
    syncStoreAdmin(ctx, user);
    persist();
    return { message: "User created" };
  });

  router.add("PUT", "UserManagement/edit/:id", (ctx: Ctx) => {
    const actor = requireRole(ctx, UserRole.SuperAdmin, UserRole.StoreAdmin);
    const user = findUser(ctx.db, Number(ctx.params.id));
    if (!user || !visibleTo(actor, user)) throw notFound("User");
    if (!canManage(actor, user)) throw forbidden();
    const b = ctx.body ?? {};
    if (b.email && String(b.email).toLowerCase() !== user.email) {
      const email = String(b.email).trim().toLowerCase();
      if (!EMAIL.test(email)) throw badRequest("A valid email is required");
      if (ctx.db.users.some((u) => u.id !== user.id && u.email === email)) throw new HttpError(409, "Email already in use");
      user.email = user.username = email;
    }
    if (b.firstName) user.firstName = String(b.firstName).trim();
    if (b.lastName) user.lastName = String(b.lastName).trim();
    if (b.phoneNumber !== undefined) user.phoneNumber = String(b.phoneNumber);
    if (b.joinedDate) user.joinedDate = new Date(b.joinedDate).toISOString();
    if (b.password) {
      if (typeof b.password !== "string" || b.password.length < 8) throw badRequest("Password must be at least 8 characters");
      user.password = b.password;
      ctx.db.sessions = ctx.db.sessions.filter((s) => s.userId !== user.id);
    }
    if (user.id === actor.id && parseRole(b.roleId) !== undefined && parseRole(b.roleId) !== user.roleId) {
      throw forbidden("You cannot change your own role");
    }
    if (user.id !== actor.id) applyRoleAndStore(ctx, actor, user, b.roleId, b.storeId);
    syncStoreAdmin(ctx, user);
    persist();
    return { message: "User updated" };
  });

  router.add("PUT", "UserManagement/set-user-status", (ctx: Ctx) => {
    const actor = requireRole(ctx, UserRole.SuperAdmin, UserRole.StoreAdmin);
    const user = findUser(ctx.db, Number(ctx.query.userId));
    if (!user || !visibleTo(actor, user)) throw notFound("User");
    if (user.id === actor.id) throw forbidden("You cannot change your own status");
    if (!canManage(actor, user)) throw forbidden();
    user.isActive = ctx.query.isActive === "true";
    if (!user.isActive) ctx.db.sessions = ctx.db.sessions.filter((s) => s.userId !== user.id);
    persist();
    return { message: user.isActive ? "User activated" : "User disabled" };
  });

  router.add("DELETE", "UserManagement/delete-user/:id", (ctx: Ctx) => {
    const actor = requireRole(ctx, UserRole.SuperAdmin, UserRole.StoreAdmin);
    const user = findUser(ctx.db, Number(ctx.params.id));
    if (!user || !visibleTo(actor, user)) throw notFound("User");
    if (user.id === actor.id) throw forbidden("You cannot delete your own account");
    if (!canManage(actor, user)) throw forbidden();
    ctx.db.users = ctx.db.users.filter((u) => u.id !== user.id);
    ctx.db.sessions = ctx.db.sessions.filter((s) => s.userId !== user.id);
    persist();
    return { message: "User deleted" };
  });

  router.add("POST", "UserManagement/assign-store-admin", (ctx: Ctx) => {
    const actor = requireRole(ctx, UserRole.SuperAdmin);
    const user = findUser(ctx.db, Number(ctx.body?.userId));
    if (!user) throw notFound("User");
    applyRoleAndStore(ctx, actor, user, UserRole.StoreAdmin, ctx.body?.storeId);
    syncStoreAdmin(ctx, user);
    persist();
    return { message: "Store admin assigned" };
  });
}
