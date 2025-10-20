// src/store/restaurant.services.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../baseUrl';
import type { RootState } from '../store';

// -------------------- Types --------------------

// Store info
export interface StoreInfo {
  storeId: number;
  storeName: string;
  storeAddress: string;
}

// Restaurant product
export interface RestaurantProduct {
  productId: number;
  productName: string;
  description: string;
  sku: string;
  barcode: string;
  categoryId: number;
  storeId: number;
  basePrice: number;
  currentStock: number;
  unitOfMeasure: string;
  imageUrl: string;
  showInWeb: boolean;
  showInPOS: boolean;
  isActive: boolean;
  isRecipe: boolean;
  prepTimeMinutes: number;
  cookingTimeMinutes: number;
  allergens: string;
  spiceLevel: string;
  dietTypes: string;
  store: StoreInfo;
}

// Restaurant product create/update request
export interface RestaurantProductRequest {
  productName: string;
  description: string;
  sku: string;
  barcode: string;
  categoryId: number;
  storeId: number;
  basePrice: number;
  currentStock: number;
  unitOfMeasure: string;
  imageUrl: string;
  showInWeb: boolean;
  showInPOS: boolean;
  isActive: boolean;
  isRecipe: boolean;
  prepTimeMinutes: number;
  cookingTimeMinutes: number;
  allergens: string;
  spiceLevel: string;
  dietTypes: string;
}

// Recipe
export interface RecipeIngredient {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  recipeId: number;
  name: string;
  description: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: RecipeIngredient[];
}

// Recipe create request
export interface RecipeRequest {
  name: string;
  description: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: RecipeIngredient[];
}

// -------------------- API --------------------
export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
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
    // Restaurant Products
    getRestaurantProducts: builder.query<RestaurantProduct[], void>({
      query: () => '/Restaurant',
    }),
    getRestaurantProductById: builder.query<RestaurantProduct, number>({
      query: (id) => `/Restaurant/${id}`,
    }),
    createRestaurantProduct: builder.mutation<RestaurantProduct, RestaurantProductRequest>({
      query: (body) => ({
        url: '/Restaurant',
        method: 'POST',
        body,
      }),
    }),
    updateRestaurantProduct: builder.mutation<void, { id: number; body: RestaurantProductRequest }>({
      query: ({ id, body }) => ({
        url: `/Restaurant/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteRestaurantProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/Restaurant/${id}`,
        method: 'DELETE',
      }),
    }),

    // Recipes
    getRecipesByIngredient: builder.query<Recipe[], number>({
      query: (ingredientId) => `/Restaurant/Recipes/ByIngredient/${ingredientId}`,
    }),
    createRecipe: builder.mutation<Recipe, RecipeRequest>({
      query: (body) => ({
        url: '/Restaurant/Recipes',
        method: 'POST',
        body,
      }),
    }),
    deleteRecipe: builder.mutation<void, number>({
      query: (id) => ({
        url: `/Restaurant/Recipes/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetRestaurantProductsQuery,
  useGetRestaurantProductByIdQuery,
  useCreateRestaurantProductMutation,
  useUpdateRestaurantProductMutation,
  useDeleteRestaurantProductMutation,
  useGetRecipesByIngredientQuery,
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
} = restaurantApi;
