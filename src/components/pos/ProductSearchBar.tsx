
import { Search, Barcode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductSearchBarProps {
  searchQuery: string;
  barcodeInput: string;
  onSearchChange: (query: string) => void;
  onBarcodeInputChange: (barcode: string) => void;
  onBarcodeSubmit: (e: React.FormEvent) => void;
  onScannerOpen: () => void;
}

export function ProductSearchBar({
  searchQuery,
  barcodeInput,
  onSearchChange,
  onBarcodeInputChange,
  onBarcodeSubmit,
  onScannerOpen
}: ProductSearchBarProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products by name, category, or barcode..."
              className="pl-10 h-11 text-base border-2 focus:border-primary"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {/* Barcode Section */}
          <div className="flex gap-2">
            <form onSubmit={onBarcodeSubmit} className="flex gap-2">
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Scan barcode..."
                  className="pl-10 w-44 h-11 border-2"
                  value={barcodeInput}
                  onChange={(e) => onBarcodeInputChange(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-11 px-6">
                Add Item
              </Button>
            </form>
            
            <Button 
              variant="outline"
              className="h-11 px-4"
              onClick={onScannerOpen}
            >
              <Barcode className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
