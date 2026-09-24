import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { computeTotals, findDiscount } from "@/lib/pricing";
import type { Product } from "@/redux/services/products.services";

export interface CartLine {
  productId: number;
  productName: string;
  sku: string;
  imageUrl: string;
  unitPrice: number;
  stock: number;
  quantity: number;
  discountId?: string;
}

interface CartState {
  lines: CartLine[];
  customerId: number | null;
}

const initialState: CartState = { lines: [], customerId: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    itemAdded: (state, { payload }: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = payload;
      const line = state.lines.find((l) => l.productId === product.productId);
      if (line) {
        line.quantity = Math.min(line.quantity + quantity, product.basestock);
        line.stock = product.basestock;
        return;
      }
      state.lines.push({
        productId: product.productId,
        productName: product.productName,
        sku: product.sku,
        imageUrl: product.imageUrl,
        unitPrice: product.basePrice,
        stock: product.basestock,
        quantity: Math.min(quantity, product.basestock),
      });
    },
    quantityChanged: (state, { payload }: PayloadAction<{ productId: number; quantity: number }>) => {
      const line = state.lines.find((l) => l.productId === payload.productId);
      if (!line) return;
      if (payload.quantity <= 0) state.lines = state.lines.filter((l) => l !== line);
      else line.quantity = Math.min(payload.quantity, line.stock);
    },
    itemRemoved: (state, { payload }: PayloadAction<number>) => {
      state.lines = state.lines.filter((l) => l.productId !== payload);
    },
    discountApplied: (state, { payload }: PayloadAction<{ productId: number; discountId?: string }>) => {
      const line = state.lines.find((l) => l.productId === payload.productId);
      if (line) line.discountId = findDiscount(payload.discountId) ? payload.discountId : undefined;
    },
    customerSelected: (state, { payload }: PayloadAction<number | null>) => {
      state.customerId = payload;
    },
    cartCleared: () => initialState,
  },
  selectors: {
    selectCartLines: (state) => state.lines,
    selectCartCustomerId: (state) => state.customerId,
  },
});

export const { itemAdded, quantityChanged, itemRemoved, discountApplied, customerSelected, cartCleared } = cartSlice.actions;
export const { selectCartLines, selectCartCustomerId } = cartSlice.selectors;

export const selectCartTotals = createSelector([selectCartLines], (lines) => ({
  itemCount: lines.reduce((s, l) => s + l.quantity, 0),
  ...computeTotals(lines.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity, discount: findDiscount(l.discountId) }))),
}));

export default cartSlice.reducer;
