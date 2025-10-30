// src/store/product.services.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

// -------------------- Types --------------------

// Product
export interface Product {
  productId: number;
  productName: string;
  description: string;
  sku: string;
  barcode: string;
  categoryId: number;
  storeId: number;
  basePrice: number;
  costPrice: number;
  currentStock: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  unitOfMeasure: string;
  imageUrl: string;
  additionalImages: string[];
  showInWeb: boolean;
  showInPOS: boolean;
  isActive: boolean;
}

// Product Create/Update Request
export interface ProductRequest {
  productName: string;
  description: string;
  sku: string;
  barcode: string;
  categoryId: number;
  storeId: number;
  basePrice: number;
  costPrice: number;
  currentStock: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  unitOfMeasure: string;
  imageUrl: string;
  additionalImages: string[];
  showInWeb: boolean;
  showInPOS: boolean;
  isActive: boolean;
}

// Product Partial Update
export type ProductPatchRequest = Partial<ProductRequest>;

// Product Restock
export interface ProductRestockRequest {
  productId: number;
  quantity: number;
}

// Category
export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  categoryIcon: string;
  displayOrder: number;
  storeId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category Create Request
export interface CategoryRequest {
  categoryName: string;
  description: string;
  categoryIcon: string;
  displayOrder: number;
  storeId: number;
  isActive: boolean;
}

// -------------------- API --------------------
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,

  // Define tag types for caching and invalidation
  tagTypes: ['Products', 'Product', 'Categories', 'Category'],

  endpoints: (builder) => ({
    // -------------------- PRODUCTS --------------------
    getProducts: builder.query<
      Product[],
      { isActive?: boolean; storeId?: number; categoryId?: number; search?: string; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: '/Product',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ productId }) => ({ type: 'Product' as const, id: productId })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `/Product/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<Product, ProductRequest>({
      query: (body) => ({
        url: '/Product',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<Product, { id: number; body: ProductRequest }>({
      query: ({ id, body }) => ({
        url: `/Product/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Products', id: 'LIST' }],
    }),

    patchProduct: builder.mutation<Product, { id: number; body: ProductPatchRequest }>({
      query: ({ id, body }) => ({
        url: `/Product/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Products', id: 'LIST' }],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/Product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Product', id }, { type: 'Products', id: 'LIST' }],
    }),

    restockProduct: builder.mutation<Product, ProductRestockRequest>({
      query: (body) => ({
        url: '/Product/Restock',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Products', id: 'LIST' },
      ],
    }),

    // -------------------- CATEGORIES --------------------
    getCategories: builder.query<Category[], { storeId?: number; isActive?: boolean }>({
      query: (params) => ({
        url: '/Category',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ categoryId }) => ({ type: 'Category' as const, id: categoryId })),
              { type: 'Categories', id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),

    createCategory: builder.mutation<Category, CategoryRequest>({
      query: (body) => ({
        url: '/Category',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
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
  useRestockProductMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} = productApi;
