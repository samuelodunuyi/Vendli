import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/common/FormField";
import { useRestockProductMutation, useUnstockProductMutation, type Product } from "@/redux/services/products.services";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/errors";

type Mode = "restock" | "unstock";

export function RestockDialog({ product, onOpenChange }: { product: Product | null; onOpenChange: (open: boolean) => void }) {
  const { user, isStoreScoped } = useAuth();
  const [mode, setMode] = useState<Mode>("restock");
  const [form, setForm] = useState({ quantity: "", reference: "", reason: "" });
  const [restock, restockState] = useRestockProductMutation();
  const [unstock, unstockState] = useUnstockProductMutation();

  useEffect(() => {
    setMode("restock");
    setForm({ quantity: "", reference: "", reason: "" });
  }, [product]);

  if (!product) return null;
  const location = isStoreScoped ? user?.storeName : "the central warehouse";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { productId: product.productId, quantity: Number(form.quantity), reference: form.reference.trim(), reason: form.reason.trim() };
    try {
      const res = await (mode === "restock" ? restock(body) : unstock(body)).unwrap();
      toast.success(`${res.message}. ${product.productName} now has ${res.basestock} units.`);
      onOpenChange(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not update stock"));
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product.productName}</DialogTitle>
          <DialogDescription>Adjust stock held at {location}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="restock">Add stock</TabsTrigger>
              <TabsTrigger value="unstock">Remove stock</TabsTrigger>
            </TabsList>
          </Tabs>
          <FormField id="qty" label="Quantity *">
            <Input id="qty" type="number" min={1} required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </FormField>
          <FormField id="ref" label="Reference *">
            <Input id="ref" required placeholder={mode === "restock" ? "PO-12345" : "WO-12345"} value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          </FormField>
          <FormField id="reason" label="Reason *">
            <Textarea id="reason" required rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </FormField>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={restockState.isLoading || unstockState.isLoading}>{mode === "restock" ? "Add stock" : "Remove stock"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
