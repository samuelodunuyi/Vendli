
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { SalesData } from "@/types/analytics";

interface SalesMetricsProps {
  salesData: SalesData;
}

export function SalesMetrics({ salesData }: SalesMetricsProps) {
  const salesGrowth = ((salesData.todaysSales - salesData.yesterdaysSales) / salesData.yesterdaysSales * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Today's Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{salesData.todaysSales.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1">
            {salesGrowth > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm ${salesGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(salesGrowth).toFixed(1)}% vs yesterday
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
          <div className="text-2xl font-bold">{salesData.totalOrders}</div>
          <div className="text-sm text-gray-500 mt-1">
            {salesData.pendingOrders} pending
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
          <div className="text-2xl font-bold">₦{salesData.averageOrderValue.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Per transaction</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{salesData.monthSales.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Total revenue</div>
        </CardContent>
      </Card>
    </div>
  );
}
