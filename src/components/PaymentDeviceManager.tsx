import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wifi, WifiOff, Loader2, DollarSign, Receipt } from "lucide-react";
import { paymentDevice, PaymentResult } from "@/redux/services/paymentDevice";
import { PaymentMethod as PaymentMethodEnum } from "@/types";
import { toast } from "@/components/ui/sonner";

interface PaymentDeviceManagerProps {
  amount: number;
  paymentMethod: PaymentMethodEnum;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentComplete: (result: PaymentResult) => void;
}

// Map enum to labels/icons
const paymentMethodDisplay = (method: PaymentMethodEnum) => {
  switch (method) {
    case PaymentMethodEnum.PAYMENT_CASH:
      return { label: "Cash", icon: <DollarSign className="h-6 w-6" /> };
    case PaymentMethodEnum.PAYMENT_CARD:
      return { label: "Card Payment", icon: <CreditCard className="h-6 w-6" /> };
    case PaymentMethodEnum.PAYMENT_BANK_TRANSFER:
      return { label: "Bank Transfer", icon: <Receipt className="h-6 w-6" /> };
    default:
      return { label: "Unknown", icon: <CreditCard className="h-6 w-6" /> };
  }
};

export function PaymentDeviceManager({ 
  amount, 
  paymentMethod, 
  open, 
  onOpenChange, 
  onPaymentComplete 
}: PaymentDeviceManagerProps) {
  const [isConnected, setIsConnected] = useState(paymentDevice.isConnected);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const { label } = paymentMethodDisplay(paymentMethod);

  useEffect(() => {
    if (open && !isConnected && paymentMethod === PaymentMethodEnum.PAYMENT_CARD) {
      handleConnect();
    }
  }, [open, isConnected, paymentMethod]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await paymentDevice.connect();
      setIsConnected(true);
      toast.success("Payment device connected");
    } catch {
      toast.error("Failed to connect payment device");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    paymentDevice.disconnect();
    setIsConnected(false);
    toast.success("Payment device disconnected");
  };

  const handleProcessPayment = async () => {
    if (!isConnected) {
      toast.error("Payment device not connected");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await paymentDevice.processPayment(amount, paymentMethod);
      if (result.success) {
        toast.success("Payment processed successfully");
        onPaymentComplete(result);
        onOpenChange(false);
      } else {
        toast.error(result.errorMessage || "Payment failed");
      }
    } catch {
      toast.error("Payment processing error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (isProcessing) {
      await paymentDevice.cancelPayment();
      setIsProcessing(false);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Device</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {paymentMethodDisplay(paymentMethod).icon}
              <div>
                <p className="font-medium">POS Terminal</p>
                <p className="text-sm text-gray-600">{label}</p>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Amount to charge</p>
            <p className="text-2xl font-bold">₦{amount.toLocaleString()}</p>
          </div>

          {!isConnected ? (
            <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Payment Device"
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              {isProcessing ? (
                <div className="text-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Processing payment...</p>
                  <p className="text-xs text-gray-500">Please follow prompts on the card reader</p>
                </div>
              ) : (
                <Button onClick={handleProcessPayment} className="w-full">
                  Process Payment
                </Button>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleDisconnect} className="flex-1">
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
