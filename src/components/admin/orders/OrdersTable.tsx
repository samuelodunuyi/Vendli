import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/redux/services/orders.services";
import { Eye, Star, Zap } from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
  onViewOrderDetails: (order: Order) => void;
  onViewEnhancedOrder: (order: Order) => void;
  onViewDeliveryTracking: (order: Order) => void;
}


// Map numeric status to label
const STATUS_LABELS: Record<number, string> = {
  0: "Pending",
  1: "Confirmed",
  2: "Completed",
  3: "Awaiting Delivery",
  4: "Delivered",
  5: "Failed",
  6: "Returned",
  7: "Cancelled",
};

export function OrdersTable({
  orders,
  onViewOrderDetails,
  onViewEnhancedOrder,
}: OrdersTableProps) {
  const getStatusColor = (status: number | null) => {
    switch (status) {
      case 0:
        return "secondary";
      case 1:
      case 2:
      case 3:
      case 4:
        return "default";
      case 5:
      case 6:
      case 7:
        return "destructive";
      default:
        return "secondary";
    }
  };


console.log("OrdersTable component loaded", orders);

  const formatDate = (dateString: string) => {
    return (
      new Date(dateString).toLocaleDateString("en-GB") +
      " " +
      new Date(dateString).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };
  
  return (
<div className="w-full max-w-7xl mx-auto px-2">
  <Card className="overflow-hidden">
    <CardHeader>
      <CardTitle>Enhanced Orders Management</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      {/* Scrollable wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[900px] table-auto border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
<th className="text-left p-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Order ID</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Store</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Items</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Total</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => {
              const totalPrice = order.orderItems.reduce(
                (sum, item) => sum + item.priceAtOrder * item.quantity,
                0
              );

              return (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">{order.id}</td>
                  <td className="p-3 whitespace-nowrap">
                    <div>
                      {order?.customer?.firstName} {order?.customer?.lastName}
                      <div className="text-sm text-gray-500">{order?.customer?.phoneNumber}</div>
                      {order?.customer?.email && (
                        <div className="text-xs text-blue-600">{order?.customer?.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">{order?.store?.storeName}</td>
                  <td className="p-3 whitespace-nowrap">
   <ul className="list-disc list-inside text-sm space-y-2">
  {order.orderItems.map((item) => (
    <li key={item.id}>
      {item.productName} x {item.quantity}
      <div className="text-xs text-gray-500 ml-4">₦{item.priceAtOrder.toLocaleString()}</div>
    </li>
  ))}
</ul>
                  </td>
                  <td className="p-3 font-medium whitespace-nowrap">₦{totalPrice.toLocaleString()}</td>
                  <td className="p-3 whitespace-nowrap">
                    <Badge variant={getStatusColor(order.status)}>
                      {STATUS_LABELS[order.status] || "Unknown"}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm whitespace-nowrap">{formatDate(order.orderDate)}</td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => onViewOrderDetails(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
<Button
  variant="default"
  size="sm"
  onClick={() => onViewEnhancedOrder(order)}
  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
>
  Full
</Button>

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</div>

  );
}
