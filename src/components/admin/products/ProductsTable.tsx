import { History, MapPin, MoreHorizontal, PackagePlus, Pencil, ShoppingCart, Split, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProductImage } from "@/components/common/ProductImage";
import { Pager } from "@/components/common/Pager";
import type { Product } from "@/redux/services/products.services";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ProductAction = "edit" | "restock" | "distribute" | "stock" | "movements" | "orders" | "delete";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onAction: (action: ProductAction, product: Product) => void;
}

const stockTone = (p: Product) =>
  p.basestock <= 0 ? "text-red-600" : p.basestock <= p.minimumStockLevel ? "text-amber-600" : "text-foreground";

export function ProductsTable({ products, loading, page, totalPages, totalItems, onPageChange, onAction }: ProductsTableProps) {
  const { isSuperAdmin } = useAuth();

  const menu = (p: Product) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Actions for ${p.productName}`}><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isSuperAdmin && <DropdownMenuItem onClick={() => onAction("edit", p)}><Pencil className="mr-2 h-4 w-4" />Edit details</DropdownMenuItem>}
        <DropdownMenuItem onClick={() => onAction("restock", p)}><PackagePlus className="mr-2 h-4 w-4" />Add / remove stock</DropdownMenuItem>
        {isSuperAdmin && <DropdownMenuItem onClick={() => onAction("distribute", p)}><Split className="mr-2 h-4 w-4" />Distribute to stores</DropdownMenuItem>}
        <DropdownMenuSeparator />
        {isSuperAdmin && <DropdownMenuItem onClick={() => onAction("stock", p)}><MapPin className="mr-2 h-4 w-4" />Stock by store</DropdownMenuItem>}
        <DropdownMenuItem onClick={() => onAction("movements", p)}><History className="mr-2 h-4 w-4" />Stock movements</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("orders", p)}><ShoppingCart className="mr-2 h-4 w-4" />Recent orders</DropdownMenuItem>
        {isSuperAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onAction("delete", p)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const identity = (p: Product) => (
    <div className="flex min-w-0 items-center gap-3">
      <ProductImage src={p.imageUrl} name={p.productName} className="h-10 w-10 shrink-0 rounded-md text-xs" />
      <div className="min-w-0">
        <p className="truncate font-medium">{p.productName}</p>
        <p className="truncate text-xs text-muted-foreground">{p.sku} · {p.categoryName}</p>
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      {loading ? (
        <div className="space-y-2 p-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
      ) : !products.length ? (
        <p className="p-10 text-center text-muted-foreground">No products match your search.</p>
      ) : (
        <>
          <ul className="divide-y md:hidden">
            {products.map((p) => (
              <li key={p.productId} className="flex items-center gap-2 p-3">
                <div className="min-w-0 flex-1">{identity(p)}</div>
                <div className="text-right text-sm">
                  <p className="font-medium">{formatCurrency(p.basePrice)}</p>
                  <p className={cn("text-xs font-medium", stockTone(p))}>{p.basestock} in stock</p>
                </div>
                {menu(p)}
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.productId} className={p.isActive ? undefined : "opacity-60"}>
                    <TableCell>{identity(p)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(p.basePrice)}</TableCell>
                    <TableCell className={cn("text-right font-medium tabular-nums", stockTone(p))}>{p.basestock}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={p.isActive ? "secondary" : "outline"}>{p.isActive ? "Active" : "Archived"}</Badge>
                        {!p.showInPOS && <Badge variant="outline">Not on POS</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{menu(p)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      <Pager page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={onPageChange} />
    </Card>
  );
}
