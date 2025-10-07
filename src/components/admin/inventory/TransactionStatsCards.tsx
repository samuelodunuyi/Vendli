
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface TransactionStatsCardsProps {
  inventoryStats: {
    totalTransactions: number;
    stockIn: number;
    stockOut: number;
    adjustments: number;
    totalValue: number;
    lowStockItems: number;
  };
  selectedStoreId: string;
}

export function TransactionStatsCards({ inventoryStats, selectedStoreId }: TransactionStatsCardsProps) {
  const isNetworkView = selectedStoreId === "all";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Total Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inventoryStats.totalTransactions}</div>
          <div className="text-sm text-gray-500 mt-1">
            {isNetworkView ? "All stores" : "This store"}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Stock In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{inventoryStats.stockIn}</div>
          <div className="text-sm text-gray-500 mt-1">Units received</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Stock Out
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{inventoryStats.stockOut}</div>
          <div className="text-sm text-gray-500 mt-1">Units sold/removed</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Adjustments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{inventoryStats.adjustments}</div>
          <div className="text-sm text-gray-500 mt-1">Inventory adjustments</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">₦{inventoryStats.totalValue.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Inventory value</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Low Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{inventoryStats.lowStockItems}</div>
          <div className="text-sm text-gray-500 mt-1">Items need reorder</div>
        </CardContent>
      </Card>
    </div>
  );
}
