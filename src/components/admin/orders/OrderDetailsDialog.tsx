import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/common/ProductImage";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/common/StatusBadges";
import { FormField } from "@/components/common/FormField";
import { ReverseSaleDialog } from "@/components/ReverseSaleDialog";
import {
  useGetLoyaltyActivityQuery,
  useGetOrderByIdQuery,
  useUpdateEstimatedDeliveryDateMutation,
  useUpdateOrderStatusMutation,
} from "@/redux/services/orders.services";
import { ORDER_STATUS, ORDER_TYPE, PAYMENT_OPTION, orderTotal } from "@/lib/enums";
import { formatCurrency, formatDate, formatDateTime, fullName } from "@/lib/format";
import { apiErrorMessage } from "@/lib/errors";

interface OrderDetailsDialogProps {
  orderId: number | null;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ orderId, onOpenChange }: OrderDetailsDialogProps) {
  // Read from the cache by id so the dialog reflects updates immediately.
  const { data: order } = useGetOrderByIdQuery(orderId ?? 0, { skip: !orderId });
  const { data: loyalty } = useGetLoyaltyActivityQuery({ customer_id: order?.customer.id }, { skip: !order?.customer.id });
  const [updateStatus, { isLoading: savingStatus }] = useUpdateOrderStatusMutation();
  const [updateDelivery, { isLoading: savingDate }] = useUpdateEstimatedDeliveryDateMutation();
  const [returning, setReturning] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");

  const run = async (p: Promise<unknown>, msg: string) => {
    try {
      await p;
      toast.success(msg);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  const points = loyalty?.find((a) => a.orderId === order?.id);

  return (
    <>
      <Dialog open={!!orderId && !returning} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {!order ? (
            <p className="py-10 text-center text-muted-foreground">Loading…</p>
          ) : (
            <div className="space-y-5">
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  Order #{order.id} <OrderStatusBadge status={order.status} /> <PaymentStatusBadge status={order.paymentStatus} />
                </DialogTitle>
                <DialogDescription>
                  {ORDER_TYPE[order.orderType]} · {order.store.storeName} · {formatDateTime(order.orderDate)}
                </DialogDescription>
              </DialogHeader>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                <Info label="Customer" value={fullName(order.customer)} />
                <Info label="Phone" value={order.customer.phoneNumber || "—"} />
                <Info label="Payment" value={PAYMENT_OPTION[order.paymentOption]} />
                <Info label="Reference" value={order.transactionRef ?? "—"} />
                <Info label="Handled by" value={order.createdBy} />
                <Info label="Loyalty" value={points ? `+${points.pointsEarned} pts` : "—"} />
                <Info label="Delivery by" value={formatDate(order.estimatedDeliveryDate)} />
                <Info label="Rating" value={order.rating ? <span className="inline-flex items-center gap-1">{order.rating}<Star className="h-3 w-3 fill-amber-400 text-amber-400" /></span> : "—"} />
              </dl>

              <ul className="divide-y rounded-md border">
                {order.orderItems.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 p-3">
                    <ProductImage src={it.productImageUrl} name={it.productName} className="h-10 w-10 rounded text-xs" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{it.productName}</p>
                      <p className="text-xs text-muted-foreground">{it.sku} · {it.quantity} × {formatCurrency(it.priceAtOrder)}</p>
                    </div>
                    <span className="text-sm font-medium tabular-nums">{formatCurrency(it.quantity * it.priceAtOrder)}</span>
                  </li>
                ))}
                <li className="flex justify-between p-3 font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(orderTotal(order))}</span>
                </li>
              </ul>

              <Separator />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField id="status" label="Update status">
                  <Select value={String(order.status)} disabled={savingStatus} onValueChange={(v) => run(updateStatus({ id: order.id, body: { status: Number(v) } }).unwrap(), "Status updated")}>
                    <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORDER_STATUS).map(([k, s]) => <SelectItem key={k} value={k}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                {order.orderType === 0 && (
                  <FormField id="delivery" label="Estimated delivery">
                    <div className="flex gap-2">
                      <Input id="delivery" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                      <Button variant="outline" disabled={!deliveryDate || savingDate} onClick={() => run(updateDelivery({ id: order.id, body: { estimatedDeliveryDate: deliveryDate } }).unwrap(), "Delivery date saved")}>
                        Save
                      </Button>
                    </div>
                  </FormField>
                )}
              </div>

              {[1, 2, 4].includes(order.status) && (
                <div className="flex justify-end">
                  <Button variant="outline" className="text-destructive" onClick={() => setReturning(true)}>Process return</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ReverseSaleDialog order={returning ? order ?? null : null} type="return" onOpenChange={(o) => !o && setReturning(false)} />
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  );
}
