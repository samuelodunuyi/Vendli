import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/common/FormField";
import { StoreSelect } from "@/components/common/StoreSelect";
import { useCreateTransactionsMutation } from "@/redux/services/inventory.services";
import { useGetProductsQuery } from "@/redux/services/products.services";
import { useGetStoresQuery } from "@/redux/services/stores.services";
import { useAuth } from "@/hooks/useAuth";
import { INVENTORY_TX_TYPE } from "@/lib/enums";
import { apiErrorMessage } from "@/lib/errors";

const TRANSFER = 3;
const ADJUSTMENT = 2;

const initial = (storeId: number | null) => ({ type: 0, productId: "", storeId: storeId ?? undefined, toStore: "", quantity: "", reference: "", reason: "" });

export function StockMovementDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user, isSuperAdmin } = useAuth();
  const [form, setForm] = useState(() => initial(user?.storeId ?? null));
  const { data: products } = useGetProductsQuery({ itemsPerPage: 500 }, { skip: !open });
  const { data: stores } = useGetStoresQuery(undefined, { skip: !open || form.type !== TRANSFER });
  const [create, { isLoading }] = useCreateTransactionsMutation();
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (open) setForm(initial(user?.storeId ?? null));
  }, [open, user?.storeId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.storeId) return toast.error("Choose a product and store");
    try {
      await create({
        transactionType: form.type,
        productId: Number(form.productId),
        storeId: form.storeId,
        fromStore: form.type === TRANSFER ? form.storeId : undefined,
        toStore: form.type === TRANSFER ? Number(form.toStore) : undefined,
        quantity: Number(form.quantity),
        reference: form.reference.trim() || undefined,
        reason: form.reason.trim(),
      }).unwrap();
      toast.success("Stock movement recorded");
      onOpenChange(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not record movement"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record stock movement</DialogTitle>
          <DialogDescription>Receive stock, write off items, correct counts or move stock between stores.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="type" label="Type">
              <Select value={String(form.type)} onValueChange={(v) => set("type", Number(v))}>
                <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INVENTORY_TX_TYPE.map((label, i) => (i !== TRANSFER || isSuperAdmin) && <SelectItem key={label} value={String(i)}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="store" label={form.type === TRANSFER ? "From store" : "Store"}>
              <StoreSelect id="store" allowAll={false} className="sm:w-full" value={form.storeId} onChange={(id) => set("storeId", id)} />
            </FormField>
            <FormField id="product" label="Product" className="sm:col-span-2">
              <Select value={form.productId} onValueChange={(v) => set("productId", v)}>
                <SelectTrigger id="product"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {products?.products.map((p) => <SelectItem key={p.productId} value={String(p.productId)}>{p.productName} · {p.sku}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            {form.type === TRANSFER && (
              <FormField id="toStore" label="To store" className="sm:col-span-2">
                <Select value={form.toStore} onValueChange={(v) => set("toStore", v)}>
                  <SelectTrigger id="toStore"><SelectValue placeholder="Destination store" /></SelectTrigger>
                  <SelectContent>
                    {stores?.stores.filter((s) => s.storeId !== form.storeId).map((s) => <SelectItem key={s.storeId} value={String(s.storeId)}>{s.storeName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            )}
            <FormField id="qty" label="Quantity" hint={form.type === ADJUSTMENT ? "Use a negative number to reduce stock." : undefined}>
              <Input id="qty" type="number" required min={form.type === ADJUSTMENT ? undefined : 1} value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
            </FormField>
            <FormField id="ref" label="Reference">
              <Input id="ref" placeholder="PO / GRN / note number" value={form.reference} onChange={(e) => set("reference", e.target.value)} />
            </FormField>
          </div>
          <FormField id="reason" label="Reason *">
            <Textarea id="reason" required rows={2} value={form.reason} onChange={(e) => set("reason", e.target.value)} />
          </FormField>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving…" : "Record movement"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
