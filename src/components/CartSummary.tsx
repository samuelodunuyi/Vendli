/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Trash } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaymentMethods } from "@/components/PaymentMethods";
import { VoidDialog } from "@/components/VoidDialog";
import { Transaction } from "@/types";
import { toast } from "@/components/ui/sonner";
import { CartItem } from "@/components/cart/CartItem";
import { CartTotals } from "@/components/cart/CartTotals";
import { CartActions } from "@/components/cart/CartActions";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { Order, useCreateOrderMutation } from "@/redux/services/orders.services";
import { useAppSelector } from "@/redux/store";
import { useGetCustomersQuery } from "@/redux/services/customer.services";
import { AddCustomerDialog } from "./admin/customer/AddCustomerDialog";

interface CartSummaryProps {
  isPOS?: boolean;
}

enum PaymentMethod {
  PAYMENT_CASH = 0,
  PAYMENT_CARD = 1,
  PAYMENT_BANK_TRANSFER = 2,
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
  } = useCart();

  const storeId = useAppSelector((state) => state.auth.user?.storeId);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const { data: customers, refetch } = useGetCustomersQuery({});
  console.log(customers);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showVoidDialog, setShowVoidDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (isPOS) {
      setShowPayment(true);
    } else {
      handleCreateOrder(1);
    }
  };

  const handleCreateOrder = async (
    paymentOption: number,
    customerId?: number
  ) => {
    if (!storeId) {
      toast.error("Missing store information");
      return;
    }

    // Only use selectedCustomerId if provided
    if (!customerId && selectedCustomerId) {
      customerId = selectedCustomerId;
    }

    const orderItems = items.map((item) => ({
      productId: item.product.productId,
      quantity: item.quantity,
      unitPrice: item.product.basePrice,
    }));

    const payload: any = {
      storeId,
      orderItems,
      paymentOption,
    };

    if (customerId) payload.customerId = customerId;

    try {
      const response = await createOrder(payload).unwrap();
      toast.success(`Order #${response.id} created successfully`);
      clearCart();
      setSelectedCustomerId(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create order");
    }
  };

  const handlePaymentComplete = async (
    paymentMethod: PaymentMethod,
    amount: number
  ) => {
    let customer;
    if (selectedCustomerId && customers) {
      customer = customers.customers.find((c) => c.userId === selectedCustomerId);
      if (!customer) {
        toast.error("Selected customer not found.");
        return;
      }
    }

    try {
      await handleCreateOrder(paymentMethod, selectedCustomerId || undefined);
      const transaction = completeTransaction(
        paymentMethod,
        customer?.userInfo.firstName,
        customer?.userInfo.phoneNumber || ""
      );
      toast.success("Sale completed successfully");
      setSelectedCustomerId(null);
      handlePrintReceipt(transaction);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const handlePrintReceipt = (transaction?: Transaction) => {
    const txn = transaction || transactions[0];
    if (txn) {
      toast.success(`Receipt printed for transaction ${txn.id}`);
    } else {
      toast.success("Receipt sent to printer");
    }
  };

  const handleCustomerAdded = () => {
    toast.success("Customer list updated");
    setShowAddDialog(false);
    refetch();
  };

  const handleVoidTransaction = (
    txnId: string,
    reason: string,
    approver: string
  ) => {
    voidTransaction(txnId, reason, approver);
  };

  const handleVoidSale = () => {
    setSelectedTransaction(transactions[0]);
    setShowVoidDialog(true);
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
              disabled={isLoading}
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
                    key={item.product.productId}
                    item={item}
                    isPOS={isPOS}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onApplyDiscount={isPOS ? applyDiscount : undefined}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Customer Select */}
            {isPOS && (
              <div className="px-4 py-3 border-t bg-gray-50/50">
                <select
                  value={selectedCustomerId || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "add") {
                      // Open the AddCustomerDialog
                      setShowAddDialog(true);
                      setSelectedCustomerId(null); // reset selection
                    } else {
                      setSelectedCustomerId(Number(value));
                    }
                  }}
                  className="h-9 w-full text-sm border rounded"
                >
                  <option value="">Select Customer</option>
                  {customers?.customers.map((c) => (
                    <option key={c.id} value={c.userId}>
                      {c.userInfo.firstName} {c.userInfo.lastName} (
                      {c.userInfo.phoneNumber || "N/A"})
                    </option>
                  ))}
                  <option value="add">+ Add Customer</option>
                </select>
              </div>
            )}

            {/* Totals */}
            <CartTotals
              subtotal={subtotal}
              totalDiscount={totalDiscount}
              total={total}
            />

            {/* Actions */}
            <CartActions
              isPOS={isPOS}
              hasItems={items.length > 0}
              hasTransactions={transactions.length > 0}
              onCheckout={handleCheckout}
              onPrintReceipt={() => handlePrintReceipt()}
              onVoidSale={handleVoidSale}
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
      <VoidDialog
        open={showVoidDialog}
        onOpenChange={setShowVoidDialog}
        transaction={selectedTransaction}
        type="void"
        onApprove={handleVoidTransaction}
      />

      <AddCustomerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCustomerAdded={handleCustomerAdded}
      />
    </>
  );
}
