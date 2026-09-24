import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  cartCleared,
  customerSelected,
  discountApplied,
  itemAdded,
  itemRemoved,
  quantityChanged,
  selectCartCustomerId,
  selectCartLines,
  selectCartTotals,
} from "@/redux/slices/cartSlice";
import type { Product } from "@/redux/services/products.services";

export function useCart() {
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectCartLines);
  const customerId = useAppSelector(selectCartCustomerId);
  const totals = useAppSelector(selectCartTotals);

  const actions = useMemo(
    () => ({
      addItem: (product: Product, quantity = 1) => dispatch(itemAdded({ product, quantity })),
      setQuantity: (productId: number, quantity: number) => dispatch(quantityChanged({ productId, quantity })),
      removeItem: (productId: number) => dispatch(itemRemoved(productId)),
      applyDiscount: (productId: number, discountId?: string) => dispatch(discountApplied({ productId, discountId })),
      selectCustomer: (id: number | null) => dispatch(customerSelected(id)),
      clear: () => dispatch(cartCleared()),
    }),
    [dispatch]
  );

  return { lines, customerId, ...totals, ...actions };
}
