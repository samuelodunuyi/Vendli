
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign } from "lucide-react";
import { InventoryStats } from "@/types/analytics";

interface InventoryMetricsProps {
  inventoryStats: InventoryStats;
}

export function InventoryMetrics({ inventoryStats }: InventoryMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Total Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inventoryStats.totalProducts}</div>
          <div className="text-sm text-gray-500 mt-1">In catalog</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Low Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{inventoryStats.lowStockItems}</div>
          <div className="text-sm text-gray-500 mt-1">Items need reorder</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Out of Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</div>
          <div className="text-sm text-gray-500 mt-1">Items unavailable</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Inventory Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{inventoryStats.totalValue.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Total stock value</div>
        </CardContent>
      </Card>
    </div>
  );
}
