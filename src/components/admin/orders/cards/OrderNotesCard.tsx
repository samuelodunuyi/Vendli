
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";

interface OrderNotesCardProps {
  order: Order;
}

export function OrderNotesCard({ order }: OrderNotesCardProps) {
  if (!order.notes && !order.internalNotes) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.notes && (
          <div>
            <p className="text-sm font-medium">Customer Notes</p>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}
        {order.internalNotes && (
          <div>
            <p className="text-sm font-medium">Internal Notes</p>
            <p className="text-sm text-gray-600">{order.internalNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
