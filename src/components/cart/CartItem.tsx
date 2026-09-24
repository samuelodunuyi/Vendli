import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/common/ProductImage";
import { DiscountSelector } from "@/components/DiscountSelector";
import type { CartLine } from "@/redux/slices/cartSlice";
import { findDiscount, lineDiscount } from "@/lib/pricing";
import { formatCurrency } from "@/lib/format";

interface CartItemProps {
  line: CartLine;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
  onDiscount: (discountId?: string) => void;
}

export function CartItem({ line, onQuantity, onRemove, onDiscount }: CartItemProps) {
  const discount = findDiscount(line.discountId);
  const gross = line.unitPrice * line.quantity;
  const net = gross - lineDiscount(line.unitPrice, line.quantity, discount);

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex gap-3">
        <ProductImage src={line.imageUrl} name={line.productName} className="h-11 w-11 shrink-0 rounded-md text-xs" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{line.productName}</p>
          <p className="text-xs text-muted-foreground">{formatCurrency(line.unitPrice)} each</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={onRemove} aria-label={`Remove ${line.productName}`}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center rounded-md border">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onQuantity(line.quantity - 1)} aria-label="Decrease quantity">
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={line.quantity >= line.stock} onClick={() => onQuantity(line.quantity + 1)} aria-label="Increase quantity">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <DiscountSelector selected={discount} onSelect={onDiscount} />
        <div className="ml-auto text-right">
          {discount && <p className="text-xs text-muted-foreground line-through">{formatCurrency(gross)}</p>}
          <p className="text-sm font-semibold tabular-nums">{formatCurrency(net)}</p>
        </div>
      </div>
    </div>
  );
}
