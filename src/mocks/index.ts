import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { HttpError, createRouter, type Query } from "./http";
import { getDb } from "./db";
import { registerAuth, userFromToken } from "./handlers/auth";
import { registerStores } from "./handlers/stores";
import { registerUsers } from "./handlers/users";
import { registerCatalog } from "./handlers/catalog";
import { registerSales } from "./handlers/sales";
import { registerAnalytics } from "./handlers/analytics";

const router = createRouter();
registerAuth(router);
registerStores(router);
registerUsers(router);
registerCatalog(router);
registerSales(router);
registerAnalytics(router);

const LATENCY_MS = 250;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function toQuery(url: string, params?: Record<string, unknown>): { path: string; query: Query } {
  const [path, search = ""] = url.split("?");
  const query: Query = Object.fromEntries(new URLSearchParams(search));
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined && v !== null && v !== "") query[k] = String(v);
  }
  return { path, query };
}

/**
 * Drop-in replacement for fetchBaseQuery that serves requests from the local
 * JSON seed. Handlers enforce the same auth and role rules a real API would.
 */
export const mockBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api) => {
    const getToken = () => (api.getState() as { auth: { accessToken: string | null } }).auth.accessToken;
    const { url, method = "GET", body, params } = typeof args === "string" ? { url: args } : args;
    const { path, query } = toQuery(url, params);
    await wait(LATENCY_MS);

    const db = await getDb();
    const match = router.match(method.toUpperCase(), path);
    if (!match) return { error: { status: 404, data: { message: `No mock handler for ${method} ${path}` } } };

    const user = userFromToken(db, getToken());
    if (!match.route.isPublic && !user) {
      return { error: { status: 401, data: { message: "Authentication required" } } };
    }

    try {
      const data = await match.route.handler({ db, params: match.params, query, body, user });
      // Round-trip through JSON so callers never hold references into the mock DB.
      return { data: data === undefined ? null : JSON.parse(JSON.stringify(data)) };
    } catch (err) {
      if (err instanceof HttpError) return { error: { status: err.status, data: { message: err.message } } };
      console.error("[mock api]", method, path, err);
      return { error: { status: 500, data: { message: "Unexpected error" } } };
    }
  };
