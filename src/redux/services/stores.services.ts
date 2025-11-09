import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../baseUrl';
import type { RootState } from '../store';
import { baseQueryWithReauth } from './baseQueryWithReauth';

// ================== TYPES ==================

export interface Store {
  storeId: number;
  storeName: string;
  storePhoneNumber: string;
  storeEmailAddress: string;
  storeAddress: string;
  storeAdmin: string;
  userId: string;
  storeType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalSales: number;
}

export interface StoreCreateRequest {
  storeName: string;
  storePhoneNumber: string;
  storeEmailAddress: string;
  storeAddress: string;
  storeType: string;
  storeAdmin: string;
  userId: number;
}

export interface StoreEditRequest {
    storeId: number;
  storeName: string;
  storePhoneNumber: string;
  storeEmailAddress: string;
  storeAddress: string;
  storeType: string;
  storeAdmin: string;
  userId: number;
  isActive: boolean;
}

interface StoresResponse {
  stores: Store[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ================== STATISTICS TYPES ==================

export interface TopCategory {
  categoryId: number;
  categoryName: string;
  totalSales: number;
  totalAmount: number;
}
export interface TopPerforming {
  storeId: number;
  storeName: string;
  totalOrders: number;
  totalSales: number;
  productsSold: number;
  activeCustomers: number;
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
  activeStores: number;
  cancelledOrders: number;
  activeCustomers: number;
  productsSold: number;
  pendingOrders: number;
  delayedOrders: number;
  topPerformingStores: TopCategory[];
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
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Store', 'Statistics'],
  endpoints: (builder) => ({
    // GET all stores
    getStores: builder.query<StoresResponse, void>({
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
    updateStore: builder.mutation<Store, StoreEditRequest>({
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

    return `/Statistics?${searchParams.toString()}`;
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
