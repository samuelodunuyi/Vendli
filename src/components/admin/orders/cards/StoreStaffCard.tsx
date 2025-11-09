
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/redux/services/orders.services";
import { Store } from "lucide-react";

interface StoreStaffCardProps {
  order: Order;
}

export function StoreStaffCard({ order }: StoreStaffCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          Store & Staff
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">{order.store.storeName}</p>
        </div>
        <Separator />
        {order.createdBy && (
          <div>
            <p className="text-sm font-medium">Sales Representative</p>
            <p className="text-sm">{order.createdBy}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
