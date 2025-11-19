import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming your UI has a Select component
import { useState, useEffect } from "react";
import { Product } from "@/redux/services/products.services";

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSubmitRestock: (data: {
    productId: number;
    quantity: number;
    reference: string;
    reason: string;
    type: "restock" | "unstock";
  }) => void;
}

export function RestockDialog({
  open,
  onOpenChange,
  product,
  onSubmitRestock,
}: RestockDialogProps) {
  const [quantity, setQuantity] = useState(0);
  const [reference, setReference] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"restock" | "unstock">("restock");

  // Reset fields when product changes
  useEffect(() => {
    setQuantity(0);
    setReference("");
    setReason("");
    setType("restock");
  }, [product]);

  if (!product) return null;

  const handleSubmit = () => {
    if (quantity <= 0) return alert("Quantity must be greater than 0");
    if (!reference) return alert("Reference is required");
    if (!reason) return alert("Reason is required");

    onSubmitRestock({
      productId: product.productId,
      quantity,
      reference,
      reason,
      type,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "restock" ? "Restock" : "Unstock"} Product —{" "}
            {product.productName}
          </DialogTitle>
          <DialogDescription>
            Fill in the details to {type === "restock" ? "add" : "remove"}{" "}
            stock.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
<Select value={type} onValueChange={(v) => setType(v as "restock" | "unstock")}>
  <SelectTrigger>
    <SelectValue placeholder="Select type" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="restock">Restock</SelectItem>
    <SelectItem value="unstock">Unstock</SelectItem>
  </SelectContent>
</Select>
          </div>

          <div>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Quantity"
            />
          </div>

          <div>
            <Input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Reference (e.g., PO-12345)"
            />
          </div>

          <div>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Reason for ${
                type === "restock" ? "restocking" : "unstocking"
              }`}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {type === "restock" ? "Restock" : "Unstock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
