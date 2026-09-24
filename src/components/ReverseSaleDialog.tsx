import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/common/FormField";
import { useReverseOrderMutation, type Order } from "@/redux/services/orders.services";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/format";
import { orderTotal } from "@/lib/enums";
import { apiErrorMessage } from "@/lib/errors";

interface ReverseSaleDialogProps {
  order: Order | null;
  type: "void" | "return";
  onOpenChange: (open: boolean) => void;
  onReversed?: () => void;
}

/** Void or return a sale. Approval is checked by the server against a store admin's credentials. */
export function ReverseSaleDialog({ order, type, onOpenChange, onReversed }: ReverseSaleDialogProps) {
  const { user, isStoreScoped, isStoreAdmin } = useAuth();
  const [reverse, { isLoading }] = useReverseOrderMutation();
  const [form, setForm] = useState({ reason: "", approverEmail: "", approverPassword: "" });

  useEffect(() => {
    if (order) setForm({ reason: "", approverEmail: isStoreAdmin || !isStoreScoped ? user?.email ?? "" : "", approverPassword: "" });
  }, [order, isStoreAdmin, isStoreScoped, user?.email]);

  if (!order) return null;
  const verb = type === "void" ? "Void" : "Return";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reverse({ id: order.id, body: { type, ...form } }).unwrap();
      toast.success(`Order #${order.id} ${type === "void" ? "voided" : "returned"} and stock restored`);
      onReversed?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, `${verb} failed`));
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{verb} order #{order.id}</DialogTitle>
          <DialogDescription>
            {formatCurrency(orderTotal(order))} · {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}. A store admin must approve.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <FormField id="reason" label="Reason *">
            <Textarea id="reason" required rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </FormField>
          <FormField id="approverEmail" label="Approver email *">
            <Input id="approverEmail" type="email" required autoComplete="off" value={form.approverEmail} onChange={(e) => setForm({ ...form, approverEmail: e.target.value })} />
          </FormField>
          <FormField id="approverPassword" label="Approver password *">
            <Input id="approverPassword" type="password" required autoComplete="off" value={form.approverPassword} onChange={(e) => setForm({ ...form, approverPassword: e.target.value })} />
          </FormField>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>{isLoading ? "Processing…" : `${verb} sale`}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
