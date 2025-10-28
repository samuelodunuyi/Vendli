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

// ================== STATISTICS TYPES ==================

export interface TopCategory {
  categoryId: number;
  categoryName: string;
  totalSales: number;
  totalAmount: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalSales: number;
  totalAmount: number;
}

export interface TopCustomer {
  userId: number;
  userName: string;
  email: string;
  totalOrders: number;
  totalAmount: number;
}

export interface SalesChart {
  labels: string[];
  values: number[];
}

export interface Statistics {
  totalOrders: number;
  totalStores: number;
  failedOrders: number;
  confirmedOrders: number;
  returnedOrders: number;
  deliveredOrders: number;
  totalOfflineOrders: number;
  totalSales: number;
  totalSalesPrevious: number;
  totalProducts: number;
  totalProductsPrevious: number;
  topSellingCategories: TopCategory[];
  topSellingProducts: TopProduct[];
  lowSellingProducts: TopProduct[];
  topCustomers: TopCustomer[];
  salesChart: SalesChart;
}

// ================== API SLICE ==================

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootState).auth;
      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Store', 'Statistics'],
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

getStatistics: builder.query<Statistics, { 
  timeline?: string; 
  store?: string; 
  startDate?: string; 
  endDate?: string; 
}>({
  query: (filters) => {
    const searchParams = new URLSearchParams();

    if (filters.timeline) searchParams.append('timeline', filters.timeline);
    if (filters.store ) searchParams.append('storeId', filters.store);
    if (filters.startDate) searchParams.append('startDate', filters.startDate);
    if (filters.endDate) searchParams.append('endDate', filters.endDate);

    return `Statistics`;
  },
  providesTags: ['Statistics'],
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
  useGetStatisticsQuery, 
} = storeApi;
