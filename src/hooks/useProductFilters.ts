import { Product} from "@/redux/services/products.services";
import { useState } from "react";

export interface FilterState {
  category: string;  // changed from string
  status: string;   // status isActive is boolean
  priceMin: string;
  priceMax: string;
  stockMin: string;
  stockMax: string;
}

export function useProductFilters(productList: Product[]) {
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
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
        filters.category === "all" ;

      // Status filter
      const matchesStatus =
        filters.status === "all"

      // Price range filter
      const matchesPrice =
        (!filters.priceMin || product.basePrice >= parseFloat(filters.priceMin)) &&
        (!filters.priceMax || product.costPrice <= parseFloat(filters.priceMax));

      // Stock range filter
      const matchesStock =
        (!filters.stockMin || product.currentStock >= parseInt(filters.stockMin)) &&
        (!filters.stockMax || product.currentStock <= parseInt(filters.stockMax));

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesStock;
    });
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: "all",
      status: "all",
      priceMin: "",
      priceMax: "",
      stockMin: "",
      stockMax: ""
    });
  };

  const filteredProducts = applyFilters(productList);
  const lowStockProducts = productList?.filter(
    product => product.currentStock <= (product.minimumStockLevel || 10)
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
