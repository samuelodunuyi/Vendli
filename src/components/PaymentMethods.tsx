import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreditCard, Receipt, Printer, DollarSign } from "lucide-react";
import { PaymentMethod as PaymentMethodEnum } from "@/types";
import { PaymentDeviceManager } from "@/components/PaymentDeviceManager";
import { receiptPrinter } from "@/redux/services/receiptPrinter";
import { toast } from "@/components/ui/sonner";

interface PaymentMethodsProps {
  total: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentComplete: (method: PaymentMethodEnum, amount: number) => void;
}

const paymentMethodOptions: { label: string; value: PaymentMethodEnum; icon: JSX.Element }[] = [
  { label: "Cash", value: PaymentMethodEnum.PAYMENT_CASH, icon: <DollarSign className="h-6 w-6" /> },
  { label: "Card Payment", value: PaymentMethodEnum.PAYMENT_CARD, icon: <CreditCard className="h-6 w-6" /> },
  { label: "Bank Transfer", value: PaymentMethodEnum.PAYMENT_BANK_TRANSFER, icon: <Receipt className="h-6 w-6" /> },
];

export function PaymentMethods({ total, open, onOpenChange, onPaymentComplete }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodEnum | null>(null);
  const [cashAmount, setCashAmount] = useState("");
  const [showPaymentDevice, setShowPaymentDevice] = useState(false);

  const handlePayment = () => {
    if (selectedMethod === null) return;

    if (selectedMethod === PaymentMethodEnum.PAYMENT_CARD) {
      setShowPaymentDevice(true);
      return;
    }

    if (selectedMethod === PaymentMethodEnum.PAYMENT_CASH) {
      const amount = parseFloat(cashAmount);
      if (amount < total) {
        toast.error("Cash amount is insufficient");
        return;
      }
      if (amount > total) {
        toast.success(`Payment successful. Change: ₦${(amount - total).toLocaleString()}`);
      }
      onPaymentComplete(selectedMethod, amount);
      onOpenChange(false);
      setSelectedMethod(null);
      setCashAmount("");
      return;
    }

    onPaymentComplete(selectedMethod, total);
    onOpenChange(false);
    setSelectedMethod(null);
    setCashAmount("");
  };

  const handlePaymentDeviceComplete = () => {
    if (selectedMethod !== null) {
      onPaymentComplete(selectedMethod, total);
      setShowPaymentDevice(false);
      setSelectedMethod(null);
    }
  };

  const handleTestPrint = async () => {
    try {
      await receiptPrinter.printTest();
      toast.success("Test receipt sent to printer");
    } catch {
      toast.error("Failed to print test receipt");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold">₦{total.toLocaleString()}</p>
            </div>

            <div className="grid gap-3">
              {paymentMethodOptions.map((method) => (
                <Button
                  key={method.value}
                  variant={selectedMethod === method.value ? "default" : "outline"}
                  className="h-12 justify-start"
                  onClick={() => setSelectedMethod(method.value)}
                >
                  {method.icon}
                  <span className="ml-3">{method.label}</span>
                  {method.value === PaymentMethodEnum.PAYMENT_CARD && (
                    <span className="ml-auto text-xs text-gray-500">POS Device</span>
                  )}
                </Button>
              ))}
            </div>

            {selectedMethod === PaymentMethodEnum.PAYMENT_CASH && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Cash Amount Received</label>
                <Input
                  type="number"
                  placeholder="Enter cash amount"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                />
                {cashAmount && parseFloat(cashAmount) > total && (
                  <p className="text-sm text-green-600">
                    Change: ₦{(parseFloat(cashAmount) - total).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            <div className="border-t pt-4">
              <Button
                variant="outline"
                onClick={handleTestPrint}
                className="w-full mb-2"
                size="sm"
              >
                <Printer className="mr-2 h-4 w-4" />
                Test Printer
              </Button>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={
                  selectedMethod === null || (selectedMethod === PaymentMethodEnum.PAYMENT_CASH && !cashAmount)
                }
                className="flex-1 font-bold bg-blue-600 hover:bg-blue-700 text-white"
              >
                {selectedMethod === PaymentMethodEnum.PAYMENT_CARD ? "Use Card Reader" : "Process Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedMethod !== null && (
        <PaymentDeviceManager
          amount={total}
          paymentMethod={selectedMethod}
          open={showPaymentDevice}
          onOpenChange={setShowPaymentDevice}
          onPaymentComplete={handlePaymentDeviceComplete}
        />
      )}
    </>
  );
}
