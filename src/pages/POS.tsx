import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { POSHeader } from "@/components/pos/POSHeader";
import { ProductSearchBar } from "@/components/pos/ProductSearchBar";
import { CategorySelector } from "@/components/pos/CategorySelector";
import { ProductsGrid } from "@/components/pos/ProductsGrid";
import { POSCartPanel } from "@/components/pos/POSCartPanel";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { useGetCategoriesQuery, useGetProductsQuery, type Product } from "@/redux/services/products.services";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/format";

const PointOfSale = () => {
  const { user } = useAuth();
  const cart = useCart();
  const storeId = user?.storeId ?? undefined;
  const { data: productData, isLoading } = useGetProductsQuery({ storeId, isActive: true, showInPOS: true, itemsPerPage: 500 }, { skip: !storeId });
  const { data: categoryData } = useGetCategoriesQuery({ isActive: true });

  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const products = useMemo(() => productData?.products ?? [], [productData]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (categoryId === null || p.categoryId === categoryId) &&
        (!q || p.productName.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q))
    );
  }, [products, query, categoryId]);

  const inCart = useCallback((productId: number) => cart.lines.find((l) => l.productId === productId)?.quantity ?? 0, [cart.lines]);

  const add = useCallback(
    (product: Product) => {
      if (inCart(product.productId) >= product.basestock) {
        toast.warning(`No more ${product.productName} in stock`);
        return;
      }
      cart.addItem(product);
    },
    [cart, inCart]
  );

  const addByCode = (code: string) => {
    const product = products.find((p) => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase());
    if (product) {
      add(product);
      setQuery("");
    } else if (visible.length === 1) {
      add(visible[0]);
      setQuery("");
    } else if (code) {
      toast.error(`No product matches "${code}"`);
    }
  };

  return (
    // On desktop the till is a fixed-height workspace: products scroll, the sale panel stays put.
    <div className="flex min-h-screen flex-col bg-muted/30 lg:h-screen lg:overflow-hidden">
      <POSHeader active="sale" />

      <div className="flex flex-1 lg:min-h-0">
        <main className="flex-1 space-y-3 overflow-y-auto p-3 pb-24 sm:p-4 lg:pb-4">
          <ProductSearchBar value={query} onChange={setQuery} onSubmit={addByCode} onScannerOpen={() => setScannerOpen(true)} />
          <CategorySelector categories={categoryData?.categories ?? []} selected={categoryId} onChange={setCategoryId} />
          <ProductsGrid products={visible} loading={isLoading} quantityInCart={inCart} onAdd={add} />
        </main>

        <aside className="hidden w-[380px] shrink-0 border-l bg-background lg:block xl:w-[420px]">
          <POSCartPanel />
        </aside>
      </div>

      {/* Phones & tablets: the sale lives in a bottom sheet behind a sticky summary bar. */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background p-3 lg:hidden">
        <Button className="h-12 w-full justify-between text-base" onClick={() => setCartOpen(true)}>
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {cart.itemCount} item{cart.itemCount === 1 ? "" : "s"}
          </span>
          <span>{formatCurrency(cart.total)}</span>
        </Button>
      </div>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="bottom" className="h-[90vh] p-0 lg:hidden">
          <SheetTitle className="sr-only">Current sale</SheetTitle>
          <POSCartPanel />
        </SheetContent>
      </Sheet>

      <BarcodeScanner
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScan={(code) => {
          addByCode(code);
          setScannerOpen(false);
        }}
      />
    </div>
  );
};

export default PointOfSale;
