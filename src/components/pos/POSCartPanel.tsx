import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CartSummary } from "@/components/CartSummary";
import clsx from "clsx";

interface POSCartPanelProps {
  totalItems: number;
  className?: string;
}

export function POSCartPanel({ totalItems, className }: POSCartPanelProps) {
  return (
    <Card className={clsx("h-full shadow-md", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Current Sale
          </CardTitle>
          {totalItems > 0 && (
            <Badge className="bg-primary text-white">{totalItems} items</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-80px)]">
        <CartSummary isPOS={true} />
      </CardContent>
    </Card>
  );
}
