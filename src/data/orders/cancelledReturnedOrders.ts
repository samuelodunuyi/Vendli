
import { Order } from "@/types/order";

export const cancelledReturnedOrders: Order[] = [
  {
    id: "ORD-2024-004",
    customerName: "Grace Emenike",
    customerPhone: "+234 809 456 7890",
    customerEmail: "grace.emenike@yahoo.com",
    customerId: "CUST-004",
    
    items: [
      {
        id: "ITEM-005",
        productId: "5",
        productName: "Adidas Tracksuit",
        category: "Clothing",
        quantity: 1,
        unitPrice: 35000,
        totalPrice: 31500,
        discount: 3500,
        sku: "ADIDAS-TRACK-M",
        imageUrl: "/placeholder.svg"
      },
      {
        id: "ITEM-006",
        productId: "6",
        productName: "Oraimo FreePods 4",
        category: "Audio",
        quantity: 1,
        unitPrice: 28000,
        totalPrice: 28000,
        sku: "ORAIMO-FP4-BLACK",
        imageUrl: "/placeholder.svg"
      }
    ],
    itemsCount: 2,
    
    subtotal: 63000,
    tax: 3780,
    discount: 3500,
    shippingCost: 2000,
    total: 65280,
    
    status: "cancelled",
    orderType: "phone",
    priority: "low",
    
    originatingStore: {
      id: "STORE-001",
      name: "Lagos Main Store",
      address: "123 Victoria Island, Lagos",
      phone: "+234 701 234 5678",
      manager: "Funmi Adebayo"
    },
    salesRep: {
      id: "REP-003",
      name: "Tope Adeyemi",
      email: "tope@easyshop.ng",
      phone: "+234 803 567 8901",
      storeId: "STORE-001"
    },
    
    paymentMethod: "Card Payment",
    paymentStatus: "failed",
    
    createdAt: "2024-01-17T15:45:00Z",
    updatedAt: "2024-01-17T16:30:00Z",
    
    loyaltyPoints: 0,
    customerLevel: "Bronze",
    hasActivePromotions: true,
    
    notes: "Customer cancelled due to payment issues",
    internalNotes: "Card declined multiple times - customer requested cancellation",
    tags: ["cancelled", "payment-failed"]
  },
  
  {
    id: "ORD-2024-006",
    customerName: "Aisha Abdullahi",
    customerPhone: "+234 814 678 9012",
    
    items: [
      {
        id: "ITEM-008",
        productId: "2",
        productName: "Nike Air Max",
        category: "Footwear",
        quantity: 1,
        unitPrice: 65000,
        totalPrice: 65000,
        sku: "NIKE-AIRMAX-38",
        imageUrl: "/placeholder.svg"
      }
    ],
    itemsCount: 1,
    
    subtotal: 65000,
    tax: 3900,
    discount: 0,
    shippingCost: 0,
    total: 68900,
    
    status: "returned",
    orderType: "in-store",
    priority: "normal",
    
    originatingStore: {
      id: "STORE-003",
      name: "Kano Outlet",
      address: "12 Bompai Road, Kano",
      phone: "+234 702 456 7890",
      manager: "Fatima Ibrahim"
    },
    salesRep: {
      id: "REP-002",
      name: "Ibrahim Sani",
      email: "ibrahim@easyshop.ng",
      phone: "+234 807 123 4567",
      storeId: "STORE-003"
    },
    
    paymentMethod: "Cash",
    paymentStatus: "refunded",
    
    deliveryType: "pickup",
    
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-16T10:45:00Z",
    confirmedAt: "2024-01-10T14:20:00Z",
    deliveredAt: "2024-01-10T14:20:00Z",
    
    loyaltyPoints: 0,
    customerLevel: "Bronze",
    hasActivePromotions: false,
    feedbackRating: 2,
    feedbackComment: "Wrong size delivered, had to return",
    
    notes: "Size exchange required - customer returned item",
    internalNotes: "Item returned due to wrong size - refund processed",
    tags: ["returned", "size-issue", "refunded"]
  }
];
