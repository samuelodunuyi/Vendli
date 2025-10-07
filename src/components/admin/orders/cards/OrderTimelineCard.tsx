
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { Clock } from "lucide-react";

interface OrderTimelineCardProps {
  order: Order;
}

export function OrderTimelineCard({ order }: OrderTimelineCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB") + " " + 
           new Date(dateString).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Order Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Order Created</p>
              <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          {order.confirmedAt && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Order Confirmed</p>
                <p className="text-xs text-gray-600">{formatDate(order.confirmedAt)}</p>
              </div>
            </div>
          )}
          {order.shippedAt && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Order Shipped</p>
                <p className="text-xs text-gray-600">{formatDate(order.shippedAt)}</p>
              </div>
            </div>
          )}
          {order.deliveredAt && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Order Delivered</p>
                <p className="text-xs text-gray-600">{formatDate(order.deliveredAt)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
