
import { PaymentMethod } from "@/types";

export interface PaymentDevice {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  processPayment: (amount: number, method: PaymentMethod) => Promise<PaymentResult>;
  cancelPayment: () => Promise<void>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  approvalCode?: string;
  last4Digits?: string;
  errorMessage?: string;
  receiptData?: string;
}

class MockPaymentDevice implements PaymentDevice {
  private connected = false;

  get isConnected(): boolean {
    return this.connected;
  }

  async connect(): Promise<void> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.connected = true;
    console.log('Payment device connected');
  }

  disconnect(): void {
    this.connected = false;
    console.log('Payment device disconnected');
  }

  async processPayment(amount: number, method: PaymentMethod): Promise<PaymentResult> {
    if (!this.connected) {
      throw new Error('Payment device not connected');
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/failure (90% success rate for demo)
    const success = Math.random() > 0.1;

    if (success) {
      return {
        success: true,
        transactionId: `TXN${Date.now()}`,
        approvalCode: `${Math.floor(Math.random() * 1000000)}`,
        last4Digits: method.type === 'card' ? '1234' : undefined,
        receiptData: `Payment processed via ${method.name}\nAmount: ₦${amount.toLocaleString()}`
      };
    } else {
      return {
        success: false,
        errorMessage: 'Payment declined - insufficient funds'
      };
    }
  }

  async cancelPayment(): Promise<void> {
    console.log('Payment cancelled');
  }
}

export const paymentDevice = new MockPaymentDevice();
