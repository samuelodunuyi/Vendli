
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";

interface OrderHeaderProps {
  order: Order;
}

export function OrderHeader({ order }: OrderHeaderProps) {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB") + " " + 
           new Date(dateString).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Order {order.id}</h2>
        <p className="text-gray-600">Created {formatDate(order.createdAt)}</p>
      </div>
      <div className="flex gap-2">
        <Badge variant={getStatusColor(order.status)}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
        <Badge className={getPriorityColor(order.priority)}>
          {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority
        </Badge>
        <Badge variant="outline">
          {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
        </Badge>
      </div>
    </div>
  );
}
