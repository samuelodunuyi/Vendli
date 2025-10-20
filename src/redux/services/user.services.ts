// src/store/users.services.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../baseUrl';
import type { RootState } from '../store';

// Request types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface AssignStoreAdminRequest {
  storeId: string; // API expects string for storeId
  userEmail: string;
}

export interface AssignEmployeeRequest {
  storeId: number;
  userEmail: string;
}

export interface SetUserStatusRequest {
  userEmail: string;
  isActive: boolean;
}

// Response type
export interface MessageResponse {
  message: string;
}

// Users API
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).app.auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Create store admin
    createStoreAdmin: builder.mutation<MessageResponse, CreateUserRequest>({
      query: (body) => ({
        url: '/UserManagement/create-store-admin',
        method: 'POST',
        body,
      }),
    }),

    // Create employee
    createEmployee: builder.mutation<MessageResponse, CreateUserRequest>({
      query: (body) => ({
        url: '/UserManagement/create-employee',
        method: 'POST',
        body,
      }),
    }),

    // Set user status (active/inactive)
    setUserStatus: builder.mutation<MessageResponse, SetUserStatusRequest>({
      query: ({ userEmail, isActive }) => ({
        url: '/UserManagement/set-user-status',
        method: 'POST',
        params: { userEmail, isActive },
      }),
    }),

    // Assign store admin to a store
    assignStoreAdmin: builder.mutation<MessageResponse, AssignStoreAdminRequest>({
      query: (body) => ({
        url: '/UserManagement/assign-storeadmin',
        method: 'POST',
        body,
      }),
    }),

    // Assign employee to a store
    assignEmployee: builder.mutation<MessageResponse, AssignEmployeeRequest>({
      query: ({ storeId, userEmail }) => ({
        url: '/UserManagement/assign-employee',
        method: 'POST',
        params: { storeId, userEmail },
      }),
    }),
  }),
});

export const {
  useCreateStoreAdminMutation,
  useCreateEmployeeMutation,
  useSetUserStatusMutation,
  useAssignStoreAdminMutation,
  useAssignEmployeeMutation,
} = usersApi;
