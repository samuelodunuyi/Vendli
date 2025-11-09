// src/store/product.services.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

// -------------------- Types --------------------

// Pagination
export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

// Product
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
  currentStock: number;
  unitOfMeasure: string;
  imageUrl: string;
  additionalImages: { imagePath: string; productId?: number }[];
  showInWeb: boolean;
  showInPOS: boolean;
  isActive: boolean;

  // ===== Missing fields =====
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
  unitOfMeasure: string;
  imageUrl: string;
  additionalImages?: { imagePath: string }[];
  showInWeb: boolean;
  showInPOS: boolean;
  isActive: boolean;
}

// Product Partial Update
export type ProductPatchRequest = Partial<ProductRequest>;

// Product Response with Pagination
export interface GetProductsResponse {
  products: Product[];
  pagination: Pagination;
}

// Category
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

// Category Create/Update Request
export interface CategoryRequest {
  categoryName: string;
  description: string;
  storeId: number;
}

// Category Response with Pagination
export interface GetCategoriesResponse {
  categories: Category[];
  pagination: Pagination;
}

// -------------------- API --------------------
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products', 'Product', 'Categories', 'Category'],

  endpoints: (builder) => ({
    // -------------------- PRODUCTS --------------------
    getProducts: builder.query<GetProductsResponse, {
      storeId?: number;
      categoryId?: number;
      isActive?: boolean;
      showInWeb?: boolean;
      showInPOS?: boolean;
      search?: string;
      page?: number;
      itemsPerPage?: number;
    }>({
      query: (params) => ({ url: '/Product', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ productId }) => ({ type: 'Product' as const, id: productId })),
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

    updateProduct: builder.mutation<Product, { id: number; body: ProductRequest }>({
      query: ({ id, body }) => ({ url: `/Product/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Products', id: 'LIST' }],
    }),

    patchProduct: builder.mutation<Product, { id: number; body: ProductPatchRequest }>({
      query: ({ id, body }) => ({ url: `/Product/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Products', id: 'LIST' }],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({ url: `/Product/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Product', id }, { type: 'Products', id: 'LIST' }],
    }),

    uploadProductImage: builder.mutation<{ imageUrl: string }, FormData>({
      query: (formData) => ({ url: '/Product/upload-image', method: 'POST', body: formData }),
    }),

    // -------------------- CATEGORIES --------------------
    getCategories: builder.query<GetCategoriesResponse, { storeId?: number; isActive?: boolean; page?: number; itemsPerPage?: number }>({
      query: (params) => ({ url: '/Category', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.categories.map(({ categoryId }) => ({ type: 'Category' as const, id: categoryId })),
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

    updateCategory: builder.mutation<Category, { id: number; body: CategoryRequest }>({
      query: ({ id, body }) => ({ url: `/Category/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, { type: 'Categories', id: 'LIST' }],
    }),

    patchCategory: builder.mutation<Category, { id: number; body: Partial<CategoryRequest> }>({
      query: ({ id, body }) => ({ url: `/Category/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, { type: 'Categories', id: 'LIST' }],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/Category/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Category', id }, { type: 'Categories', id: 'LIST' }],
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
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  usePatchCategoryMutation,
  useDeleteCategoryMutation,
} = productApi;
