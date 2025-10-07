
import { useState } from "react";
import { Product } from "@/types";

export interface FilterState {
  category: string;
  status: string;
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
    return productList.filter(product => {
      // Text search
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode?.includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = filters.category === "all" || product.category === filters.category;

      // Status filter
      const matchesStatus = filters.status === "all" || product.status === filters.status;

      // Price range filter
      const matchesPrice = (!filters.priceMin || product.price >= parseFloat(filters.priceMin)) &&
        (!filters.priceMax || product.price <= parseFloat(filters.priceMax));

      // Stock range filter
      const matchesStock = (!filters.stockMin || product.stock >= parseInt(filters.stockMin)) &&
        (!filters.stockMax || product.stock <= parseInt(filters.stockMax));

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
  const lowStockProducts = productList.filter(product => product.stock <= (product.lowStockAlert || 10));
  const categories = Array.from(new Set(productList.map(p => p.category)));

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
