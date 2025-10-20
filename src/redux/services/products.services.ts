// src/store/product.services.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../baseUrl';
import type { RootState } from '../store';

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
    // Products
    getProducts: builder.query<Product[], { isActive?: boolean; storeId?: number; categoryId?: number; search?: string; page?: number; pageSize?: number }>({
      query: (params) => ({
        url: '/Product',
        params,
      }),
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/Product/${id}`,
    }),
    createProduct: builder.mutation<Product, ProductRequest>({
      query: (body) => ({
        url: '/Product',
        method: 'POST',
        body,
      }),
    }),
    updateProduct: builder.mutation<Product, { id: number; body: ProductRequest }>({
      query: ({ id, body }) => ({
        url: `/Product/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    patchProduct: builder.mutation<Product, { id: number; body: ProductPatchRequest }>({
      query: ({ id, body }) => ({
        url: `/Product/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/Product/${id}`,
        method: 'DELETE',
      }),
    }),
    restockProduct: builder.mutation<Product, ProductRestockRequest>({
      query: (body) => ({
        url: '/Product/Restock',
        method: 'POST',
        body,
      }),
    }),

    // Categories
    getCategories: builder.query<Category[], { storeId?: number; isActive?: boolean }>({
      query: (params) => ({
        url: '/Category',
        params,
      }),
    }),
    createCategory: builder.mutation<Category, CategoryRequest>({
      query: (body) => ({
        url: '/Category',
        method: 'POST',
        body,
      }),
    }),
  }),
});

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
