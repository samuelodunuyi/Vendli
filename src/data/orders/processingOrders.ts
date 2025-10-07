
import { Order } from "@/types/order";

export const processingOrders: Order[] = [
  {
    id: "ORD-2024-005",
    customerName: "Emeka Okafor",
    customerPhone: "+234 812 567 8901",
    customerEmail: "emeka.okafor@outlook.com",
    customerId: "CUST-005",
    
    items: [
      {
        id: "ITEM-007",
        productId: "1",
        productName: "Samsung Galaxy S23",
        category: "Electronics",
        quantity: 2,
        unitPrice: 450000,
        totalPrice: 900000,
        sku: "SAM-S23-128GB",
        imageUrl: "/placeholder.svg"
      }
    ],
    itemsCount: 2,
    
    subtotal: 900000,
    tax: 54000,
    discount: 0,
    shippingCost: 5000,
    total: 959000,
    
    status: "processing",
    orderType: "online",
    priority: "urgent",
    
    originatingStore: {
      id: "STORE-002",
      name: "Abuja Branch",
      address: "Plot 456 Wuse II, Abuja",
      phone: "+234 708 345 6789",
      manager: "Ahmed Bello"
    },
    
    paymentMethod: "Paystack",
    paymentStatus: "paid",
    
    deliveryType: "delivery",
    deliveryTracking: {
      stage: "preparing",
      estimatedDelivery: "2024-01-22T14:00:00Z",
      courier: "DHL Express",
      deliveryAddress: {
        street: "15 Adeola Odeku Street",
        city: "Victoria Island",
        state: "Lagos",
        postalCode: "101001",
        country: "Nigeria"
      },
      updates: [
        {
          id: "UPD-008",
          timestamp: "2024-01-18T13:15:00Z",
          stage: "confirmed",
          location: "Abuja Branch",
          notes: "High priority order confirmed - preparing for express delivery"
        }
      ]
    },
    
    createdAt: "2024-01-18T13:00:00Z",
    updatedAt: "2024-01-18T13:15:00Z",
    confirmedAt: "2024-01-18T13:15:00Z",
    
    loyaltyPoints: 959,
    customerLevel: "Platinum",
    hasActivePromotions: true,
    
    notes: "Corporate bulk order - expedite processing",
    internalNotes: "VIP corporate client - priority handling required",
    tags: ["bulk", "corporate", "urgent", "vip"]
  }
];
