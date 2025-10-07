
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Store as StoreIcon, Package, Filter } from "lucide-react";
import type { StoreFilter } from "@/types/store";

interface StoreFilterProps {
  filters: StoreFilter;
  onFiltersChange: (filters: StoreFilter) => void;
}

const stores = [
  { id: "store1", name: "Victoria Island Store" },
  { id: "store2", name: "Ikeja Store" },
  { id: "store3", name: "Lekki Store" },
];

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "footwear", name: "Footwear" },
  { id: "clothing", name: "Clothing" },
  { id: "audio", name: "Audio" },
];

export function StoreFilter({ filters, onFiltersChange }: StoreFilterProps) {
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
          <div>
            <label className="text-sm font-medium mb-2 block">Store</label>
            <Select 
              value={filters.storeId || "all"} 
              onValueChange={(value) => 
                onFiltersChange({ ...filters, storeId: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select 
              value={filters.category || "all"} 
              onValueChange={(value) => 
                onFiltersChange({ ...filters, category: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
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
