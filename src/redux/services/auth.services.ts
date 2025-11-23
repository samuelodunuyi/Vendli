// src/store/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../baseUrl";
import type { RootState } from "../store";

// ================== TYPES ==================

// ---------- AUTH ----------
export interface RegisterRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  username: string;
  store: Store;
}

export interface Store {
  storeId: number;
  storeName: string;
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

// ================== API ==================

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootState).auth;
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // ================== AUTH ENDPOINTS ==================
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "Auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "Auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Refresh Token
    refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: "Auth/refresh-token",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "Auth/change-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<LogoutResponse, { refreshToken: string }>({
      query: (body) => ({
        url: "Auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

// ================== EXPORT HOOKS ==================
export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;
