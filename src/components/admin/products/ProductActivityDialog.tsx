import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/common/StatusBadges";
import { useGetInventoryProductsQuery, type Product } from "@/redux/services/products.services";
import { useGetTransactionsQuery } from "@/redux/services/inventory.services";
import { useGetOrdersQuery } from "@/redux/services/orders.services";
import { INVENTORY_TX_TYPE } from "@/lib/enums";
import { formatCurrency, formatDate, formatDateTime, fullName } from "@/lib/format";

export type ProductActivityTab = "stock" | "movements" | "orders";

const STOCK_VARIANT = { instock: "secondary", "low stock": "outline", "out of stock": "destructive" } as const;

function Loading() {
  return <div className="space-y-2 py-2">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-10" />)}</div>;
}

function Empty({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{text}</p>;
}

interface ProductActivityDialogProps {
  product: Product | null;
  tab: ProductActivityTab;
  onTabChange: (tab: ProductActivityTab) => void;
  onOpenChange: (open: boolean) => void;
}

/** Stock by store, stock movements and orders for a single product. Each tab only loads when opened. */
export function ProductActivityDialog({ product, tab, onTabChange, onOpenChange }: ProductActivityDialogProps) {
  const productId = product?.productId;
  const stock = useGetInventoryProductsQuery({ productId, itemsPerPage: 100 }, { skip: !productId || tab !== "stock" });
  const moves = useGetTransactionsQuery({ productId, itemsPerPage: 50 }, { skip: !productId || tab !== "movements" });
  const orders = useGetOrdersQuery({ productId, itemsPerPage: 20 }, { skip: !productId || tab !== "orders" });
  if (!product) return null;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.productName}</DialogTitle>
          <DialogDescription>{product.sku} · {formatCurrency(product.basePrice)} · {product.basestock} units in total</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => onTabChange(v as ProductActivityTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="stock">
            {stock.isFetching && !stock.data ? <Loading /> : !stock.data?.items.length ? <Empty text="No store holds this product yet." /> : (
              <ul className="divide-y rounded-md border">
                {stock.data.items.map((i) => (
                  <li key={i.store.id} className="flex items-center justify-between gap-2 p-3 text-sm">
                    <span className="font-medium">{i.store.name}</span>
                    <span className="flex items-center gap-3">
                      <Badge variant={STOCK_VARIANT[i.stockStatus]}>{i.stockStatus}</Badge>
                      <span className="w-10 text-right font-semibold tabular-nums">{i.quantity}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="movements">
            {moves.isFetching && !moves.data ? <Loading /> : !moves.data?.transactions.length ? <Empty text="No stock movements recorded." /> : (
              <ul className="divide-y rounded-md border">
                {moves.data.transactions.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 p-3 text-sm">
                    <Badge variant="outline">{INVENTORY_TX_TYPE[t.type]}</Badge>
                    <span className="font-semibold tabular-nums">{t.quantity}</span>
                    <span className="text-muted-foreground">{t.store.name || "Warehouse"}</span>
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">{t.reason}</span>
                    <span className="text-xs text-muted-foreground">{fullName(t.createdBy)} · {formatDateTime(t.createdOn)}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {orders.isFetching && !orders.data ? <Loading /> : !orders.data?.orders.length ? <Empty text="This product hasn't been ordered yet." /> : (
              <ul className="divide-y rounded-md border">
                {orders.data.orders.map((o) => {
                  const line = o.orderItems.find((i) => i.productId === product.productId);
                  return (
                    <li key={o.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 p-3 text-sm">
                      <span className="font-medium">#{o.id}</span>
                      <span className="text-muted-foreground">{formatDate(o.orderDate)} · {o.store.storeName}</span>
                      <OrderStatusBadge status={o.status} />
                      <span className="ml-auto tabular-nums">{line?.quantity} × {formatCurrency(line?.priceAtOrder)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
