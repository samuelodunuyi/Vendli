
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/order";
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
          <p className="font-medium">{order.originatingStore.name}</p>
          <p className="text-sm text-gray-600">{order.originatingStore.address}</p>
          <p className="text-sm text-gray-600">{order.originatingStore.phone}</p>
        </div>
        <Separator />
        {order.salesRep && (
          <div>
            <p className="text-sm font-medium">Sales Representative</p>
            <p className="text-sm">{order.salesRep.name}</p>
            <p className="text-sm text-gray-600">{order.salesRep.email}</p>
          </div>
        )}
        {order.assignedTo && (
          <div>
            <p className="text-sm font-medium">Assigned To</p>
            <p className="text-sm">{order.assignedTo}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
