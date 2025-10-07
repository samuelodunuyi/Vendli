
import { Order } from "@/types/order";

export const mockOrdersData: Order[] = [
  {
    id: "ORD001",
    customerName: "Adebayo Johnson",
    customerPhone: "+234 802 123 4567",
    customerEmail: "adebayo.j@email.com",
    customerId: "CUST001",
    
    items: [
      {
        id: "item1",
        productId: "PROD001",
        productName: "Dell XPS 13 Laptop",
        category: "Electronics",
        quantity: 1,
        unitPrice: 650000,
        totalPrice: 650000,
        sku: "DELL-XPS13-001",
        imageUrl: "/placeholder.svg"
      },
      {
        id: "item2",
        productId: "PROD002",
        productName: "Wireless Mouse",
        category: "Accessories",
        quantity: 2,
        unitPrice: 15000,
        totalPrice: 30000,
        sku: "MOUSE-WL-001"
      }
    ],
    itemsCount: 3,
    
    subtotal: 680000,
    tax: 54400,
    discount: 34000,
    shippingCost: 5000,
    total: 705400,
    
    status: "delivered",
    orderType: "online",
    priority: "normal",
    
    originatingStore: {
      id: "store1",
      name: "Victoria Island Store",
      address: "123 Broad Street, Victoria Island, Lagos",
      phone: "+234 801 234 5678",
      manager: "Mrs. Adunni Olatunji"
    },
    salesRep: {
      id: "rep1",
      name: "Chidi Okwu",
      email: "chidi.okwu@store.com",
      phone: "+234 803 456 7890",
      storeId: "store1"
    },
    
    paymentMethod: "Card",
    paymentStatus: "paid",
    
    deliveryType: "delivery",
    deliveryTracking: {
      stage: "delivered",
      estimatedDelivery: "2023-12-17T14:00:00",
      actualDelivery: "2023-12-17T13:45:00",
      trackingNumber: "TRK001234567",
      courier: "GIG Logistics",
      deliveryAddress: {
        street: "45 Ademola Street",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        country: "Nigeria"
      },
      updates: [
        {
          id: "upd1",
          timestamp: "2023-12-15T10:30:00",
          stage: "confirmed",
          notes: "Order confirmed and being prepared",
          updatedBy: "System"
        },
        {
          id: "upd2",
          timestamp: "2023-12-16T09:15:00",
          stage: "dispatched",
          location: "Victoria Island Store",
          notes: "Package dispatched from store",
          updatedBy: "Chidi Okwu"
        },
        {
          id: "upd3",
          timestamp: "2023-12-17T08:30:00",
          stage: "out-for-delivery",
          location: "Lagos Mainland Hub",
          notes: "Out for delivery",
          updatedBy: "GIG Logistics"
        },
        {
          id: "upd4",
          timestamp: "2023-12-17T13:45:00",
          stage: "delivered",
          location: "45 Ademola Street",
          notes: "Package delivered successfully",
          updatedBy: "GIG Logistics"
        }
      ]
    },
    
    createdAt: "2023-12-15T10:30:00",
    updatedAt: "2023-12-17T13:45:00",
    confirmedAt: "2023-12-15T11:00:00",
    shippedAt: "2023-12-16T09:15:00",
    deliveredAt: "2023-12-17T13:45:00",
    
    loyaltyPoints: 1250,
    customerLevel: "Gold",
    hasActivePromotions: true,
    feedbackRating: 4.5,
    feedbackComment: "Great service and fast delivery!",
    
    notes: "Please handle with care - fragile electronics",
    internalNotes: "VIP customer - priority handling",
    tags: ["electronics", "vip", "express-delivery"]
  },
  {
    id: "ORD002",
    customerName: "Fatima Ibrahim",
    customerPhone: "+234 803 987 6543",
    customerEmail: "fatima.ibrahim@email.com",
    customerId: "CUST002",
    
    items: [
      {
        id: "item3",
        productId: "PROD003",
        productName: "Samsung Galaxy S23",
        category: "Mobile Phones",
        quantity: 1,
        unitPrice: 450000,
        totalPrice: 450000,
        sku: "SAM-GS23-001"
      }
    ],
    itemsCount: 1,
    
    subtotal: 450000,
    tax: 36000,
    discount: 0,
    shippingCost: 0,
    total: 486000,
    
    status: "processing",
    orderType: "in-store",
    priority: "normal",
    
    originatingStore: {
      id: "store2",
      name: "Ikeja Store",
      address: "78 Allen Avenue, Ikeja, Lagos",
      phone: "+234 802 345 6789",
      manager: "Mr. Tunde Adebayo"
    },
    salesRep: {
      id: "rep2",
      name: "Kemi Adeleke",
      email: "kemi.adeleke@store.com",
      phone: "+234 804 567 8901",
      storeId: "store2"
    },
    
    paymentMethod: "Transfer",
    paymentStatus: "paid",
    
    deliveryType: "pickup",
    
    createdAt: "2023-12-15T14:20:00",
    updatedAt: "2023-12-15T14:20:00",
    confirmedAt: "2023-12-15T14:25:00",
    
    loyaltyPoints: 890,
    customerLevel: "Silver",
    hasActivePromotions: false,
    feedbackRating: 4.2
  }
];
