export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  barcode?: string;
  category: string;
  stock: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  discountPrice?: number;
  lowStockAlert?: number;
}

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

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'transfer' | 'cash' | 'wallet';
  icon: string;
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
