import { Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DISCOUNTS, type Discount } from "@/lib/pricing";

interface DiscountSelectorProps {
  selected?: Discount;
  onSelect: (discountId?: string) => void;
}

export function DiscountSelector({ selected, onSelect }: DiscountSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={selected ? "secondary" : "ghost"} size="sm" className="h-8 px-2 text-xs">
          <Percent className="mr-1 h-3.5 w-3.5" />
          {selected ? selected.description : "Discount"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {DISCOUNTS.map((d) => (
          <DropdownMenuItem key={d.id} onClick={() => onSelect(d.id)}>
            {d.description}
          </DropdownMenuItem>
        ))}
        {selected && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onSelect(undefined)}>
              Remove discount
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
