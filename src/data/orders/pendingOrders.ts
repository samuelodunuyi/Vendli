
import { Order } from "@/types/order";

export const pendingOrders: Order[] = [
  {
    id: "ORD-2024-003",
    customerName: "Yusuf Musa",
    customerPhone: "+234 805 345 6789",
    
    items: [
      {
        id: "ITEM-004",
        productId: "3",
        productName: "Dell XPS 13 Laptop",
        category: "Electronics",
        quantity: 1,
        unitPrice: 750000,
        totalPrice: 750000,
        sku: "DELL-XPS13-512GB",
        imageUrl: "/placeholder.svg"
      }
    ],
    itemsCount: 1,
    
    subtotal: 750000,
    tax: 45000,
    discount: 0,
    shippingCost: 0,
    total: 795000,
    
    status: "pending",
    orderType: "in-store",
    priority: "high",
    
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
    paymentStatus: "pending",
    
    deliveryType: "pickup",
    
    createdAt: "2024-01-18T11:20:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
    
    loyaltyPoints: 0,
    customerLevel: "Bronze",
    hasActivePromotions: false,
    
    notes: "Customer will pick up tomorrow morning",
    internalNotes: "Hold item at front desk for pickup",
    tags: ["pickup", "high-value", "laptop"]
  }
];
