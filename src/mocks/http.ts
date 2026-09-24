import type { Db, DbUser } from "./types";
import { UserRole, isStoreScoped } from "@/lib/roles";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const badRequest = (message: string) => new HttpError(400, message);
export const forbidden = (message = "You do not have permission to perform this action") =>
  new HttpError(403, message);
export const notFound = (what = "Resource") => new HttpError(404, `${what} not found`);

export type Query = Record<string, string>;

export interface Ctx {
  db: Db;
  params: Record<string, string>;
  query: Query;
  body: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  user: DbUser | null;
}

export type Handler = (ctx: Ctx) => unknown;

interface Route {
  method: string;
  regex: RegExp;
  keys: string[];
  handler: Handler;
  isPublic: boolean;
}

export function createRouter() {
  const routes: Route[] = [];

  const add = (method: string, pattern: string, handler: Handler, isPublic = false) => {
    const keys: string[] = [];
    const source = pattern
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .map((seg) => {
        if (!seg.startsWith(":")) return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        keys.push(seg.slice(1));
        return "([^/]+)";
      })
      .join("/");
    routes.push({ method, regex: new RegExp(`^${source}$`, "i"), keys, handler, isPublic });
  };

  const match = (method: string, path: string) => {
    const clean = path.replace(/^\/+|\/+$/g, "");
    // Static segments win over params, so "Customer/analytics" beats "Customer/:id".
    for (const r of [...routes].sort((a, b) => a.keys.length - b.keys.length)) {
      if (r.method !== method) continue;
      const m = clean.match(r.regex);
      if (m) {
        const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
        return { route: r, params };
      }
    }
    return null;
  };

  return { add, match };
}

// ---------- shared helpers used by handlers ----------

export const num = (v: string | undefined) => (v === undefined || v === "" ? undefined : Number(v));

export function paginate<T>(rows: T[], query: Query, defaultSize = 10) {
  const itemsPerPage = Math.max(1, num(query.itemsPerPage) ?? defaultSize);
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentPage = Math.min(Math.max(1, num(query.page) ?? 1), totalPages);
  const start = (currentPage - 1) * itemsPerPage;
  return {
    items: rows.slice(start, start + itemsPerPage),
    pagination: {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}

export const requireUser = (ctx: Ctx) => {
  if (!ctx.user) throw new HttpError(401, "Authentication required");
  return ctx.user;
};

export const requireRole = (ctx: Ctx, ...roles: UserRole[]) => {
  const user = requireUser(ctx);
  if (!roles.includes(user.roleId)) throw forbidden();
  return user;
};

/**
 * Resolves the store a request is allowed to see. Store-scoped users are pinned
 * to their own store no matter what they ask for; super admins get what they asked.
 */
export const scopedStoreId = (ctx: Ctx, requested?: number | string | null) => {
  const user = requireUser(ctx);
  const asked = requested === undefined || requested === null || requested === "" ? undefined : Number(requested);
  if (!isStoreScoped(user.roleId)) return asked;
  if (asked !== undefined && asked !== 0 && asked !== user.storeId) {
    throw forbidden("You can only access data for your own store");
  }
  return user.storeId ?? undefined;
};

export const assertStoreAccess = (ctx: Ctx, storeId: number | null | undefined) => {
  const user = requireUser(ctx);
  if (isStoreScoped(user.roleId) && storeId !== user.storeId) {
    throw forbidden("You can only access data for your own store");
  }
};

export const contains = (haystack: (string | number | null | undefined)[], needle?: string) => {
  if (!needle) return true;
  const q = needle.toLowerCase();
  return haystack.some((h) => h !== null && h !== undefined && String(h).toLowerCase().includes(q));
};

export const now = () => new Date().toISOString();
