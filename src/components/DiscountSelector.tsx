
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";
import { Discount } from "@/types";
import { discounts } from "@/data/pos";

interface DiscountSelectorProps {
  onDiscountSelect: (discount: Discount) => void;
  selectedDiscount?: Discount;
}

export function DiscountSelector({ onDiscountSelect, selectedDiscount }: DiscountSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleDiscountSelect = (discount: Discount) => {
    onDiscountSelect(discount);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Percent className="mr-2 h-4 w-4" />
          {selectedDiscount ? selectedDiscount.description : "Apply Discount"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Discount</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => handleDiscountSelect(discount)}
            >
              <div>
                <p className="font-medium">{discount.description}</p>
                <p className="text-sm text-gray-500">
                  {discount.type === 'percentage' ? `${discount.value}%` : `₦${discount.value.toLocaleString()}`} off
                </p>
              </div>
              <Badge variant="secondary">
                {discount.type === 'percentage' ? `${discount.value}%` : `₦${discount.value.toLocaleString()}`}
              </Badge>
            </div>
          ))}
          <Button
            variant="ghost"
            onClick={() => {
              onDiscountSelect({ id: "", type: "percentage", value: 0, description: "" });
              setOpen(false);
            }}
            className="text-red-500"
          >
            Remove Discount
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
