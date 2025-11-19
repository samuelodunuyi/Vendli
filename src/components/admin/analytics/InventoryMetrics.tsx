import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign } from "lucide-react";
import { SalesStatistics } from "@/redux/services/stores.services";

interface InventoryMetricsProps {
  stats: SalesStatistics;
}

export function InventoryMetrics({ stats }: InventoryMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Total Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold truncate">{stats.totalProducts}</div>
          <div className="text-sm text-gray-500 mt-1 truncate">In catalog</div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Low Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-orange-600 truncate">
            {stats.lowStockProducts}
          </div>
          <div className="text-sm text-gray-500 mt-1 truncate">Items need reorder</div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Out of Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-red-600 truncate">{stats.outOfStockProducts}</div>
          <div className="text-sm text-gray-500 mt-1 truncate">Items unavailable</div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            Inventory Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold truncate">
            ₦{(stats.inventoryValue || 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1 truncate">Total stock value</div>
        </CardContent>
      </Card>
    </div>
  );
}
