// src/store/stores.services.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../baseUrl';
import type { RootState } from '../store';

// ================== TYPES ==================

export interface Store {
  storeId: number;
  storeName: string;
  storePhoneNumber: string;
  storeEmailAddress: string;
  storeAddress: string;
  storeType: string;
  storeAdmin: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreCreateRequest {
  storeName: string;
  storePhoneNumber: string;
  storeEmailAddress: string;
  storeAddress: string;
  storeType: string;
  storeAdmin: string;
  userId: string;
}

// ================== API SLICE ==================

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken  } = (getState() as RootState).auth;
      if (accessToken ) headers.set('Authorization', `Bearer ${accessToken }`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Store'],
  endpoints: (builder) => ({
    // GET all stores
    getStores: builder.query<Store[], void>({
      query: () => '/Store',
      providesTags: ['Store'],
    }),

    // GET store by ID
    getStoreById: builder.query<Store, number>({
      query: (id) => `/Store/${id}`,
      providesTags: ['Store'],
    }),

    // POST create new store
    createStore: builder.mutation<Store, StoreCreateRequest>({
      query: (body) => ({
        url: '/Store',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Store'],
    }),

    // PUT update store
    updateStore: builder.mutation<Store, Store>({
      query: ({ storeId, ...body }) => ({
        url: `/Store/${storeId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Store'],
    }),

    // DELETE store
    deleteStore: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/Store/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Store'],
    }),
  }),
});

// ================== EXPORT HOOKS ==================

export const {
  useGetStoresQuery,
  useGetStoreByIdQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeApi;
