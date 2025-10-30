
import { Product } from "@/redux/services/products.services";
import { useState } from "react";

export function useProductDialogs() {
  const [stockByStoreProduct, setStockByStoreProduct] = useState<Product | null>(null);
  const [adjustStockProduct, setAdjustStockProduct] = useState<Product | null>(null);
  const [transactionHistoryProduct, setTransactionHistoryProduct] = useState<Product | null>(null);
  const [recentOrdersProduct, setRecentOrdersProduct] = useState<Product | null>(null);

  return {
    stockByStoreProduct,
    setStockByStoreProduct,
    adjustStockProduct,
    setAdjustStockProduct,
    transactionHistoryProduct,
    setTransactionHistoryProduct,
    recentOrdersProduct,
    setRecentOrdersProduct
  };
}
