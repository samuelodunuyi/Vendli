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
  id: number;
  type: number;
  quantity: number;
  reference: string;
  reason: string;
  createdOn: string;

  createdBy: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
  };

  store: {
    id: number;
    name: string;
  };

  product: {
    id: number;
    name: string;
    sku: string;
  };
}

export interface TransactionRequest {
  transactionType: number;
  storeId: number;
  productId: number;
  quantity: number;
  reference?: string;
  reason: string;
  fromStore?: number;
  toStore?: number;
}

export interface GetTransactionResponse {
  transactions: Transaction[];
  pagination: Pagination;
  summary?: {
    type: number;
    count: number;
    totalQuantity: number;
  }[];
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
                id: inv.product!.productId,
              })),
              { type: "Inventory", id: "LIST" },
            ]
          : [{ type: "Inventory", id: "LIST" }],
    }),

    createTransactions: builder.mutation<Transaction, TransactionRequest>({
      query: (body) => ({
        url: "/Inventory/transactions/",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error) => [
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
              ...result.transactions.map((tx) => ({
                type: "Transaction" as const,
                id: tx.id,
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
