import { HttpError, badRequest, requireUser, type Ctx, type createRouter } from "../http";
import { persist } from "../db";
import { findStore, findUser } from "../views";
import type { Db, DbUser } from "../types";
import { UserRole } from "@/lib/roles";

const ACCESS_TTL_MS = 30 * 60 * 1000;

const encode = (payload: object) => `mock.${btoa(JSON.stringify(payload))}`;

export function userFromToken(db: Db, token: string | null): DbUser | null {
  if (!token?.startsWith("mock.")) return null;
  try {
    const { sub, exp } = JSON.parse(atob(token.slice(5)));
    if (typeof exp !== "number" || exp < Date.now()) return null;
    const user = findUser(db, sub);
    return user?.isActive ? user : null;
  } catch {
    return null;
  }
}

function issueTokens(db: Db, user: DbUser) {
  const refreshToken = crypto.randomUUID();
  db.sessions = db.sessions.filter((s) => s.userId !== user.id).concat({ refreshToken, userId: user.id });
  persist();
  return {
    accessToken: encode({ sub: user.id, role: user.roleId, exp: Date.now() + ACCESS_TTL_MS }),
    refreshToken,
    expiresAt: Date.now() + ACCESS_TTL_MS,
  };
}

function authResponse(db: Db, user: DbUser) {
  const store = findStore(db, user.storeId);
  return {
    ...issueTokens(db, user),
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    phoneNumber: user.phoneNumber,
    role: user.roleId,
    store: store ? { storeId: store.storeId, storeName: store.storeName } : null,
  };
}

export function registerAuth(router: ReturnType<typeof createRouter>) {
  router.add(
    "POST",
    "Auth/login",
    ({ db, body }: Ctx) => {
      const email = String(body?.email ?? "").trim().toLowerCase();
      const user = db.users.find((u) => u.email.toLowerCase() === email);
      // Same message for unknown email and bad password so accounts can't be enumerated.
      if (!user || !user.password || user.password !== body?.password) {
        throw new HttpError(401, "Invalid email or password");
      }
      if (!user.isActive) throw new HttpError(403, "This account has been disabled. Contact your administrator.");
      if (user.roleId === UserRole.Customer) throw new HttpError(403, "This portal is for staff accounts only.");
      return authResponse(db, user);
    },
    true
  );

  router.add(
    "POST",
    "Auth/refresh-token",
    ({ db, body }: Ctx) => {
      const session = db.sessions.find((s) => s.refreshToken === body?.refreshToken);
      const user = session && findUser(db, session.userId);
      if (!user?.isActive) throw new HttpError(401, "Session expired");
      return issueTokens(db, user);
    },
    true
  );

  router.add(
    "POST",
    "Auth/logout",
    ({ db, body }: Ctx) => {
      db.sessions = db.sessions.filter((s) => s.refreshToken !== body?.refreshToken);
      persist();
      return { message: "Logged out" };
    },
    true
  );

  router.add("POST", "Auth/change-password", (ctx: Ctx) => {
    const user = requireUser(ctx);
    const { oldPassword, newPassword } = ctx.body ?? {};
    if (user.password !== oldPassword) throw badRequest("Current password is incorrect");
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      throw badRequest("New password must be at least 8 characters");
    }
    user.password = newPassword;
    persist();
    return { message: "Password updated" };
  });
}
