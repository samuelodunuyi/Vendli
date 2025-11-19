import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import type { StoreFilter } from "@/types/store";
import { useGetStoresQuery } from "@/redux/services/stores.services";
import { useGetCategoriesQuery } from "@/redux/services/products.services";

interface StoreFilterProps {
  filters: StoreFilter;
  onFiltersChange: (filters: StoreFilter) => void;
}

export function StoreFilter({ filters, onFiltersChange }: StoreFilterProps) {
  const { data: storeResponse, isLoading: storesLoading } = useGetStoresQuery();
  const { data: categoriesResponse, isLoading: categoriesLoading } = useGetCategoriesQuery();

  const storeList = storeResponse?.stores ?? [];
  const categoryList = categoriesResponse?.categories ?? [];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Analytics
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* STORE FILTER */}
          <div>
            <label className="text-sm font-medium mb-2 block">Store</label>

            <Select
              value={filters.storeId !== undefined ? String(filters.storeId) : "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  storeId: value === "all" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>

                {!storesLoading &&
                  storeList.map((store) => (
                    <SelectItem key={store.storeId} value={String(store.storeId)}>
                      {store.storeName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* CATEGORY FILTER */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>

            <Select
              value={filters.categoryId !== undefined ? String(filters.categoryId) : "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  categoryId: value === "all" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {!categoriesLoading &&
                  categoryList.map((cat) => (
                    <SelectItem key={cat.categoryId} value={String(cat.categoryId)}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* DATE RANGE FILTER */}
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>

            <Select
              value={filters.dateRangeTimeline || "last30days"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  dateRangeTimeline: value as 
                    | "last7days" 
                    | "last30days" 
                    | "last90days" 
                    | "thisYear",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
