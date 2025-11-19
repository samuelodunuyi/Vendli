// src/store/product.services.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

// -------------------- SHARED TYPES --------------------
export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

// -------------------- PRODUCT TYPES --------------------
export interface Product {
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
  basestock: number;
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

  createdByUser?: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roleName: string;
  };
}

export interface ProductRequest {
  productName: string;
  description: string;
  sku: string;
  barcode: string;
  categoryId: number;
  basePrice: number;
  costPrice: number;
  basestock: number;
  unitOfMeasure: string;
  imageUrl: string;
  additionalImages?: { imagePath: string }[];
  showInWeb: boolean;
  showInPOS: boolean;
  isActive: boolean;
}

export type ProductPatchRequest = Partial<ProductRequest>;

export interface GetProductsResponse {
  products: Product[];
  pagination: Pagination;
}

// -------------------- CATEGORY TYPES --------------------
export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  categoryIcon?: string;
  displayOrder?: number;
  storeId: number;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  categoryName: string;
  description: string;
  storeId: number;
}

export interface GetCategoriesResponse {
  categories: Category[];
  pagination: Pagination;
}

// -------------------- INVENTORY TYPES --------------------
export interface InventoryProductSummary {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  category?: { id: number; name: string } | null;
  imageUrl?: string | null;
  additionalImages?: string[];
  unitOfMeasure?: string | null;
  vatCalculated?: boolean;
  basePrice: number;
  minimumStockLevel?: number;
  showInWeb?: boolean;
  isActive?: boolean;
}

export interface StoreSummary {
  id: number;
  name: string;
}

export interface UserSummary {
  id?: number;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface InventoryProductItem {
  store: StoreSummary;
  product: InventoryProductSummary;
  quantity: number;
  price?: number | null;
  stockStatus: 'instock' | 'low stock' | 'out of stock';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: UserSummary | null;
  updatedBy?: UserSummary | null;
}

export interface InventoryProductResponse {
  items: InventoryProductItem[];
  pagination: Pagination;
}

export interface InventoryTransactionItem {
  id: number;
  type: string; 
  quantity: number; 
  reference?: string | null;
  reason?: string | null;
  createdOn: string;
  createdBy: UserSummary;
  store: StoreSummary;
  product: { id: number; name: string; sku?: string };
}

export interface InventoryTransactionResponse {
  items: InventoryTransactionItem[];
  pagination: Pagination;
}

export interface StockAdjustmentItem {
  storeId: number;
  newQuantity: number;
  reason: string;
  reference: string;
}

// -------------------- API CONFIG --------------------
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products', 'Product', 'Categories', 'Category'],

  endpoints: (builder) => ({
    // -------------------- PRODUCTS --------------------
    getProducts: builder.query<
      GetProductsResponse,
      {
        storeId?: number;
        categoryId?: number;
        isActive?: boolean;
        showInWeb?: boolean;
        showInPOS?: boolean;
        search?: string;
        page?: number;
        itemsPerPage?: number;
      }
    >({
      query: (params) => ({ url: '/Product', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ productId }) => ({
                type: 'Product' as const,
                id: productId,
              })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `/Product/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<Product, ProductRequest>({
      query: (body) => ({ url: '/Product', method: 'POST', body }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: number; body: ProductRequest }
    >({
      query: ({ id, body }) => ({
        url: `/Product/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Products', id: 'LIST' },
      ],
    }),

    patchProduct: builder.mutation<
      Product,
      { id: number; body: ProductPatchRequest }
    >({
      query: ({ id, body }) => ({
        url: `/Product/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Products', id: 'LIST' },
      ],
    }),

    // -------------------- RESTOCK / UNSTOCK --------------------
restockProduct: builder.mutation<
  { message: string; productId: number; basestock: number },
  { productId: number; quantity: number; reference: string; reason: string }
>({
  query: (body) => ({
    url: '/Products/restock',
    method: 'POST',
    body,
  }),
  invalidatesTags: (result, error, arg) => [
    { type: 'Products', id: 'LIST' },
    { type: 'Product', id: arg.productId },
    { type: 'Products', id: 'INVENTORY_LIST' },
  ],
}),

unstockProduct: builder.mutation<
  { message: string; productId: number; basestock: number },
  { productId: number; quantity: number; reference: string; reason: string }
>({
  query: (body) => ({
    url: '/Products/unstock',
    method: 'POST',
    body,
  }),
  invalidatesTags: (result, error, arg) => [
    { type: 'Products', id: 'LIST' },
    { type: 'Product', id: arg.productId },
    { type: 'Products', id: 'INVENTORY_LIST' },
  ],
}),


    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({ url: `/Product/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Products', id: 'LIST' },
      ],
    }),

    uploadProductImage: builder.mutation<
      { imageUrl: string },
      FormData
    >({
      query: (formData) => ({
        url: '/Product/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),

    // -------------------- CATEGORIES --------------------
    getCategories: builder.query<
      GetCategoriesResponse,
      { storeId?: number; isActive?: boolean; page?: number; itemsPerPage?: number }
    >({
      query: (params) => ({ url: '/Category', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.categories.map(({ categoryId }) => ({
                type: 'Category' as const,
                id: categoryId,
              })),
              { type: 'Categories', id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),

    getCategoryById: builder.query<Category, number>({
      query: (id) => `/Category/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation<Category, CategoryRequest>({
      query: (body) => ({ url: '/Category', method: 'POST', body }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    updateCategory: builder.mutation<
      Category,
      { id: number; body: CategoryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/Category/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),

    patchCategory: builder.mutation<
      Category,
      { id: number; body: Partial<CategoryRequest> }
    >({
      query: ({ id, body }) => ({
        url: `/Category/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({ url: '/Category', method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),

    // -------------------- INVENTORY MANAGEMENT --------------------
    getInventoryProducts: builder.query<
      InventoryProductResponse,
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
        sortBy?: 'price_ascending' | 'price_descending' | string;
        page?: number;
        itemsPerPage?: number;
      }
    >({
      query: (params) => ({
        url: '/Inventory/inventory-products',
        params,
      }),
      providesTags: [{ type: 'Products', id: 'INVENTORY_LIST' }],
    }),

    bulkProductStockAdjustment: builder.mutation<
      {
        productId: number;
        updates: {
          storeId: number;
          productId: number;
          previousQuantity: number;
          newQuantity: number;
          delta: number;
          updated: boolean;
        }[];
        totalUpdated: number;
      },
      { productId: number; adjustments: StockAdjustmentItem[] }
    >({
      query: ({ productId, adjustments }) => ({
        url: `/Inventory/bulk-product-stock-adjustment/${productId}`,
        method: 'POST',
        body: adjustments,
      }),
      invalidatesTags: [
        { type: 'Products', id: 'INVENTORY_LIST' },
        { type: 'Products', id: 'LIST' },
      ],
    }),

    getInventoryTransactions: builder.query<
      InventoryTransactionResponse,
      {
        storeId?: number;
        productId?: number;
        type?: string;
        startDate?: string;
        endDate?: string;
        createdBy?: string;
        page?: number;
        itemsPerPage?: number;
      }
    >({
      query: (params) => ({
        url: '/Inventory/transactions',
        params,
      }),
      providesTags: [{ type: 'Products', id: 'TRANSACTIONS_LIST' }],
    }),
  }),
});

// -------------------- EXPORT HOOKS --------------------
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  usePatchProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useRestockProductMutation,
  useUnstockProductMutation,

  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  usePatchCategoryMutation,
  useDeleteCategoryMutation,

  useGetInventoryProductsQuery,
  useBulkProductStockAdjustmentMutation,
  useGetInventoryTransactionsQuery,
} = productApi;
