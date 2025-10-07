
import { useState } from "react";
import { Trash } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaymentMethods } from "@/components/PaymentMethods";
import { VoidReturnDialog } from "@/components/VoidReturnDialog";
import { Transaction } from "@/types";
import { toast } from "@/components/ui/sonner";
import { CartItem } from "@/components/cart/CartItem";
import { CartTotals } from "@/components/cart/CartTotals";
import { CustomerInfo } from "@/components/cart/CustomerInfo";
import { CartActions } from "@/components/cart/CartActions";
import { EmptyCart } from "@/components/cart/EmptyCart";

interface CartSummaryProps {
  isPOS?: boolean;
}

export function CartSummary({ isPOS = false }: CartSummaryProps) {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal,
    totalDiscount,
    total,
    applyDiscount,
    completeTransaction,
    transactions,
    voidTransaction,
    returnTransaction
  } = useCart();
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showVoidDialog, setShowVoidDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (isPOS) {
      setShowPayment(true);
    } else {
      toast.success("Order placed successfully");
      clearCart();
    }
  };

  const handlePaymentComplete = (paymentMethod: any, amount: number) => {
    const transaction = completeTransaction(paymentMethod, customerName, customerPhone);
    toast.success("Sale completed successfully");
    setCustomerName("");
    setCustomerPhone("");
    
    // Auto-print receipt
    handlePrintReceipt(transaction);
  };

  const handlePrintReceipt = (transaction?: Transaction) => {
    const txn = transaction || transactions[0];
    if (txn) {
      toast.success(`Receipt printed for transaction ${txn.id}`);
    } else {
      toast.success("Receipt sent to printer");
    }
  };

  const handleVoidTransaction = (txnId: string, reason: string, approver: string) => {
    voidTransaction(txnId, reason, approver);
  };

  const handleReturnTransaction = (txnId: string, reason: string, approver: string) => {
    returnTransaction(txnId, reason, approver);
  };

  const handleVoidSale = () => {
    setSelectedTransaction(transactions[0]);
    setShowVoidDialog(true);
  };

  const handleReturnSale = () => {
    setSelectedTransaction(transactions[0]);
    setShowReturnDialog(true);
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 pb-4">
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full"
              onClick={clearCart}
            >
              <Trash className="h-4 w-4 mr-2" /> Clear All Items
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    isPOS={isPOS}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onApplyDiscount={isPOS ? applyDiscount : undefined}
                  />
                ))}
              </div>
            </ScrollArea>
            
            {/* Customer Info */}
            {isPOS && (
              <CustomerInfo
                customerName={customerName}
                customerPhone={customerPhone}
                onCustomerNameChange={setCustomerName}
                onCustomerPhoneChange={setCustomerPhone}
              />
            )}
            
            {/* Totals */}
            <CartTotals
              subtotal={subtotal}
              totalDiscount={totalDiscount}
              total={total}
            />
            
            {/* Action Buttons */}
            <CartActions
              isPOS={isPOS}
              hasItems={items.length > 0}
              hasTransactions={transactions.length > 0}
              onCheckout={handleCheckout}
              onPrintReceipt={() => handlePrintReceipt()}
              onVoidSale={handleVoidSale}
              onReturnSale={handleReturnSale}
            />
          </>
        )}
      </div>

      {/* Payment Dialog */}
      <PaymentMethods
        total={total}
        open={showPayment}
        onOpenChange={setShowPayment}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Void Dialog */}
      <VoidReturnDialog
        open={showVoidDialog}
        onOpenChange={setShowVoidDialog}
        transaction={selectedTransaction}
        type="void"
        onApprove={handleVoidTransaction}
      />

      {/* Return Dialog */}
      <VoidReturnDialog
        open={showReturnDialog}
        onOpenChange={setShowReturnDialog}
        transaction={selectedTransaction}
        type="return"
        onApprove={handleReturnTransaction}
      />
    </>
  );
}
