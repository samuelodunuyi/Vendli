
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/redux/services/orders.services";
import { Package } from "lucide-react";

interface OrderItemsCardProps {
  order: Order;
}

export function OrderItemsCard({ order }: OrderItemsCardProps) {
  console.log(order)
  return (
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Package className="h-4 w-4" />
      Order Items ({order.orderItems.length})
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {order.orderItems.map((item) => {
        const itemSubtotal = item.priceAtOrder * item.quantity;
        const itemDiscount = Math.max(item.originalPriceAtOrder - item.priceAtOrder, 0);

        return (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              {item.productImageUrl && (
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="max-w-[220px]">
                <p className="font-medium truncate">{item.productName}</p>
                <p className="text-sm text-gray-600 truncate">{item.productCategory}</p>
                {item.sku && (
                  <p className="text-xs text-gray-500 truncate">SKU: {item.sku}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">₦{item.priceAtOrder.toLocaleString()}</p>
              <p className="text-sm text-gray-600">
                {item.quantity} × ₦{item.priceAtOrder.toLocaleString()} = ₦{itemSubtotal.toLocaleString()}
              </p>
              {itemDiscount > 0 && (
                <p className="text-xs text-green-600">
                  -₦{(itemDiscount * item.quantity).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>

    <Separator className="my-4" />

    {/* Totals Section */}
    <div className="space-y-2 text-sm">
      {/** Compute subtotal dynamically from orderItems */}
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>
          ₦{order.orderItems.reduce((sum, item) => sum + item.priceAtOrder * item.quantity, 0).toLocaleString()}
        </span>
      </div>

      {/** Compute total discount from differences between originalPriceAtOrder and priceAtOrder */}
      {order.orderItems.some(item => item.originalPriceAtOrder > item.priceAtOrder) && (
        <div className="flex justify-between text-green-600">
          <span>Total Discount</span>
          <span>
            -₦{order.orderItems
              .reduce((sum, item) => sum + (item.originalPriceAtOrder - item.priceAtOrder) * item.quantity, 0)
              .toLocaleString()}
          </span>
        </div>
      )}

      {/** Compute total dynamically */}
      <Separator />
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>
          ₦{order.orderItems
            .reduce((sum, item) => sum + item.priceAtOrder * item.quantity, 0)
            .toLocaleString()}
        </span>
      </div>
    </div>
  </CardContent>
</Card>
  );
}
