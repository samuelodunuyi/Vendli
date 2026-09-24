import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowRightLeft, ArrowUpFromLine, Download, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { StoreSelect } from "@/components/common/StoreSelect";
import { Pager } from "@/components/common/Pager";
import { CustomDatePicker } from "./CustomDatePicker";
import { StockMovementDialog } from "./inventory/StockMovementDialog";
import { useGetTransactionsQuery, type Transaction } from "@/redux/services/inventory.services";
import { useAuth } from "@/hooks/useAuth";
import { INVENTORY_TX_TYPE } from "@/lib/enums";
import { formatDateTime, formatNumber, fullName } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";

const ALL = "all";
const TYPE_STYLE = [
  { icon: ArrowDownToLine, variant: "secondary" as const },
  { icon: ArrowUpFromLine, variant: "outline" as const },
  { icon: SlidersHorizontal, variant: "outline" as const },
  { icon: ArrowRightLeft, variant: "secondary" as const },
];

export function InventoryTracking() {
  const { isStoreScoped } = useAuth();
  const [storeId, setStoreId] = useState<number>();
  const [type, setType] = useState(ALL);
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);

  const { data, isFetching } = useGetTransactionsQuery({
    storeId,
    type: type === ALL ? undefined : type,
    startDate: range.from?.toISOString(),
    endDate: range.to ? new Date(range.to.getTime() + 86_399_999).toISOString() : undefined,
    page,
    itemsPerPage: 25,
  });

  const summary = (t: number) => data?.summary?.find((s) => s.type === t);
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = data?.transactions ?? [];
    return q ? list.filter((t) => [t.product.name, t.product.sku, t.reference, t.reason].some((v) => v?.toLowerCase().includes(q))) : list;
  }, [data, search]);
  const reset = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };

  const exportRows = () =>
    downloadCsv(
      "stock-movements.csv",
      ["ID", "Date", "Store", "Product", "SKU", "Type", "Quantity", "Reference", "Reason", "By"],
      rows.map((t) => [t.id, t.createdOn, t.store.name, t.product.name, t.product.sku, INVENTORY_TX_TYPE[t.type], t.quantity, t.reference, t.reason, fullName(t.createdBy)])
    );

  const typeBadge = (t: Transaction) => {
    const { icon: Icon, variant } = TYPE_STYLE[t.type] ?? TYPE_STYLE[2];
    return <Badge variant={variant} className="gap-1 whitespace-nowrap"><Icon className="h-3 w-3" />{INVENTORY_TX_TYPE[t.type]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <StatGrid>
        <StatCard label="Units received" value={formatNumber(summary(0)?.totalQuantity)} icon={ArrowDownToLine} tone="success" hint={`${summary(0)?.count ?? 0} receipts`} loading={!data} />
        <StatCard label="Units sold / out" value={formatNumber(summary(1)?.totalQuantity)} icon={ArrowUpFromLine} tone="info" hint={`${summary(1)?.count ?? 0} movements`} loading={!data} />
        <StatCard label="Adjustments" value={formatNumber(summary(2)?.count)} icon={SlidersHorizontal} tone="warning" loading={!data} />
        <StatCard label="Transfers" value={formatNumber(summary(3)?.count)} icon={ArrowRightLeft} tone="accent" loading={!data} />
      </StatGrid>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Filter this page by product, SKU, reference…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <StoreSelect value={storeId} onChange={reset(setStoreId)} />
          <Select value={type} onValueChange={reset(setType)}>
            <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All movements</SelectItem>
              {INVENTORY_TX_TYPE.map((label, i) => <SelectItem key={label} value={String(i)}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
          <CustomDatePicker dateRange={{ from: range.from, to: range.to }} onDateRangeChange={reset(setRange)} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={exportRows} disabled={!rows.length}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button className="flex-1" onClick={() => setAdding(true)}><Plus className="mr-2 h-4 w-4" />Record</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {isFetching && !data ? (
          <div className="space-y-2 p-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-11" />)}</div>
        ) : !rows.length ? (
          <p className="p-10 text-center text-muted-foreground">No stock movements match your filters.</p>
        ) : (
          <>
            <ul className="divide-y md:hidden">
              {rows.map((t) => (
                <li key={t.id} className="space-y-1 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{t.product.name}</p>
                    <span className="font-semibold tabular-nums">{t.quantity}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {typeBadge(t)}
                    {!isStoreScoped && <span>{t.store.name}</span>}
                    <span>{formatDateTime(t.createdOn)}</span>
                  </div>
                  {t.reason && <p className="text-sm text-muted-foreground">{t.reason}</p>}
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    {!isStoreScoped && <TableHead>Store</TableHead>}
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Reference / reason</TableHead>
                    <TableHead>By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(t.createdOn)}</TableCell>
                      <TableCell>
                        <p className="font-medium">{t.product.name}</p>
                        <p className="text-xs text-muted-foreground">{t.product.sku}</p>
                      </TableCell>
                      {!isStoreScoped && (
                        <TableCell className="text-muted-foreground">
                          {t.store.name || "Warehouse"}
                          {t.toStore && <span className="block text-xs">→ {t.toStore}</span>}
                        </TableCell>
                      )}
                      <TableCell>{typeBadge(t)}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{t.quantity}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm">{t.reference}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.reason}</p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{fullName(t.createdBy)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        <Pager page={page} totalPages={data?.pagination.totalPages ?? 1} totalItems={data?.pagination.totalItems} onPageChange={setPage} />
      </Card>

      <StockMovementDialog open={adding} onOpenChange={setAdding} />
    </div>
  );
}
