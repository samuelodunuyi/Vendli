import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/common/ProductImage";
import type { Product } from "@/redux/services/products.services";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  inCart: number;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, inCart, onAdd }: ProductCardProps) {
  const available = product.basestock - inCart;
  const soldOut = available <= 0;
  const low = !soldOut && product.basestock <= (product.minimumStockLevel || 5);

  return (
    <Card
      role="button"
      tabIndex={soldOut ? -1 : 0}
      aria-disabled={soldOut}
      onClick={() => !soldOut && onAdd(product)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !soldOut && (e.preventDefault(), onAdd(product))}
      className={cn(
        "group relative flex flex-col overflow-hidden transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        soldOut ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-primary hover:shadow-md"
      )}
    >
      <ProductImage src={product.imageUrl} name={product.productName} className="aspect-[4/3] w-full text-2xl" />
      {inCart > 0 && <Badge className="absolute left-2 top-2">{inCart} in sale</Badge>}
      {(soldOut || low) && (
        <Badge variant={soldOut ? "destructive" : "secondary"} className="absolute right-2 top-2">
          {soldOut ? "Out of stock" : `${product.basestock} left`}
        </Badge>
      )}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{product.productName}</p>
        <p className="text-xs text-muted-foreground">{product.categoryName}</p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="font-bold text-primary">{formatCurrency(product.basePrice)}</span>
          {!soldOut && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Plus className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
