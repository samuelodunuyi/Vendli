
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreditCard, Receipt, Printer } from "lucide-react";
import { PaymentMethod } from "@/types";
import { paymentMethods } from "@/data/pos";
import { PaymentDeviceManager } from "@/components/PaymentDeviceManager";
import { receiptPrinter } from "@/redux/services/receiptPrinter";
import { toast } from "@/components/ui/sonner";

interface PaymentMethodsProps {
  total: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentComplete: (method: PaymentMethod, amount: number) => void;
}

export function PaymentMethods({ total, open, onOpenChange, onPaymentComplete }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cashAmount, setCashAmount] = useState("");
  const [showPaymentDevice, setShowPaymentDevice] = useState(false);

  const handlePayment = () => {
    if (!selectedMethod) return;

    // For card payments, use payment device
    if (selectedMethod.type === 'card') {
      setShowPaymentDevice(true);
      return;
    }

    if (selectedMethod.type === 'cash') {
      const amount = parseFloat(cashAmount);
      if (amount < total) {
        toast.error("Cash amount is insufficient");
        return;
      }
      if (amount > total) {
        const change = amount - total;
        toast.success(`Payment successful. Change: ₦${change.toLocaleString()}`);
      }
    }

    onPaymentComplete(selectedMethod, selectedMethod.type === 'cash' ? parseFloat(cashAmount) : total);
    onOpenChange(false);
    setSelectedMethod(null);
    setCashAmount("");
  };

  const handlePaymentDeviceComplete = (result: any) => {
    if (selectedMethod) {
      onPaymentComplete(selectedMethod, total);
      setShowPaymentDevice(false);
      setSelectedMethod(null);
    }
  };

  const handleTestPrint = async () => {
    try {
      await receiptPrinter.printTest();
      toast.success("Test receipt sent to printer");
    } catch (error) {
      toast.error("Failed to print test receipt");
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card':
        return <CreditCard className="h-6 w-6" />;
      case 'receipt':
        return <Receipt className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
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
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={selectedMethod?.id === method.id ? "default" : "outline"}
                  className="h-12 justify-start"
                  onClick={() => setSelectedMethod(method)}
                >
                  {getIcon(method.icon)}
                  <span className="ml-3">{method.name}</span>
                  {method.type === 'card' && <span className="ml-auto text-xs text-gray-500">POS Device</span>}
                </Button>
              ))}
            </div>

            {selectedMethod?.type === 'cash' && (
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
                disabled={!selectedMethod || (selectedMethod.type === 'cash' && !cashAmount)}
                className="flex-1 font-bold bg-blue-600 hover:bg-blue-700 text-white"
              >
                {selectedMethod?.type === 'card' ? 'Use Card Reader' : 'Process Payment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Device Dialog */}
      {selectedMethod && (
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
