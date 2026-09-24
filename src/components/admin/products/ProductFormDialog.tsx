import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/common/FormField";
import { useCreateProductMutation, useGetCategoriesQuery, useUpdateProductMutation, type Product } from "@/redux/services/products.services";
import { apiErrorMessage } from "@/lib/errors";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

const UNITS = ["pc", "pack", "bottle", "carton", "bag", "box", "kg", "set", "pair", "tin", "jar"];

const EMPTY = {
  productName: "",
  description: "",
  sku: "",
  barcode: "",
  categoryId: "",
  basePrice: "",
  costPrice: "",
  basestock: "",
  minimumStockLevel: "5",
  maximumStockLevel: "100",
  unitOfMeasure: "pc",
  isActive: true,
  showInPOS: true,
  showInWeb: true,
};

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const { data: categories } = useGetCategoriesQuery({}, { skip: !open });
  const [create, createState] = useCreateProductMutation();
  const [update, updateState] = useUpdateProductMutation();
  const [form, setForm] = useState(EMPTY);
  const isEdit = Boolean(product);
  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!open) return;
    setForm(
      product
        ? {
            productName: product.productName,
            description: product.description ?? "",
            sku: product.sku,
            barcode: product.barcode ?? "",
            categoryId: String(product.categoryId),
            basePrice: String(product.basePrice),
            costPrice: String(product.costPrice ?? ""),
            basestock: "",
            minimumStockLevel: String(product.minimumStockLevel ?? 0),
            maximumStockLevel: String(product.maximumStockLevel ?? 0),
            unitOfMeasure: product.unitOfMeasure || "pc",
            isActive: product.isActive,
            showInPOS: product.showInPOS,
            showInWeb: product.showInWeb,
          }
        : EMPTY
    );
  }, [open, product]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      productName: form.productName.trim(),
      description: form.description.trim(),
      sku: form.sku.trim(),
      barcode: form.barcode.trim(),
      categoryId: Number(form.categoryId),
      basePrice: Number(form.basePrice),
      costPrice: Number(form.costPrice) || 0,
      basestock: Number(form.basestock) || 0,
      minimumStockLevel: Number(form.minimumStockLevel) || 0,
      maximumStockLevel: Number(form.maximumStockLevel) || 0,
      unitOfMeasure: form.unitOfMeasure,
      imageUrl: product?.imageUrl ?? "",
      isActive: form.isActive,
      showInPOS: form.showInPOS,
      showInWeb: form.showInWeb,
    };
    try {
      if (product) await update({ id: product.productId, body }).unwrap();
      else await create(body).unwrap();
      toast.success(isEdit ? "Product updated" : "Product added");
      onOpenChange(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save product"));
    }
  };

  const toggle = (key: "isActive" | "showInPOS" | "showInWeb", label: string) => (
    <div className="flex items-center gap-2">
      <Switch id={key} checked={form[key]} onCheckedChange={(v) => set(key, v)} />
      <Label htmlFor={key}>{label}</Label>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${product?.productName}` : "Add product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <FormField id="name" label="Name *">
            <Input id="name" required value={form.productName} onChange={(e) => set("productName", e.target.value)} />
          </FormField>
          <FormField id="description" label="Description">
            <Textarea id="description" rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField id="category" label="Category *">
              <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
                <SelectTrigger id="category"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {categories?.categories.map((c) => <SelectItem key={c.categoryId} value={String(c.categoryId)}>{c.categoryName}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="sku" label="SKU" hint={isEdit ? undefined : "Leave blank to auto-generate."}>
              <Input id="sku" value={form.sku} onChange={(e) => set("sku", e.target.value)} />
            </FormField>
            <FormField id="barcode" label="Barcode">
              <Input id="barcode" inputMode="numeric" value={form.barcode} onChange={(e) => set("barcode", e.target.value)} />
            </FormField>
            <FormField id="price" label="Selling price (₦) *">
              <Input id="price" type="number" min={1} step="any" required value={form.basePrice} onChange={(e) => set("basePrice", e.target.value)} />
            </FormField>
            <FormField id="cost" label="Cost price (₦)">
              <Input id="cost" type="number" min={0} step="any" value={form.costPrice} onChange={(e) => set("costPrice", e.target.value)} />
            </FormField>
            <FormField id="uom" label="Unit">
              <Select value={form.unitOfMeasure} onValueChange={(v) => set("unitOfMeasure", v)}>
                <SelectTrigger id="uom"><SelectValue /></SelectTrigger>
                <SelectContent>{UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <FormField id="min" label="Reorder level">
              <Input id="min" type="number" min={0} value={form.minimumStockLevel} onChange={(e) => set("minimumStockLevel", e.target.value)} />
            </FormField>
            <FormField id="max" label="Max stock">
              <Input id="max" type="number" min={0} value={form.maximumStockLevel} onChange={(e) => set("maximumStockLevel", e.target.value)} />
            </FormField>
            {!isEdit && (
              <FormField id="stock" label="Opening stock" hint="Goes into the central warehouse.">
                <Input id="stock" type="number" min={0} value={form.basestock} onChange={(e) => set("basestock", e.target.value)} />
              </FormField>
            )}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {toggle("isActive", "Active")}
            {toggle("showInPOS", "Sell on POS")}
            {toggle("showInWeb", "Show online")}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createState.isLoading || updateState.isLoading}>{isEdit ? "Save changes" : "Add product"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
