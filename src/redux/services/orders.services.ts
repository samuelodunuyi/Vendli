// src/store/order.services.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../baseUrl';
import type { RootState } from '../store';

// -------------------- Types --------------------

// Order Item
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productDescription: string;
  productCategory: string;
  quantity: number;
  priceAtOrder: number;
  originalPriceAtOrder: number;
  productImageUrl: string;
}

// Store info within order
export interface OrderStore {
  id: number;
  name: string;
}

// Order
export interface Order {
  id: number;
  orderDate: string;
  storeId: number;
  store: OrderStore;
  status: number;
  paymentOption?: number;
  transactionRef?: string;
  createdBy: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  orderItems: OrderItem[];
}

// Create Order Request
export interface CreateOrderRequest {
  storeId: number;
  orderItems: { productId: number; quantity: number }[];
}

// Update Order Status
export interface UpdateOrderStatusRequest {
  status: number; // 0-6
}

// Statistics
export interface SalesCategory {
  categoryId: number;
  categoryName: string;
  totalSales: number;
  totalAmount: number;
}

export interface SalesProduct {
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

export interface StatisticsResponse {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  topSellingCategories: SalesCategory[];
  topSellingProducts: SalesProduct[];
  lowSellingProducts: SalesProduct[];
  topCustomers: TopCustomer[];
  salesChart: SalesChart;
}

// -------------------- API --------------------

export const orderApi = createApi({
  reducerPath: 'orderApi',
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
    // Orders
    getOrders: builder.query<Order[], void>({
      query: () => '/Order',
    }),
    getOrderById: builder.query<Order, number>({
      query: (id) => `/Order/${id}`,
    }),
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({
        url: '/Order',
        method: 'POST',
        body,
      }),
    }),
    updateOrderStatus: builder.mutation<void, { id: number; body: UpdateOrderStatusRequest }>({
      query: ({ id, body }) => ({
        url: `/Order/${id}/Status`,
        method: 'PUT',
        body,
      }),
    }),

    // Statistics
    getStatistics: builder.query<
      StatisticsResponse,
      { timeline?: string; storeId?: number; startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: '/Statistics',
        params,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useGetStatisticsQuery,
} = orderApi;
