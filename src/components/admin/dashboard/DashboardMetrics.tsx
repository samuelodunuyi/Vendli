
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardMetrics {
  totalSales: number;
  totalStores: number;
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  delayedOrders: number;
  cancelledOrders: number;
  offlineOrders: number;
}

interface DashboardMetricsProps {
  metrics: DashboardMetrics;
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="space-y-4">
      {/* Key Metrics Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales Amount</p>
                <p className="text-2xl font-bold">₦{metrics.totalSales.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Active Stores</p>
              <p className="text-2xl font-bold">{metrics.totalStores}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +25%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Products Sold</p>
              <p className="text-2xl font-bold">{metrics.totalProducts}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +10%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold">{metrics.totalCustomers}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{metrics.totalOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.pendingOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Confirmed Orders</p>
              <p className="text-2xl font-bold text-green-600">{metrics.confirmedOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Delivered Orders</p>
              <p className="text-2xl font-bold">{metrics.deliveredOrders}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Row 3 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Returned Orders</p>
              <p className="text-2xl font-bold text-red-600">{metrics.returnedOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Delayed Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.delayedOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Cancelled Orders</p>
              <p className="text-2xl font-bold text-red-600">{metrics.cancelledOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Total Offline Orders</p>
              <p className="text-2xl font-bold">{metrics.offlineOrders}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
