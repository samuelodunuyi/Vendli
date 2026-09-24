import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// Request types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roleId: number;
  role?: string;
  joinedDate: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  storeId: number | null;
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
  storeId: number | null;
  password?: string;
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
  role?: string | number;
  search?: string;
  page?: number;
  storeId?: number;
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

export interface Tiles {
  activeUsers: number;
  customers: number;
  employees: number;
  storeAdmins: number;
  superAdmins: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  joinedDate: string;
  role?: string;
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
  tiles: Tiles
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersRequest>({
      query: (params) => ({ url: "/UserManagement/get-users", params }),
      providesTags: ["Users"],
    }),

    createUser: builder.mutation<MessageResponse, CreateUserRequest>({
      query: (body) => ({ url: "/UserManagement/create-user", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<MessageResponse, UpdateUserRequest>({
      query: ({ id, ...body }) => ({ url: `/UserManagement/edit/${id}`, method: "PUT", body }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<MessageResponse, { id: number }>({
      query: ({ id }) => ({ url: `/UserManagement/delete-user/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),

    assignStoreAdmin: builder.mutation<MessageResponse, AssignStoreAdminRequest>({
      query: (body) => ({ url: "/UserManagement/assign-store-admin", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),

    setUserStatus: builder.mutation<MessageResponse, SetUserStatusRequest>({
      query: ({ userId, isActive }) => ({ url: "/UserManagement/set-user-status", method: "PUT", params: { userId, isActive } }),
      invalidatesTags: ["Users"],
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
