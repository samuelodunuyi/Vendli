
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";

interface CartActionsProps {
  isPOS?: boolean;
  hasItems: boolean;
  hasTransactions: boolean;
  onCheckout: () => void;
  onPrintReceipt: () => void;
  onVoidSale: () => void;
}

export function CartActions({ 
  isPOS = false,
  hasItems,
  hasTransactions,
  onCheckout,
  onPrintReceipt,
  onVoidSale
}: CartActionsProps) {
  if (!hasItems) return null;

  return (
    <div className="p-4 border-t space-y-2">
      <Button 
        className="w-full h-12 text-base font-medium" 
        onClick={onCheckout}
        size="lg"
      >
        {isPOS ? "Process Payment" : "Checkout"}
      </Button>
      
      {isPOS && (
        <>
          <Button 
            variant="outline" 
            className="w-full h-10" 
            onClick={onPrintReceipt}
          >
            <Printer className="mr-2 h-4 w-4" /> Print Last Receipt
          </Button>
          
          {hasTransactions && (
            <div className="grid grid-cols-1 gap-2 mt-2">
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-9 text-xs"
                onClick={onVoidSale}
              >
                Void Sale
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
