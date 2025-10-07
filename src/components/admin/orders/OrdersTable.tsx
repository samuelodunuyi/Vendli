
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { Eye, Gift, Mail, Star, Truck } from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
  onViewOrderDetails: (order: Order) => void;
  onViewEnhancedOrder: (order: Order) => void;
  onViewDeliveryTracking: (order: Order) => void;
}

export function OrdersTable({ 
  orders, 
  onViewOrderDetails, 
  onViewEnhancedOrder, 
  onViewDeliveryTracking 
}: OrdersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "confirmed": return "default";
      case "processing": return "default";
      case "shipped": return "default";
      case "delivered": return "default";
      case "cancelled": return "destructive";
      case "returned": return "destructive";
      default: return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB") + " " + 
           new Date(dateString).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Orders Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Store & Rep</th>
                <th className="text-left p-3">Items</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Delivery</th>
                <th className="text-left p-3">Engagement</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <Badge variant="outline" className="text-xs">
                        {order.orderType}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      {order.customerEmail && (
                        <div className="text-xs text-blue-600">{order.customerEmail}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-sm">{order.originatingStore.name}</div>
                      {order.salesRep && (
                        <div className="text-xs text-gray-600">{order.salesRep.name}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">{order.itemsCount}</td>
                  <td className="p-3 font-medium">₦{order.total.toLocaleString()}</td>
                  <td className="p-3">
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1">
                      {order.deliveryType && (
                        <Badge variant="outline" className="text-xs">
                          {order.deliveryType}
                        </Badge>
                      )}
                      {order.deliveryTracking && (
                        <div className="flex items-center gap-1">
                          <Truck className="h-3 w-3 text-blue-600" />
                          <span className="text-xs">Trackable</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {order.hasActivePromotions && (
                        <Gift className="h-3 w-3 text-purple-600" />
                      )}
                      {order.feedbackRating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs">{order.feedbackRating}</span>
                        </div>
                      )}
                      {order.customerEmail && (
                        <Mail className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onViewEnhancedOrder(order)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Enhanced
                      </Button>

                      {order.deliveryTracking && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewDeliveryTracking(order)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
