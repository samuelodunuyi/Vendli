import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { SalesStatistics } from "@/redux/services/stores.services";

interface SalesMetricsProps {
  stats: SalesStatistics;
}

export function SalesMetrics({ stats }: SalesMetricsProps) {
  // map latest sales from salesTrend (if available)
  const labels = stats.salesTrend?.labels ?? [];
  const values = stats.salesTrend?.values ?? [];
  const latest = values.length ? values[values.length - 1] : 0;
  const prev = values.length > 1 ? values[values.length - 2] : latest;
  const salesGrowth = prev === 0 ? 0 : ((latest - prev) / Math.abs(prev)) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Latest Period Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{latest.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1">
            {salesGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(salesGrowth).toFixed(1)}% vs prev
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Total Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.pendingOrders ?? 0} pending
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Avg. Order Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{Math.round(stats.averageOrderValue || 0).toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Per transaction</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{(stats.totalSales || 0).toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Period total</div>
        </CardContent>
      </Card>
    </div>
  );
}
