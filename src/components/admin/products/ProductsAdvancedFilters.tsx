
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { useState } from "react";

interface FilterState {
  category: string;
  status: string;
  priceMin: string;
  priceMax: string;
  stockMin: string;
  stockMax: string;
}

interface ProductsAdvancedFiltersProps {
  categories: string[];
  onApplyFilters: (filters: FilterState) => void;
  activeFilters: FilterState;
  onClearFilters: () => void;
}

export function ProductsAdvancedFilters({ 
  categories, 
  onApplyFilters, 
  activeFilters, 
  onClearFilters 
}: ProductsAdvancedFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(activeFilters);

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = { category: "all", status: "all", priceMin: "", priceMax: "", stockMin: "", stockMax: "" };
    setFilters(emptyFilters);
    onClearFilters();
  };

  const activeFilterCount = Object.values(activeFilters).filter(value => value !== "" && value !== "all").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="filter-category">Category</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter-status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="price-min">Min Price (₦)</Label>
                  <Input
                    id="price-min"
                    type="number"
                    placeholder="0"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="price-max">Max Price (₦)</Label>
                  <Input
                    id="price-max"
                    type="number"
                    placeholder="999999"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="stock-min">Min Stock</Label>
                  <Input
                    id="stock-min"
                    type="number"
                    placeholder="0"
                    value={filters.stockMin}
                    onChange={(e) => setFilters({...filters, stockMin: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="stock-max">Max Stock</Label>
                  <Input
                    id="stock-max"
                    type="number"
                    placeholder="999"
                    value={filters.stockMax}
                    onChange={(e) => setFilters({...filters, stockMax: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
