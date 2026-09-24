import { useState } from "react";
import { AlertTriangle, Boxes, Download, PackageX, Plus, Search, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ProductsTable, type ProductAction } from "./products/ProductsTable";
import { ProductFormDialog } from "./products/ProductFormDialog";
import { RestockDialog } from "./products/RestockDialog";
import { AdjustStockDialog } from "./products/AdjustStockDialog";
import { ProductActivityDialog, type ProductActivityTab } from "./products/ProductActivityDialog";
import { useDeleteProductMutation, useGetCategoriesQuery, useGetProductsQuery, type Product } from "@/redux/services/products.services";
import { useGetSalesStatisticsQuery } from "@/redux/services/stores.services";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatCompactCurrency, formatNumber } from "@/lib/format";
import { apiErrorMessage } from "@/lib/errors";
import { downloadCsv } from "@/lib/csv";

const ALL = "all";
type Open = { action: ProductAction; product: Product } | { action: "create" } | null;

export function ProductsManagement() {
  const { isSuperAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(ALL);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Open>(null);
  const debounced = useDebouncedValue(search);

  const { data: categories } = useGetCategoriesQuery({});
  const { data: stats } = useGetSalesStatisticsQuery({});
  const { data, isFetching } = useGetProductsQuery({
    page,
    itemsPerPage: 15,
    search: debounced || undefined,
    categoryId: categoryId === ALL ? undefined : Number(categoryId),
  });
  const [deleteProduct] = useDeleteProductMutation();
  const products = data?.products ?? [];
  const close = () => setOpen(null);
  const activeProduct = open && "product" in open ? open.product : null;
  const activityTab = open && ["stock", "movements", "orders"].includes(open.action) ? (open.action as ProductActivityTab) : null;

  const exportCsv = () =>
    downloadCsv(
      "products.csv",
      ["Name", "SKU", "Barcode", "Category", "Price", "Cost", "Stock", "Reorder level", "Active"],
      products.map((p) => [p.productName, p.sku, p.barcode, p.categoryName, p.basePrice, p.costPrice, p.basestock, p.minimumStockLevel, p.isActive ? "Yes" : "No"])
    );

  return (
    <div className="space-y-6">
      <StatGrid>
        <StatCard label="Products" value={formatNumber(stats?.totalProducts)} icon={Boxes} loading={!stats} />
        <StatCard label="Low stock" value={formatNumber(stats?.lowStockProducts)} icon={AlertTriangle} tone="warning" loading={!stats} />
        <StatCard label="Out of stock" value={formatNumber(stats?.outOfStockProducts)} icon={PackageX} tone="danger" loading={!stats} />
        <StatCard label="Stock at cost" value={formatCompactCurrency(stats?.inventoryValue)} icon={Wallet} loading={!stats} />
      </StatGrid>

      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search name, SKU or barcode…" className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setPage(1); }}>
            <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories?.categories.map((c) => <SelectItem key={c.categoryId} value={String(c.categoryId)}>{c.categoryName}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCsv} disabled={!products.length}><Download className="mr-2 h-4 w-4" />Export</Button>
          {isSuperAdmin && <Button className="col-span-2" onClick={() => setOpen({ action: "create" })}><Plus className="mr-2 h-4 w-4" />Add product</Button>}
        </div>
      </div>

      <ProductsTable
        products={products}
        loading={isFetching && !data}
        page={page}
        totalPages={data?.pagination.totalPages ?? 1}
        totalItems={data?.pagination.totalItems}
        onPageChange={setPage}
        onAction={(action, product) => setOpen({ action, product })}
      />

      <ProductFormDialog open={open?.action === "create" || open?.action === "edit"} onOpenChange={(o) => !o && close()} product={open?.action === "edit" ? activeProduct : null} />
      {open?.action === "restock" && <RestockDialog product={activeProduct} onOpenChange={(o) => !o && close()} />}
      <AdjustStockDialog open={open?.action === "distribute"} onOpenChange={(o) => !o && close()} product={open?.action === "distribute" ? activeProduct : null} />
      {activityTab && <ProductActivityDialog product={activeProduct} tab={activityTab} onTabChange={(tab) => activeProduct && setOpen({ action: tab, product: activeProduct })} onOpenChange={(o) => !o && close()} />}
      <ConfirmDialog
        open={open?.action === "delete"}
        onOpenChange={(o) => !o && close()}
        title={`Delete ${activeProduct?.productName}?`}
        description="Products that have been sold are archived instead, so sales history stays intact."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (!activeProduct) return;
          try {
            await deleteProduct(activeProduct.productId).unwrap();
            toast.success("Product removed");
          } catch (err) {
            toast.error(apiErrorMessage(err));
          }
        }}
      />
    </div>
  );
}
