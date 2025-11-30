import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// -------------------- Types ------------------------

export interface Promotion {
  id: number;
  title: string;
  description: string;
  discountType: number;
  discountValue: number;
  startDate: string;
  endDate: string;
  appliesToAllProducts: boolean;
  appliesToAllStores: boolean;
  applicableProductIds: number[] | null;
  applicableStoreIds: number[] | string | null;
  minProductQuantityRequirement?: number | null;
  maxProductQuantityRequirement?: number | null;
  minOrderQuantityRequirement?: number | null;
  maxOrderQuantityRequirement?: number | null;
  minPriceRequirement?: number | null;
  maxPriceRequirement?: number | null;
  customCouponCode?: string | null;
  isDeleted: boolean;
}

export type GetPromotionsResponse = Promotion[];

export interface PromotionRequest {
  title: string;
  description?: string;
  discountType: number;
  discountValue: number;
  startDate: string;
  endDate: string;
  appliesToAllProducts: boolean;
  appliesToAllStores: boolean;
  applicableStoreIds?: number[];
  applicableProductIds?: number[];
}

export interface PromotionQueryParams {
  productId?: number;
  storeId?: number;
  startDate?: string;
  endDate?: string;
  daterangeFrom?: string;
  date_range_to?: string;
  includeDeleted?: boolean;

  page?: number;
  itemsPerPage?: number;
}

// -------------------- API ---------------------------

export const promotionsApi = createApi({
  reducerPath: "promotionsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Promotions"],

  endpoints: (builder) => ({
    // ---------------- GET /api/Promotions ----------------
getPromotions: builder.query<Promotion[], PromotionQueryParams>({
  query: (params) => ({
    url: "/Promotions",
    method: "GET",
    params,
  }),
  providesTags: (result) =>
    result
      ? [
          ...result.map((promo) => ({
            type: "Promotions" as const,
            id: promo.id,
          })),
          { type: "Promotions", id: "LIST" },
        ]
      : [{ type: "Promotions", id: "LIST" }],
}),

    // ---------------- POST /api/Promotions ----------------
    createPromotion: builder.mutation<Promotion, PromotionRequest>({
      query: (body) => ({
        url: "/Promotions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Promotions", id: "LIST" }],
    }),

    // ---------------- PUT /api/Promotions/{id} (full update) ----------------
    updatePromotion: builder.mutation<
      Promotion,
      { id: number; data: PromotionRequest }
    >({
      query: ({ id, data }) => ({
        url: `/Promotions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Promotions", id },
        { type: "Promotions", id: "LIST" },
      ],
    }),

    // ---------------- PATCH /api/Promotions/{id} (partial update) ----------------
    patchPromotion: builder.mutation<
      Promotion,
      { id: number; data: Partial<PromotionRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/Promotions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Promotions", id },
        { type: "Promotions", id: "LIST" },
      ],
    }),

    // ---------------- DELETE /api/Promotions/{id} (soft delete) ----------------
    deletePromotion: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/Promotions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Promotions", id },
        { type: "Promotions", id: "LIST" },
      ],
    }),
  }),
});

// -------------------- Hooks ---------------------------

export const {
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  usePatchPromotionMutation,
  useDeletePromotionMutation,
} = promotionsApi;
