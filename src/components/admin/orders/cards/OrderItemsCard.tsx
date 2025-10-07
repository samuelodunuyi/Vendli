
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/order";
import { Package } from "lucide-react";

interface OrderItemsCardProps {
  order: Order;
}

export function OrderItemsCard({ order }: OrderItemsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Order Items ({order.items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                )}
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  {item.sku && (
                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">₦{item.totalPrice.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} × ₦{item.unitPrice.toLocaleString()}
                </p>
                {item.discount && item.discount > 0 && (
                  <p className="text-xs text-green-600">-₦{item.discount.toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Totals */}
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₦{order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-₦{order.discount.toLocaleString()}</span>
            </div>
          )}
          {order.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>₦{order.tax.toLocaleString()}</span>
            </div>
          )}
          {order.shippingCost > 0 && (
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>₦{order.shippingCost.toLocaleString()}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₦{order.total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
