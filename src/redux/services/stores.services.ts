import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// ================== STORE TYPES ==================
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

export interface RetentionRate {
  newUsers: number;
  returningUsers: number;
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
  topPerformingStores: TopPerforming[];
  totalSales: number;
  totalSalesPrevious: number;
  totalProducts: number;
  totalProductsPrevious: number;
  topSellingCategories: TopCategory[];
  topSellingProducts: TopProduct[];
  lowSellingProducts: TopProduct[];
  topCustomers: TopCustomer[];
  salesChart: SalesChart;
  retentionRate: RetentionRate;
}

// ================== SALES STATISTICS TYPES ==================
export interface TopSellingProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalAmount: number;
}

export interface RecentOrder {
  orderId: number;
  orderDate: string;
  status: string;
  storeId: number;
  storeName: string;
  totalAmount: number;
}

export interface CashRemittance {
  storeId: number;
  storeName: string;
  amount: number;
}

export interface SalesByCategory {
  categoryId: number;
  categoryName: string;
  totalSales: number;
  totalAmount: number;
}

export interface SalesTrend {
  labels: string[];
  values: number[];
}

export interface SalesStatistics {
  totalProducts: number;
  totalSales: number;
  totalOrders: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  inventoryValue: number;
  averageOrderValue: number;
  topSellingProducts: TopSellingProduct[];
  recentOrders: RecentOrder[];
  cashRemittanceByStore: CashRemittance[];
  salesByCategory: SalesByCategory[];
  salesTrend: SalesTrend;
  inventoryValueTrend: SalesTrend;
}

// ================== API SLICE ==================
export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Store", "Statistics", "SalesStatistics"],
  endpoints: (builder) => ({
    // GET all stores
    getStores: builder.query<StoresResponse, void>({
      query: () => "/Store",
      providesTags: ["Store"],
    }),

    // GET store by ID
    getStoreById: builder.query<Store, number>({
      query: (id) => `/Store/${id}`,
      providesTags: ["Store"],
    }),

    // CREATE store
    createStore: builder.mutation<Store, StoreCreateRequest>({
      query: (body) => ({
        url: "/Store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store"],
    }),

    // UPDATE store
    updateStore: builder.mutation<Store, StoreEditRequest>({
      query: ({ storeId, ...body }) => ({
        url: `/Store/${storeId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Store"],
    }),

    // DELETE store
    deleteStore: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/Store/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

    // GET general statistics
    getStatistics: builder.query<
      Statistics,
      { timeline?: string; store?: number | null; startDate?: string; endDate?: string }
    >({
      query: (filters) => {
        const searchParams = new URLSearchParams();
        if (filters.timeline) searchParams.append("timeline", filters.timeline);
        if (filters.store !== null && filters.store !== undefined)
          searchParams.append("storeId", String(filters.store));
        if (filters.startDate) searchParams.append("startDate", filters.startDate);
        if (filters.endDate) searchParams.append("endDate", filters.endDate);
        return `/Statistics?${searchParams.toString()}`;
      },
      providesTags: ["Statistics"],
    }),

    // GET sales-focused statistics
    getSalesStatistics: builder.query<
      SalesStatistics,
      { storeId?: number; categoryId?: number; dateRangeTimeline?: "last7days" | "last30days" | "last90days" | "thisYear" }
    >({
      query: (filters) => {
        const searchParams = new URLSearchParams();
        if (filters.storeId !== undefined) searchParams.append("storeId", String(filters.storeId));
        if (filters.categoryId !== undefined) searchParams.append("categoryId", String(filters.categoryId));
        if (filters.dateRangeTimeline) searchParams.append("dateRangeTimeline", filters.dateRangeTimeline);
        return `/Statistics/Sales?${searchParams.toString()}`;
      },
      providesTags: ["SalesStatistics"],
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
  useGetSalesStatisticsQuery, // new hook
} = storeApi;
