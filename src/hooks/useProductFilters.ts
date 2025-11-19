import { Product} from "@/redux/services/products.services";
import { useState } from "react";

export interface FilterState {
  categoryId: number | null;
  status: string;
  priceMin: string;
  priceMax: string;
  stockMin: string;
  stockMax: string;
}

export function useProductFilters(productList: Product[]) {
  const [filters, setFilters] = useState<FilterState>({
    categoryId: null,
    status: "all",
    priceMin: "", 
    priceMax: "",
    stockMin: "",
    stockMax: ""
  });

  const [searchQuery, setSearchQuery] = useState("");

  const applyFilters = (productList: Product[]) => {
    return productList?.filter(product => {
      // Text search
      const matchesSearch =
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode?.includes(searchQuery) ||
        product.categoryId.toString().includes(searchQuery);

      // Category filter
      const matchesCategory =
        filters.categoryId === null ;

      // Status filter
      const matchesStatus =
        filters.status === "all"

      // Price range filter
      const matchesPrice =
        (!filters.priceMin || product.basePrice >= parseFloat(filters.priceMin)) &&
        (!filters.priceMax || product.costPrice <= parseFloat(filters.priceMax));

      // Stock range filter
      const matchesStock =
        (!filters.stockMin || product.basestock >= parseInt(filters.stockMin)) &&
        (!filters.stockMax || product.basestock <= parseInt(filters.stockMax));

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesStock;
    });
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categoryId: null,
      status: "all",
      priceMin: "",
      priceMax: "",
      stockMin: "",
      stockMax: ""
    });
  };

  const filteredProducts = applyFilters(productList);
  const lowStockProducts = productList?.filter(
    product => product.basestock <= (product.minimumStockLevel || 10)
  );

  const categories = Array.from(new Set(productList?.map(p => p.categoryId)));

  return {
    searchQuery,
    setSearchQuery,
    filters,
    filteredProducts,
    lowStockProducts,
    categories,
    handleApplyFilters,
    handleClearFilters
  };
}
