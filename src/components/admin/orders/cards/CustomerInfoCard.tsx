
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { User, Phone, Mail } from "lucide-react";

interface CustomerInfoCardProps {
  order: Order;
}

export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="font-medium">{order.customerName}</p>
          {order.customerLevel && (
            <Badge className="text-xs mt-1">{order.customerLevel}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-3 w-3" />
          {order.customerPhone}
        </div>
        {order.customerEmail && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3" />
            {order.customerEmail}
          </div>
        )}
        {order.loyaltyPoints && (
          <div className="text-sm">
            <span className="font-medium">Loyalty Points:</span> {order.loyaltyPoints}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
