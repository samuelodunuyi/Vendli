import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, logout } from "../slices/authSlice";
import { useAppSelector, type RootState } from "../store";
import { baseUrl } from "../baseUrl";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as RootState).auth;
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const refreshResult: any = await baseQuery(
        {
          url: "Auth/refresh-token",
          method: "POST",
          body: {
            accessToken: (api.getState() as RootState).auth.accessToken,
            refreshToken: (api.getState() as RootState).auth.refreshToken,
          },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Update tokens in Redux
        const state = api.getState() as RootState;
        const currentUser = state.auth.user;
        api.dispatch(
          setTokens({
            accessToken: refreshResult.data.accessToken,
            refreshToken: refreshResult.data.refreshToken,
            user: currentUser,
          })
        );

        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } catch {
      api.dispatch(logout());
    }
  }

  return result;
};
