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
      case "confirmed":
      case "processing":
      case "shipped":
      case "delivered": return "default";
      case "cancelled":
      case "returned": return "destructive";
      default: return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB") + " " + 
           new Date(dateString).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Enhanced Orders Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Horizontal scroll container */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Store & Rep</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Items</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Total</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap">
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <Badge variant="outline" className="text-xs">{order.orderType}</Badge>
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                        {order.customerEmail && (
                          <div className="text-xs text-blue-600">{order.customerEmail}</div>
                        )}
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-sm">{order.originatingStore.name}</div>
                        {order.salesRep && (
                          <div className="text-xs text-gray-600">{order.salesRep.name}</div>
                        )}
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap">{order.itemsCount}</td>
                    <td className="p-3 font-medium whitespace-nowrap">₦{order.total.toLocaleString()}</td>
                    
                    <td className="p-3 whitespace-nowrap">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>

                    <td className="p-3 text-sm whitespace-nowrap">{formatDate(order.createdAt)}</td>

                    <td className="p-3 whitespace-nowrap">
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
    </div>
  );
}
