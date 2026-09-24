import { useState } from "react";
import { Banknote, CheckCircle2, Clock, Search, ShoppingCart, Star, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { StoreSelect } from "@/components/common/StoreSelect";
import { Pager } from "@/components/common/Pager";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/common/StatusBadges";
import { OrderDetailsDialog } from "./orders/OrderDetailsDialog";
import { useGetOrdersQuery } from "@/redux/services/orders.services";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAuth } from "@/hooks/useAuth";
import { ORDER_STATUS, ORDER_TYPE, orderTotal } from "@/lib/enums";
import { formatCompactCurrency, formatCurrency, formatDateTime, fullName, formatNumber } from "@/lib/format";

const ALL = "all";

export function OrdersManagement() {
  const { isStoreScoped } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [storeId, setStoreId] = useState<number>();
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(null);
  const debounced = useDebouncedValue(search);

  const { data, isFetching } = useGetOrdersQuery({
    page,
    itemsPerPage: 20,
    search: debounced || undefined,
    status: status === ALL ? undefined : status,
    storeId,
  });
  const tiles = data?.tiles;
  const orders = data?.orders ?? [];
  const reset = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };

  return (
    <div className="space-y-6">
      <StatGrid className="lg:grid-cols-6">
        <StatCard label="Orders" value={formatNumber(data?.pagination.totalItems)} icon={ShoppingCart} loading={!data} />
        <StatCard label="Revenue" value={formatCompactCurrency(tiles?.revenue)} icon={Banknote} loading={!data} />
        <StatCard label="Pending" value={formatNumber(tiles?.pending)} icon={Clock} tone="warning" loading={!data} />
        <StatCard label="Completed" value={formatNumber((tiles?.completed ?? 0) + (tiles?.delivered ?? 0))} icon={CheckCircle2} tone="success" loading={!data} />
        <StatCard label="Cancelled" value={formatNumber(tiles?.cancelled)} icon={XCircle} tone="danger" loading={!data} />
        <StatCard label="Avg. rating" value={tiles?.averageRating ? `${tiles.averageRating.toFixed(1)}/5` : "—"} icon={Star} loading={!data} />
      </StatGrid>

      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search order #, reference, customer or phone…" className="pl-9" value={search} onChange={(e) => reset(setSearch)(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Select value={status} onValueChange={reset(setStatus)}>
            <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {Object.entries(ORDER_STATUS).map(([k, s]) => <SelectItem key={k} value={k}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <StoreSelect value={storeId} onChange={reset(setStoreId)} />
        </div>
      </div>

      <Card className="overflow-hidden">
        {isFetching && !orders.length ? (
          <div className="space-y-2 p-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : !orders.length ? (
          <p className="p-10 text-center text-muted-foreground">No orders match your filters.</p>
        ) : (
          <>
            <ul className="divide-y md:hidden">
              {orders.map((o) => (
                <li key={o.id}>
                  <button className="w-full space-y-1.5 p-4 text-left hover:bg-muted/50" onClick={() => setOpenId(o.id)}>
                    <div className="flex justify-between font-semibold">
                      <span>#{o.id}</span>
                      <span className="tabular-nums">{formatCurrency(orderTotal(o))}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {fullName(o.customer)} · {isStoreScoped ? "" : `${o.store.storeName} · `}{formatDateTime(o.orderDate)}
                    </p>
                    <div className="flex gap-2"><OrderStatusBadge status={o.status} /><PaymentStatusBadge status={o.paymentStatus} /></div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    {!isStoreScoped && <TableHead>Store</TableHead>}
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>
                        <p className="font-medium">#{o.id}</p>
                        <p className="text-xs text-muted-foreground">{ORDER_TYPE[o.orderType]}</p>
                      </TableCell>
                      <TableCell>
                        <p>{fullName(o.customer)}</p>
                        <p className="text-xs text-muted-foreground">{o.customer.phoneNumber}</p>
                      </TableCell>
                      {!isStoreScoped && <TableCell className="text-muted-foreground">{o.store.storeName}</TableCell>}
                      <TableCell className="text-muted-foreground">{o.orderItems.reduce((s, i) => s + i.quantity, 0)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-1"><OrderStatusBadge status={o.status} /><PaymentStatusBadge status={o.paymentStatus} /></div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(o.orderDate)}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatCurrency(orderTotal(o))}</TableCell>
                      <TableCell><Button size="sm" variant="outline" onClick={() => setOpenId(o.id)}>Open</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        <Pager page={page} totalPages={data?.pagination.totalPages ?? 1} totalItems={data?.pagination.totalItems} onPageChange={setPage} />
      </Card>

      <OrderDetailsDialog orderId={openId} onOpenChange={(o) => !o && setOpenId(null)} />
    </div>
  );
}
