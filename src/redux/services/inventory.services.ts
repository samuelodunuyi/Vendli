import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// ------------- Types ------------------------

// Pagination
export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

// Inventory
export interface Inventory {
  store?: {
    storeId: number;
    storeName: string;
    storePhoneNumber: string;
    storeEmailAddress: string;
    storeAddress: string;
    storeAdminId?: number | null;
    storeType: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string | null;
  };
  product?: {
    productId: number;
    productName: string;
    description: string;
    sku: string;
    barcode: string;
    category?: {
      categoryId: number;
      catergoryName?: string;
    };
    imageUrl: string;
    additionalImages: { imagePath: string }[];
    unitOfMeasure: string;
    vatCalculated: boolean;
    basePrice: number;
    minimumStockLevel: number;
    showInWeb: boolean;
    isActive: boolean;

    quantity?: number;
    price: number;
    stockStatus: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: {
      id: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      roleName: string;
    };
    updatedBy?: {
      id: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      roleName: string;
    };
  };
}

export interface GetInventoryResponse {
  items: Inventory[];
  pagination: Pagination;
}

// Transaction

export interface Transaction {
  transactionId: number;
  transactionType: string;
  quantity: number;
  reference: string;
  reason?: string;
  createdOn: string;
  createdBy: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roleName: string;
  };
  store: {
    storeId: number;
    storeName: string;
    storePhoneNumber: string;
    storeEmailAddress: string;
    storeAddress: string;
    storeAdminId?: number | null;
    storeType: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string | null;
  };
  product?: {
    productId: number;
    productName: string;
    description: string;
    sku: string;
    barcode: string;
    categoryId: number;
    categoryName?: string;
    storeId: number;
    storeName?: string;
    basePrice: number;
    currentStock: number;
    unitOfMeasure: string;
    imageUrl: string;
    additionalImages: { imagePath: string; productId?: number }[];
    showInWeb: boolean;
    showInPOS: boolean;
    isActive: boolean;
    costPrice: number;
    minimumStockLevel: number;
    maximumStockLevel: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
  };
}

export interface TransactionRequest {
  storeId: string;
  newQuantity: number;
  reference?: string;
  reason: string;

  // ===== Missing fields =====
  // transactionType: string;
}

export interface GetTransactionResponse {
  items: Transaction[];
  pagination: Pagination;
}

// ----------------- API -----------------------
export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Inventory", "Transaction"],

  endpoints: (builder) => ({
    getInventories: builder.query<
      GetInventoryResponse,
      {
        customSearch?: string;
        dateFrom?: string;
        dateTo?: string;
        sku?: string;
        categoryId?: number;
        storeId?: number;
        createdByUserId?: number;
        modifiedByUserId?: number;
        productId?: number;
        sortBy?: string;
        page?: number;
        itemsPerPage?: number;
      }
    >({
      query: (params) => ({
        url: "/Inventory/inventory-products",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((inv) => ({
                type: "Inventory" as const,
                id: inv.product?.productId,
              })),
              { type: "Inventory", id: "LIST" },
            ]
          : [{ type: "Inventory", id: "LIST" }],
    }),

    createTransactions: builder.mutation<
      Transaction,
      { id: number; body: TransactionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/Inventory/bulk-product-stock-adjustment/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Transaction", id: "LIST" },
        { type: "Inventory", id: "LIST" },
      ],
    }),

    getTransactions: builder.query<
      GetTransactionResponse,
      {
        storeId: number;
        productId: number;
        type: string;
        startDate: string;
        endDate: string;
        createdBy: string;
        page?: number;
        itemsPerPage?: number;
      }
    >({
      query: (params) => ({
        url: "/Inventory/transactions",
        params,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((tx) => ({
                type: "Transaction" as const,
                id: tx.transactionId,
              })),
              { type: "Transaction", id: "LIST" },
            ]
          : [{ type: "Transaction", id: "LIST" }],
    }),
  }),
});

export const {
  useGetInventoriesQuery,
  useCreateTransactionsMutation,
  useGetTransactionsQuery,
} = inventoryApi;
