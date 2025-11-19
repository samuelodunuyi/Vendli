// src/store/users.services.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// Request types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roleId: number;
  role: string;
  joinedDate: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  storeId?: number;
}

export interface UpdateUserRequest {
  id: number;
  firstName?: string;
  lastName?: string;
  username: string;
  email?: string;
  joinedDate: string;
  phoneNumber?: string;
  isActive?: boolean;
  roleId: number;
  storeId: number;
}

export interface AssignStoreAdminRequest {
  userId: number;
  storeId: number;
}

export interface SetUserStatusRequest {
  userId: number;
  isActive: boolean;
}

export interface GetUsersRequest {
  role?: string;
  page?: number;
  itemsPerPage?: number;
}

// Response types
export interface MessageResponse {
  message: string;
}

// Pagination
export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  joinedDate: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  storeId?: number;
  storeName?: string;
}

// Users Response
export interface GetUsersResponse {
  users: User[];
  pagination: Pagination;
}

// Users API
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersRequest>({
      query: (params) => ({
        url: "/UserManagement/get-users",
        method: "GET",
        params: {
          ...(params.role && { role: params.role }),
          ...(params.page && { page: params.page }),
          ...(params.itemsPerPage && { itemsPerPage: params.itemsPerPage }),
        },
      }),
    }),

    createUser: builder.mutation<MessageResponse, CreateUserRequest>({
      query: (body) => ({
        url: "/UserManagement/create-user",
        method: "POST",
        body,
      }),
    }),

    updateUser: builder.mutation<MessageResponse, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/UserManagement/edit/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteUser: builder.mutation<MessageResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/UserManagement/delete-user/${id}`,
        method: "DELETE",
      }),
    }),

    assignStoreAdmin: builder.mutation<
      MessageResponse,
      AssignStoreAdminRequest
    >({
      query: (body) => ({
        url: "/UserManagement/assign-store-admin",
        method: "POST",
        body,
      }),
    }),

    setUserStatus: builder.mutation<MessageResponse, SetUserStatusRequest>({
      query: ({ userId, isActive }) => ({
        url: "/UserManagement/set-user-status",
        method: "PUT",
        params: { userId, isActive },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignStoreAdminMutation,
  useSetUserStatusMutation,
} = usersApi;
