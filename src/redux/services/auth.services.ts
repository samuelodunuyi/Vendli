import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import type { UserRole } from "@/lib/roles";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber?: string;
  role: UserRole;
  store: { storeId: number; storeName: string } | null;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: "Auth/login", method: "POST", body }),
    }),
    logout: builder.mutation<{ message: string }, { refreshToken: string }>({
      query: (body) => ({ url: "Auth/logout", method: "POST", body }),
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (body) => ({ url: "Auth/change-password", method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useChangePasswordMutation } = authApi;
