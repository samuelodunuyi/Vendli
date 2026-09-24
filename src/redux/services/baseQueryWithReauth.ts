import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { signedOut, tokensRefreshed } from "../slices/authSlice";
import { API_URL, USE_MOCK_API } from "@/config";

type BaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;
type AuthState = { auth: { accessToken: string | null; refreshToken: string | null } };

const httpQuery: BaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as AuthState).auth;
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    return headers;
  },
});

// The mock server (and its 500KB seed) is only downloaded when mock mode is on.
let mockQuery: Promise<BaseQuery> | null = null;
const rawQuery: BaseQuery = async (args, api, extra) => {
  if (!USE_MOCK_API) return httpQuery(args, api, extra);
  mockQuery ??= import("@/mocks").then((m) => m.mockBaseQuery);
  return (await mockQuery)(args, api, extra);
};

const isAuthCall = (args: string | FetchArgs) => (typeof args === "string" ? args : args.url).replace(/^\//, "").startsWith("Auth/");

// One refresh at a time: parallel 401s wait on the same promise instead of racing.
let refreshing: Promise<boolean> | null = null;

export const baseQueryWithReauth: BaseQuery = async (args, api, extra) => {
  if (refreshing) await refreshing;
  let result = await rawQuery(args, api, extra);
  if (result.error?.status !== 401 || isAuthCall(args)) return result;

  refreshing ??= (async () => {
    const { accessToken, refreshToken } = (api.getState() as AuthState).auth;
    if (!refreshToken) return false;
    const refreshed = await rawQuery({ url: "Auth/refresh-token", method: "POST", body: { accessToken, refreshToken } }, api, extra);
    const data = refreshed.data as { accessToken?: string; refreshToken?: string } | undefined;
    if (!data?.accessToken || !data.refreshToken) return false;
    api.dispatch(tokensRefreshed({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
    return true;
  })().finally(() => {
    refreshing = null;
  });

  if (await refreshing) result = await rawQuery(args, api, extra);
  else api.dispatch(signedOut());
  return result;
};
