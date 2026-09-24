import { useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { POSHeader } from "@/components/pos/POSHeader";
import { ReverseSaleDialog } from "@/components/ReverseSaleDialog";
import { ProductImage } from "@/components/common/ProductImage";
import { Pager } from "@/components/common/Pager";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/common/StatusBadges";
import { useGetOrdersQuery, type Order } from "@/redux/services/orders.services";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PAYMENT_OPTION, PAYMENT_STATUS, orderTotal } from "@/lib/enums";
import { formatCurrency, formatDateTime, fullName } from "@/lib/format";

const ALL = "all";
const REVERSIBLE = [1, 2, 4];

const POSOrders = () => {
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(ALL);
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Order | null>(null);
  const [returning, setReturning] = useState<Order | null>(null);
  const debounced = useDebouncedValue(search);

  // The API pins store-scoped users to their own store, so no storeId is needed here.
  const { data, isFetching } = useGetOrdersQuery({
    page,
    itemsPerPage: 20,
    search: debounced || undefined,
    paymentStatus: paymentStatus === ALL ? undefined : paymentStatus,
  });
  const orders = data?.orders ?? [];

  const actions = (o: Order) => (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => setViewing(o)}>View</Button>
      {REVERSIBLE.includes(o.status) && (
        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setReturning(o)}>Return</Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <POSHeader active="orders" />
      <main className="mx-auto max-w-6xl space-y-4 p-3 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search order #, customer or phone…" className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={paymentStatus} onValueChange={(v) => { setPaymentStatus(v); setPage(1); }}>
            <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All payments</SelectItem>
              {Object.entries(PAYMENT_STATUS).map(([k, s]) => <SelectItem key={k} value={k}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card className="overflow-hidden">
          {/* Cards on phones, table from md up. */}
          <ul className="divide-y md:hidden">
            {orders.map((o) => (
              <li key={o.id} className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">#{o.id}</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(orderTotal(o))}</span>
                </div>
                <p className="text-sm text-muted-foreground">{fullName(o.customer)} · {formatDateTime(o.orderDate)}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <OrderStatusBadge status={o.status} />
                  <PaymentStatusBadge status={o.paymentStatus} />
                  <div className="ml-auto">{actions(o)}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id}</TableCell>
                    <TableCell>{fullName(o.customer)}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(o.orderDate)}</TableCell>
                    <TableCell><OrderStatusBadge status={o.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PaymentStatusBadge status={o.paymentStatus} />
                        <span className="text-xs text-muted-foreground">{PAYMENT_OPTION[o.paymentOption]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{formatCurrency(orderTotal(o))}</TableCell>
                    <TableCell>{actions(o)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {isFetching && !orders.length && <div className="space-y-2 p-4">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>}
          {!isFetching && !orders.length && <p className="p-10 text-center text-muted-foreground">No orders match your filters.</p>}
          <Pager page={page} totalPages={data?.pagination.totalPages ?? 1} totalItems={data?.pagination.totalItems} onPageChange={setPage} />
        </Card>
      </main>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>Order #{viewing.id}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-2">
                <OrderStatusBadge status={viewing.status} />
                <PaymentStatusBadge status={viewing.paymentStatus} />
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Customer</dt><dd>{fullName(viewing.customer)}</dd>
                <dt className="text-muted-foreground">Date</dt><dd>{formatDateTime(viewing.orderDate)}</dd>
                <dt className="text-muted-foreground">Payment</dt><dd>{PAYMENT_OPTION[viewing.paymentOption]}</dd>
                <dt className="text-muted-foreground">Cashier</dt><dd>{viewing.createdBy}</dd>
              </dl>
              <ul className="divide-y rounded-md border">
                {viewing.orderItems.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 p-2">
                    <ProductImage src={it.productImageUrl} name={it.productName} className="h-10 w-10 rounded text-xs" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{it.productName}</p>
                      <p className="text-xs text-muted-foreground">{it.quantity} × {formatCurrency(it.priceAtOrder)}</p>
                    </div>
                    <span className="text-sm font-medium tabular-nums">{formatCurrency(it.quantity * it.priceAtOrder)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-right font-semibold">Total {formatCurrency(orderTotal(viewing))}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ReverseSaleDialog order={returning} type="return" onOpenChange={(o) => !o && setReturning(null)} />
    </div>
  );
};

export default POSOrders;
