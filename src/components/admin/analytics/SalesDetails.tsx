import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SalesStatistics, TopSellingProduct, RecentOrder } from "@/redux/services/stores.services";

interface SalesDetailsProps {
  stats: SalesStatistics;
}

export function SalesDetails({ stats }: SalesDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(stats.topSellingProducts ?? []).map((product: TopSellingProduct, index: number) => (
              <div key={product.productId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{product.productName}</div>
                    <div className="text-sm text-gray-500">{product.totalQuantity} units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₦{(product.totalAmount || 0).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(stats.recentOrders ?? []).map((order: RecentOrder) => (
              <div key={order.orderId} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{order.orderId}</div>
                  <div className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()} • {order.storeName}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₦{order.totalAmount.toLocaleString()}</div>
                  <Badge variant={order.status?.toLowerCase() === "completed" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
