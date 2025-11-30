import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// -------------------- Types --------------------

export interface StoreCustomerBehaviour {
  storeId: number;
  storeName: string;
  newCustomers: number;
  returningCustomers: number;
  loyaltyMembers: number;
  avgVisitsPerMonth: number;
}

export interface CustomerBehaviourAnalyticsResponse {
  stores: StoreCustomerBehaviour[];
}

export interface CustomerBehaviourAnalyticsQuery {
  windowDays?: number; // optional, default 90
}

// Store Migration Analytics
export interface StoreMigrationAnalyticsResponse {
  fromStoreId: number;
  toStoreId: number;
  migrationCount: number;
}

export interface StoreMigrationAnalyticsQuery {
  fromStoreId: number;
  toStoreId: number;
}

export interface StoreCategoryAllocation {
  categoryId: number;
  categoryName: string;
  orderPercentage: number;
}

export interface StoreRegionalPreferences {
  storeId: number;
  storeName: string;
  categories: StoreCategoryAllocation[];
}

export interface RegionalPreferencesAnalyticsResponse {
  stores: StoreRegionalPreferences[];
}

// -------------------- API --------------------
export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    // Customer Behaviour Analytics
    getCustomerBehaviourAnalytics: builder.query<
      CustomerBehaviourAnalyticsResponse,
      CustomerBehaviourAnalyticsQuery | undefined
    >({
      query: (params) => ({
        url: "/customer-behaviour-analytics",
        params: params ?? {}, 
      }),
      providesTags: ["Analytics"],
    }),

    // Store Migration Analytics
    getStoreMigrationAnalytics: builder.query<
      StoreMigrationAnalyticsResponse,
      StoreMigrationAnalyticsQuery
    >({
      query: (params) => ({
        url: "/store-migration-analytics",
        params,
      }),
      providesTags: ["Analytics"],
    }),

    getRegionalPreferencesAnalytics: builder.query<
      RegionalPreferencesAnalyticsResponse,
      void
    >({
      query: () => ({
        url: "/regional-preferences-analytics",
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetCustomerBehaviourAnalyticsQuery,
  useGetStoreMigrationAnalyticsQuery,
  useGetRegionalPreferencesAnalyticsQuery,
} = analyticsApi;
