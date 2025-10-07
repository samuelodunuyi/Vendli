
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Star } from "lucide-react";

interface OrdersStatsProps {
  orderStats: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    totalLoyaltyPoints: number;
    avgRating: number;
  };
}

export function OrdersStats({ orderStats }: OrdersStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orderStats.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{orderStats.pending}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{orderStats.processing}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{orderStats.completed}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{orderStats.cancelled}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">₦{orderStats.totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
            <Gift className="h-3 w-3" />
            Loyalty Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-purple-600">{orderStats.totalLoyaltyPoints.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
            <Star className="h-3 w-3" />
            Avg Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-yellow-600">{orderStats.avgRating.toFixed(1)}/5</div>
        </CardContent>
      </Card>
    </div>
  );
}
