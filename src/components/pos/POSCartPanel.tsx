import { useState } from "react";
import { ShoppingBag, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CartItem } from "@/components/cart/CartItem";
import { CartTotals } from "@/components/cart/CartTotals";
import { PaymentMethods } from "@/components/PaymentMethods";
import { ReverseSaleDialog } from "@/components/ReverseSaleDialog";
import { CustomerFormDialog } from "@/components/admin/customer/CustomerFormDialog";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrderMutation, type Order } from "@/redux/services/orders.services";
import { useGetCustomersQuery } from "@/redux/services/customer.services";
import { formatCurrency } from "@/lib/format";
import { orderTotal } from "@/lib/enums";
import { apiErrorMessage } from "@/lib/errors";
import type { PaymentMethod } from "@/types";

const WALK_IN = "walk-in";

export function POSCartPanel() {
  const cart = useCart();
  const { user } = useAuth();
  const { data: customers } = useGetCustomersQuery({ itemsPerPage: 500, status: 1 });
  const [createOrder, { isLoading: checkingOut }] = useCreateOrderMutation();
  const [paying, setPaying] = useState(false);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [lastSale, setLastSale] = useState<Order | null>(null);
  const [voiding, setVoiding] = useState(false);

  const completeSale = async (method: PaymentMethod) => {
    if (!user?.storeId) return;
    try {
      const order = await createOrder({
        storeId: user.storeId,
        customerId: cart.customerId,
        paymentOption: method,
        orderItems: cart.lines.map((l) => ({ productId: l.productId, quantity: l.quantity, discountId: l.discountId })),
      }).unwrap();
      setLastSale(order);
      cart.clear();
      toast.success(`Sale #${order.id} completed`, { description: formatCurrency(orderTotal(order)) });
    } catch (err) {
      // The cart is left untouched so the cashier can fix the problem and retry.
      toast.error(apiErrorMessage(err, "Could not complete the sale"));
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-5 w-5" /> Current sale
          {cart.itemCount > 0 && <span className="text-sm font-normal text-muted-foreground">({cart.itemCount})</span>}
        </h2>
        {cart.lines.length > 0 && (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={cart.clear}>
            <Trash2 className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      {cart.lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
          <ShoppingBag className="h-12 w-12 opacity-40" />
          <p className="font-medium">No items yet</p>
          <p className="text-sm">Tap a product or scan a barcode to start.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-3">
            {cart.lines.map((line) => (
              <CartItem
                key={line.productId}
                line={line}
                onQuantity={(q) => cart.setQuantity(line.productId, q)}
                onRemove={() => cart.removeItem(line.productId)}
                onDiscount={(id) => cart.applyDiscount(line.productId, id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="space-y-3 border-t bg-muted/30 p-4">
        <div className="flex gap-2">
          <Select value={cart.customerId ? String(cart.customerId) : WALK_IN} onValueChange={(v) => cart.selectCustomer(v === WALK_IN ? null : Number(v))}>
            <SelectTrigger className="flex-1 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={WALK_IN}>Walk-in customer</SelectItem>
              {customers?.customers.map((c) => (
                <SelectItem key={c.id} value={String(c.userId)}>
                  {c.userInfo.firstName} {c.userInfo.lastName}
                  {c.userInfo.phoneNumber && <span className="text-muted-foreground"> · {c.userInfo.phoneNumber}</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="shrink-0 bg-background" onClick={() => setAddingCustomer(true)} aria-label="Add customer">
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>

        <CartTotals subtotal={cart.subtotal} discount={cart.discount} tax={cart.tax} total={cart.total} />

        <Button className="h-12 w-full text-base" disabled={!cart.lines.length || checkingOut} onClick={() => setPaying(true)}>
          {checkingOut ? "Processing…" : `Charge ${formatCurrency(cart.total)}`}
        </Button>

        {lastSale && (
          <div className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm">
            <span className="truncate text-muted-foreground">
              Last sale <span className="font-medium text-foreground">#{lastSale.id}</span> · {formatCurrency(orderTotal(lastSale))}
            </span>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setVoiding(true)}>
              Void
            </Button>
          </div>
        )}
      </div>

      <PaymentMethods
        total={cart.total}
        open={paying}
        onOpenChange={setPaying}
        onPaymentComplete={(method) => {
          setPaying(false);
          completeSale(method);
        }}
      />
      <CustomerFormDialog open={addingCustomer} onOpenChange={setAddingCustomer} onCustomerAdded={(c) => cart.selectCustomer(c.userId)} />
      <ReverseSaleDialog
        order={voiding ? lastSale : null}
        type="void"
        onOpenChange={(open) => !open && setVoiding(false)}
        onReversed={() => setLastSale(null)}
      />
    </div>
  );
}
