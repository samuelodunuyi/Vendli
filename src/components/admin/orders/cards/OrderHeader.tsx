import { Badge } from "@/components/ui/badge";
import { Order } from "@/redux/services/orders.services";

interface OrderHeaderProps {
  order: Order;
}

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

export function OrderHeader({ order }: OrderHeaderProps) {
  const getStatusColor = (status: number | null) => {
    switch (status) {
      case 0: 
        return "secondary";
      case 1: 
      case 2: 
      case 3: 
      case 4: 
        return "default";
      case 6: 
      case 7: 
        return "destructive";
      case 5: 
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Order {order.id}</h2>
        <p className="text-gray-600">Created {formatDate(order.orderDate)}</p>
      </div>
      <div className="flex gap-2">
        <Badge variant={getStatusColor(order.status)}>
          {STATUS_LABELS[order.status] || "Unknown"}
        </Badge>
        <Badge variant="outline">
          {order.createdBy.charAt(0).toUpperCase() + order.createdBy.slice(1)}
        </Badge>
      </div>
    </div>
  );
}
