/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/customers.services.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// ================== TYPES ==================

// ---------- Request Interfaces ----------
export interface GetCustomersRequest {
  page?: number;
  itemsPerPage?: number;
  search?: string;
  classification?: number;
  loyaltyTier?: number;
  status?: number;
}

export interface CreateCustomerRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  loyaltyTier?: number;
  kycStatus?: number;
  loyaltyPoints?: number;
  lastTransactionDate?: string | null;
  totalSpent?: number;
  customerClassification?: number;
  companyName?: string | null;
  industryClass?: string | null;
  notes?: string;
  customerStatus?: number;
}

export interface UpdateCustomerRequest {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  loyaltyTier?: number;
  kycStatus?: number;
  loyaltyPoints?: number;
  lastTransactionDate?: string | null;
  totalSpent?: number;
  customerClassification?: number;
  companyName?: string | null;
  industryClass?: string | null;
  notes?: string;
  customerStatus?: number;
}

export interface UpdateCustomerProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  notes?: string;
  companyName?: string;
  industryClass?: string;
  customerNotes?: string;
}

// ---------- Response Interfaces ----------
export interface GetCustomersResponse {
  customers: Customer[];
  pagination: Pagination;
}

export interface MessageResponse {
  message: string;
}

// ---------- Entity Interfaces ----------
export interface Customer {
  id: number;
  userId: number;
  userInfo: UserInfo;
  loyaltyTier: number;
  kycStatus: number;
  loyaltyPoints: number;
  lastTransactionDate: string;
  totalSpent: number;
  customerClassification: number;
  companyName?: string | null;
  preferredStore?: string | null;
  industryClass?: string | null;
  customerStatus: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  joinedDate: string;
  preferredStore: string;
}

// ================== TYPES FOR ANALYTICS ==================
export interface CustomerAnalyticsParams {
  timeline?: string;
  storeId?: number;
  startDate?: string;
  endDate?: string;
}

export interface CustomerAnalyticsResponse {
  period: { startDate: string; endDate: string };
  storeFilter: number;
  demographics: {
    totalCustomers: number;
    byLoyaltyTier: { loyaltyTier: string; count: number }[];
    byClassification: { classification: string; count: number }[];
    byKYCStatus: { kycStatus: string; count: number }[];
    byStatus: { status: string; count: number }[];
  };
  financialMetrics: {
    totalRevenue: number;
    averageOrderValue: number;
    revenuePerCustomer: number;
  };
  categoryDistribution: {
    totalRevenue: number;
    averageOrderValue: number;
    revenuePerCustomer: number;
  };
  activityMetrics: {
    activeCustomers: number;
    repeatCustomers: number;
    customerRetentionRate: number;
    newCustomersInPeriod: number;
  };
  topCustomers: {
    customerId: number;
    customerName: string;
    email: string;
    loyaltyTier: string;
    totalSpent: number;
    loyaltyPoints: number;
  }[];
  customerAcquisitionTrend: { date: string; newCustomers: number }[];
  ordersByLoyaltyTier: { loyaltyTier: string; orderCount: number }[];
  paymentMethodPreferences: { paymentMethod: string; count: number }[];
  topCustomersByLifetimeValue: {
    customerId: number;
    customerName: string;
    email: string;
    customerClassification: number;
    totalSpent: number;
    loyaltyPoints: number;
    loyaltyTier: string;
    lastTransactionDate: string;
    customerSince: string;
  }[];
}

// ---------- Pagination ----------
export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Complaint {
  id: number;
  title: string;
  complaintText: string;
  priority: number;
  status: number;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
  };
  store: {
    storeId: number;
    storeName: string;
    storeAddress: string;
    storePhoneNumber: string;
  };
  assignedTo?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  dateClosed?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetComplaintsRequest {
  page?: number;
  itemsPerPage?: number;
  search?: string;
  priority?: string;
  status?: string;
}

export interface GetComplaintsResponse {
  complaints: Complaint[];
  pagination: Pagination;
}

export interface CreateComplaintRequest {
  customerId: number;
  title: string;
  complaintText: string;
  storeId: number;
  priority: number;
  assignedToUserId?: number;
}

export interface UpdateComplaintRequest {
  title?: string;
  complaintText?: string;
  priority?: number;
  status?: number;
  assignedToUserId?: number;
}
// ================== API ==================

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getCustomers: builder.query<GetCustomersResponse, GetCustomersRequest>({
      query: (params) => ({
        url: "/Customer",
        method: "GET",
        params,
      }),
      providesTags: ["Customer"],
    }),

    getCustomerById: builder.query<Customer, number>({
      query: (id) => `/Customer/${id}`,
      providesTags: ["Customer"],
    }),

    createCustomer: builder.mutation<MessageResponse, CreateCustomerRequest>({
      query: (body) => ({
        url: "/Customer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),

    updateCustomer: builder.mutation<MessageResponse, UpdateCustomerRequest>({
      query: ({ id, ...body }) => ({
        url: `/Customer/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),

    deleteCustomer: builder.mutation<MessageResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/Customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),

    updateCustomerProfile: builder.mutation<
      MessageResponse,
      UpdateCustomerProfileRequest
    >({
      query: (body) => ({
        url: "/Customer/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),

    getCustomerAnalytics: builder.query<
      CustomerAnalyticsResponse,
      CustomerAnalyticsParams
    >({
      query: (filters) => {
        const searchParams = new URLSearchParams();
        if (filters.timeline) searchParams.append("timeline", filters.timeline);
        if (filters.storeId)
          searchParams.append("storeId", filters.storeId.toString());
        if (filters.startDate)
          searchParams.append("startDate", filters.startDate);
        if (filters.endDate) searchParams.append("endDate", filters.endDate);

        return `/Customer/analytics?${searchParams.toString()}`;
      },
    }),

    // ================== COMPLAINTS API ==================
    getComplaints: builder.query<GetComplaintsResponse, GetComplaintsRequest>({
      query: (params) => ({
        url: "/Complaints",
        method: "GET",
        params,
      }),
      providesTags: ["Customer"],
    }),

    getComplaintById: builder.query<Complaint, number>({
      query: (id) => `/Complaints/${id}`,
      providesTags: ["Customer"],
    }),

    createComplaint: builder.mutation<MessageResponse, CreateComplaintRequest>({
      query: (body) => ({
        url: "/Complaints",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),

    updateComplaint: builder.mutation<
      MessageResponse,
      { id: number; data: UpdateComplaintRequest }
    >({
      query: ({ id, data }) => ({
        url: `/Complaints/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    deleteComplaint: builder.mutation<MessageResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/Complaints/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

// ================== EXPORT HOOKS ==================

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerProfileMutation,
  useGetCustomerAnalyticsQuery,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useCreateComplaintMutation,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} = customersApi;
