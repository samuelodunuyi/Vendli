
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { Truck } from "lucide-react";

interface DeliveryInfoCardProps {
  order: Order;
}

export function DeliveryInfoCard({ order }: DeliveryInfoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB") + " " + 
           new Date(dateString).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
  };

  if (!order.deliveryTracking) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Delivery Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Badge>{order.deliveryTracking.stage.replace('-', ' ').toUpperCase()}</Badge>
        </div>
        {order.deliveryTracking.trackingNumber && (
          <div>
            <p className="text-sm font-medium">Tracking Number</p>
            <p className="text-sm font-mono">{order.deliveryTracking.trackingNumber}</p>
          </div>
        )}
        {order.deliveryTracking.courier && (
          <div>
            <p className="text-sm font-medium">Courier</p>
            <p className="text-sm">{order.deliveryTracking.courier}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium">Delivery Address</p>
          <div className="text-sm text-gray-600">
            <p>{order.deliveryTracking.deliveryAddress.street}</p>
            <p>{order.deliveryTracking.deliveryAddress.city}, {order.deliveryTracking.deliveryAddress.state}</p>
            <p>{order.deliveryTracking.deliveryAddress.postalCode}</p>
          </div>
        </div>
        {order.deliveryTracking.estimatedDelivery && (
          <div>
            <p className="text-sm font-medium">Estimated Delivery</p>
            <p className="text-sm">{formatDate(order.deliveryTracking.estimatedDelivery)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
