
import { Separator } from "@/components/ui/separator";
import { taxes } from "@/data/pos";
import { useCart } from "@/context/CartContext";

interface CartTotalsProps {
  subtotal: number;
  totalDiscount: number;
  total: number;
}

export function CartTotals({ subtotal, totalDiscount, total }: CartTotalsProps) {
  const { deliveryCost, selectedDeliveryProvider } = useCart();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="px-4 py-3 border-t bg-white">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        {totalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-{formatCurrency(totalDiscount)}</span>
          </div>
        )}
        
        {taxes.map((tax) => (
          <div key={tax.id} className="flex justify-between text-gray-600">
            <span>{tax.name} ({tax.rate}%):</span>
            <span>{formatCurrency((subtotal - totalDiscount) * tax.rate / 100)}</span>
          </div>
        ))}
        
        {selectedDeliveryProvider && deliveryCost > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Delivery ({selectedDeliveryProvider.name}):</span>
            <span>{formatCurrency(deliveryCost)}</span>
          </div>
        )}
        
        <Separator className="my-2" />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
