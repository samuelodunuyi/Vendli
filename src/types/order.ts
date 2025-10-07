
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  sku?: string;
  imageUrl?: string;
}

export interface DeliveryTracking {
  stage: 'pending' | 'confirmed' | 'preparing' | 'dispatched' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'failed';
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  courier?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  updates: DeliveryUpdate[];
}

export interface DeliveryUpdate {
  id: string;
  timestamp: string;
  stage: string;
  location?: string;
  notes?: string;
  updatedBy?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
}

export interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeId: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerId?: string;
  
  // Order Items
  items: OrderItem[];
  itemsCount: number;
  
  // Pricing
  subtotal: number;
  tax: number;
  discount: number;
  shippingCost: number;
  total: number;
  
  // Order Management
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  orderType: "online" | "in-store" | "phone" | "email";
  priority: "low" | "normal" | "high" | "urgent";
  
  // Store and Staff Info
  originatingStore: Store;
  salesRep?: SalesRep;
  assignedTo?: string;
  
  // Payment
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "partial";
  
  // Delivery (for out-of-store orders)
  deliveryType?: "pickup" | "delivery" | "shipping";
  deliveryTracking?: DeliveryTracking;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  
  // Customer Engagement
  loyaltyPoints?: number;
  customerLevel?: string;
  hasActivePromotions?: boolean;
  feedbackRating?: number;
  feedbackComment?: string;
  
  // Additional
  notes?: string;
  internalNotes?: string;
  tags?: string[];
}
