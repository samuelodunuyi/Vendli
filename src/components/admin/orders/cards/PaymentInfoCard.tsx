
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/order";
import { CreditCard } from "lucide-react";

interface PaymentInfoCardProps {
  order: Order;
}

export function PaymentInfoCard({ order }: PaymentInfoCardProps) {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "pending": return "secondary";
      case "failed": return "destructive";
      case "refunded": return "destructive";
      case "partial": return "secondary";
      default: return "secondary";
    }
  };

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
          <span className="text-sm">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Payment Status</span>
          <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
          </Badge>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Amount</span>
          <span className="text-sm font-medium">₦{order.total.toLocaleString()}</span>
        </div>
        {order.paymentStatus === 'partial' && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Amount Paid</span>
            <span className="text-sm text-green-600">₦{(order.total * 0.5).toLocaleString()}</span>
          </div>
        )}
        {order.paymentStatus === 'refunded' && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Refund Amount</span>
            <span className="text-sm text-red-600">₦{order.total.toLocaleString()}</span>
          </div>
        )}
        <div className="text-xs text-gray-500 pt-2">
          Transaction processed via {order.paymentMethod}
        </div>
      </CardContent>
    </Card>
  );
}
