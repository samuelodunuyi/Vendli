import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/redux/services/orders.services";
import { CreditCard } from "lucide-react";

interface PaymentInfoCardProps {
  order: Order;
}

export function PaymentInfoCard({ order }: PaymentInfoCardProps) {
  const getPaymentStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "default"; // Paid
      case 0:
        return "secondary"; // Pending
      case 2:
        return "destructive"; // Failed
      case 3:
        return "destructive"; // Refunded
      case 4:
        return "secondary"; // Partially Paid
      default:
        return "secondary";
    }
  };

  const getPaymentStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Paid";
      case 2:
        return "Failed";
      case 3:
        return "Refunded";
      case 4:
        return "Partially Paid";
      default:
        return "Unknown";
    }
  };

  // ✅ Calculate total amount by summing all item prices
  const totalAmount = order.orderItems.reduce(
    (sum, item) => sum + item.priceAtOrder * item.quantity,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Payment Method</span>
          <span className="text-sm">{order.paymentOption}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Payment Status</span>
          <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
            {getPaymentStatusLabel(order.paymentStatus)}
          </Badge>
        </div>

        <Separator />

        {/* ✅ Total amount from all order items */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Amount</span>
          <span className="text-sm font-medium">
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>

        {/* ✅ Partially paid */}
        {order.paymentStatus === 4 && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Amount Paid</span>
            <span className="text-sm text-green-600">
              ₦{(totalAmount * 0.5).toLocaleString()}
            </span>
          </div>
        )}

        {/* ✅ Refunded */}
        {order.paymentStatus === 3 && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Refund Amount</span>
            <span className="text-sm text-red-600">
              ₦{totalAmount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2">
          Transaction processed via {order.paymentOption}
        </div>
      </CardContent>
    </Card>
  );
}
