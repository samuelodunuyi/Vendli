import { PackageSearch } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/redux/services/products.services";

interface ProductsGridProps {
  products: Product[];
  loading?: boolean;
  quantityInCart: (productId: number) => number;
  onAdd: (product: Product) => void;
}

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

export function ProductsGrid({ products, loading, quantityInCart, onAdd }: ProductsGridProps) {
  if (loading) {
    return (
      <div className={GRID}>
        {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-52 rounded-lg" />)}
      </div>
    );
  }
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <PackageSearch className="mb-3 h-10 w-10" />
        <p className="font-medium">No products found</p>
        <p className="text-sm">Try a different search or category.</p>
      </div>
    );
  }
  return (
    <div className={GRID}>
      {products.map((p) => (
        <ProductCard key={p.productId} product={p} inCart={quantityInCart(p.productId)} onAdd={onAdd} />
      ))}
    </div>
  );
}
