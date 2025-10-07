
import { ShoppingBag } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 text-gray-500">
      <ShoppingBag className="h-16 w-16 mb-4 text-gray-300" />
      <p className="text-lg font-medium mb-2">No items in cart</p>
      <p className="text-sm text-center">Start scanning or searching for products to add them</p>
    </div>
  );
}
