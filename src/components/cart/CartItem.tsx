
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DiscountSelector } from "@/components/DiscountSelector";
import { CartItem as CartItemType, Discount } from "@/types";

interface CartItemProps {
  item: CartItemType;
  isPOS?: boolean;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onApplyDiscount?: (productId: number, discount: Discount) => void;
}

export function CartItem({ 
  item, 
  isPOS = false, 
  onRemove, 
  onUpdateQuantity, 
  onApplyDiscount 
}: CartItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center flex-1">
          <img
            src={item.product.imageUrl}
            alt={item.product.productName}
            className="w-12 h-12 object-cover rounded-md border"
          />
          <div className="ml-3 flex-1">
            <h4 className="font-medium text-sm text-gray-900 leading-tight">
              {item.product.productName}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {formatCurrency(item.product.basePrice)} each
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.product.productId)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {item.discount && (
        <Badge variant="secondary" className="mb-2 text-xs">
          {item.discount.description}
        </Badge>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onUpdateQuantity(item.product.productId, item.quantity - 1)}
          >
            -
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              onUpdateQuantity(
                item.product.productId,
                parseInt(e.target.value) || 1
              )
            }
            className="h-7 w-12 text-center p-0 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onUpdateQuantity(item.product.productId, item.quantity + 1)}
          >
            +
          </Button>
        </div>

        {isPOS && onApplyDiscount && (
          <DiscountSelector
            onDiscountSelect={(discount) => onApplyDiscount(item.product.productId, discount)}
            selectedDiscount={item.discount}
          />
        )}
      </div>
    </div>
  );
}
