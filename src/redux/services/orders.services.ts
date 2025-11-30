// src/store/order.services.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

// -------------------- Types --------------------

// Order Item
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productDescription: string;
  productCategory: string;
  sku: string;
  productImageUrl: string;
  quantity: number;
  priceAtOrder: number;
  originalPriceAtOrder: number;
}

// Store info inside order
export interface OrderStore {
  storeId: number;
  storeName: string;
}

// Customer info inside order
export interface OrderCustomer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  createdAt: string;
}

// Order
export interface Order {
  id: number;
  orderDate: string;
  storeId: number;
  store: OrderStore;
  status: number;
  paymentOption: number;
  paymentStatus: number;
  orderType: number;
  transactionRef?: string | null;
  createdBy: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  estimatedDeliveryDate?: string | null;
  rating?: number | null;
  customer: OrderCustomer;
  orderItems: OrderItem[];
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

// Orders Response
export interface GetOrdersResponse {
  orders: Order[];
  pagination: Pagination;
  tiles: Tiles;
}

export interface Tiles {
  pending: number;
  delivered: number;
  cancelled: number;
  completed: number;
  averageRating: number;
} 

// Create Order Request
export interface CreateOrderRequest {
  storeId: number;
  customerId: number;
  paymentOption: number;
  orderItems: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

// Update Order Status
export interface UpdateOrderStatusRequest {
  status: number; // 0–7
}

// Update Estimated Delivery Date
export interface UpdateEstimatedDeliveryDateRequest {
  estimatedDeliveryDate: string;
}

// Rate Order
export interface RateOrderRequest {
  rating: number; // 1–5
}

// -------------------- Statistics --------------------
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

// -------------------- Loyalty Activity --------------------
export interface LoyaltyActivity {
  id: number;
  customerId: number;
  pointsEarned: number;
  pointsRedeemed: number;
  orderId: number;
  createdAt: string;
}

export interface LoyaltyActivityQueryParams {
  customer_id?: number;
  from?: string; // ISO string
  to?: string;   // ISO string
}

// -------------------- API --------------------
export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Orders', 'Order', 'LoyaltyActivity'],
  endpoints: (builder) => ({
    getOrders: builder.query<
      GetOrdersResponse,
      {
        page?: number;
        itemsPerPage?: number;
        search?: string;
        status?: string;
        paymentStatus?: string;
        userId?: string;
        storeId?: number;
        productId?: number;
        customerEmail?: string;
      }
    >({
      query: (params) => ({
        url: '/Order',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),

    getOrderById: builder.query<Order, number>({
      query: (id) => `/Order/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({ url: '/Order', method: 'POST', body }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    updateOrderStatus: builder.mutation<
      { message: string },
      { id: number; body: UpdateOrderStatusRequest }
    >({
      query: ({ id, body }) => ({
        url: `/Order/${id}/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    updateEstimatedDeliveryDate: builder.mutation<
      { message: string },
      { id: number; body: UpdateEstimatedDeliveryDateRequest }
    >({
      query: ({ id, body }) => ({
        url: `/Order/${id}/EstimatedDeliveryDate`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    rateOrder: builder.mutation<
      { message: string; rating: number },
      { id: number; body: RateOrderRequest }
    >({
      query: ({ id, body }) => ({
        url: `/Order/${id}/Rating`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),

    getStatistics: builder.query<
      StatisticsResponse,
      { timeline?: string; storeId?: number; startDate?: string; endDate?: string }
    >({
      query: (params) => ({ url: '/Statistics', params }),
    }),

    // -------------------- Loyalty Activity --------------------
    getLoyaltyActivity: builder.query<LoyaltyActivity[], LoyaltyActivityQueryParams>({
      query: (params) => ({
        url: '/LoyaltyActivity',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((activity) => ({ type: 'LoyaltyActivity' as const, id: activity.id })),
              { type: 'LoyaltyActivity', id: 'LIST' },
            ]
          : [{ type: 'LoyaltyActivity', id: 'LIST' }],
    }),
  }),
});

// -------------------- EXPORT HOOKS --------------------
export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdateEstimatedDeliveryDateMutation,
  useRateOrderMutation,
  useGetStatisticsQuery,
  useGetLoyaltyActivityQuery,
} = orderApi;
