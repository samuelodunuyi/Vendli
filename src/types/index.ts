import { Product } from "@/redux/services/products.services";


export interface CartItem {
  product: Product;
  quantity: number;
  discount?: Discount;
}

export interface Discount {
  id: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

export interface Tax {
  id: string;
  name: string;
  rate: number;
  description: string;
}

export enum PaymentMethod {
  PAYMENT_CASH = 0,
  PAYMENT_CARD = 1,
  PAYMENT_BANK_TRANSFER = 2,
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerName?: string;
  customerPhone?: string;
  cashierName: string;
  timestamp: string;
  status: 'completed' | 'voided' | 'returned';
  voidReason?: string;
  returnReason?: string;
  approvedBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'sales' | 'admin';
}
