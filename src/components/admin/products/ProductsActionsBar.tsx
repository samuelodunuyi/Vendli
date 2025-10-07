
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download } from "lucide-react";

interface ProductsActionsBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddProduct: () => void;
  onExportData: () => void;
}

export function ProductsActionsBar({ 
  searchQuery, 
  setSearchQuery, 
  onAddProduct,
  onExportData
}: ProductsActionsBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onAddProduct} className="font-bold bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
}
