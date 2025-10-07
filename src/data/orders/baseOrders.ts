
import { Order } from "@/types/order";

export const baseOrders: Order[] = [
  {
    id: "ORD-2024-001",
    customerName: "Adebayo Johnson",
    customerPhone: "+234 803 123 4567",
    customerEmail: "adebayo.johnson@email.com",
    customerId: "CUST-001",
    
    items: [
      {
        id: "ITEM-001",
        productId: "1",
        productName: "Samsung Galaxy S23",
        category: "Electronics",
        quantity: 1,
        unitPrice: 450000,
        totalPrice: 450000,
        sku: "SAM-S23-128GB",
        imageUrl: "/placeholder.svg"
      },
      {
        id: "ITEM-002",
        productId: "4",
        productName: "Sony WH-1000XM4 Headphones",
        category: "Audio",
        quantity: 1,
        unitPrice: 180000,
        totalPrice: 162000,
        discount: 18000,
        sku: "SONY-WH1000XM4",
        imageUrl: "/placeholder.svg"
      }
    ],
    itemsCount: 2,
    
    subtotal: 630000,
    tax: 37800,
    discount: 18000,
    shippingCost: 2500,
    total: 652300,
    
    status: "delivered",
    orderType: "in-store",
    priority: "normal",
    
    originatingStore: {
      id: "STORE-001",
      name: "Lagos Main Store",
      address: "123 Victoria Island, Lagos",
      phone: "+234 701 234 5678",
      manager: "Funmi Adebayo"
    },
    salesRep: {
      id: "REP-001",
      name: "Kemi Ogundimu",
      email: "kemi@easyshop.ng",
      phone: "+234 803 987 6543",
      storeId: "STORE-001"
    },
    
    paymentMethod: "Card (POS Terminal)",
    paymentStatus: "paid",
    
    deliveryType: "delivery",
    deliveryTracking: {
      stage: "delivered",
      estimatedDelivery: "2024-01-15T14:00:00Z",
      actualDelivery: "2024-01-15T13:45:00Z",
      trackingNumber: "GIG123456789",
      courier: "GIG Logistics",
      deliveryAddress: {
        street: "45 Admiralty Way",
        city: "Lekki",
        state: "Lagos",
        postalCode: "101001",
        country: "Nigeria"
      },
      updates: [
        {
          id: "UPD-001",
          timestamp: "2024-01-12T10:30:00Z",
          stage: "confirmed",
          location: "Lagos Main Store",
          notes: "Order confirmed and prepared for dispatch",
          updatedBy: "Store System"
        },
        {
          id: "UPD-002",
          timestamp: "2024-01-12T16:20:00Z",
          stage: "dispatched",
          location: "GIG Logistics Hub",
          notes: "Package dispatched to delivery hub",
          updatedBy: "GIG Logistics API"
        },
        {
          id: "UPD-003",
          timestamp: "2024-01-15T09:15:00Z",
          stage: "out-for-delivery",
          location: "Lekki Distribution Center",
          notes: "Out for delivery - Driver: Bayo (08011223344)",
          updatedBy: "GIG Logistics API"
        },
        {
          id: "UPD-004",
          timestamp: "2024-01-15T13:45:00Z",
          stage: "delivered",
          location: "Customer Address",
          notes: "Package delivered successfully to customer",
          updatedBy: "GIG Logistics API"
        }
      ]
    },
    
    createdAt: "2024-01-12T10:15:00Z",
    updatedAt: "2024-01-15T13:45:00Z",
    confirmedAt: "2024-01-12T10:30:00Z",
    shippedAt: "2024-01-12T16:20:00Z",
    deliveredAt: "2024-01-15T13:45:00Z",
    
    loyaltyPoints: 652,
    customerLevel: "Gold",
    hasActivePromotions: true,
    feedbackRating: 5,
    feedbackComment: "Excellent service! Fast delivery and great product quality.",
    
    notes: "Customer requested expedited delivery",
    internalNotes: "VIP customer - ensure priority handling",
    tags: ["vip", "expedited", "electronics"]
  },
  
  {
    id: "ORD-2024-002",
    customerName: "Chioma Okwu",
    customerPhone: "+234 806 234 5678",
    customerEmail: "chioma.okwu@gmail.com",
    customerId: "CUST-002",
    
    items: [
      {
        id: "ITEM-003",
        productId: "2",
        productName: "Nike Air Max",
        category: "Footwear",
        quantity: 2,
        unitPrice: 65000,
        totalPrice: 130000,
        sku: "NIKE-AIRMAX-42",
        imageUrl: "/placeholder.svg"
      }
    ],
    itemsCount: 2,
    
    subtotal: 130000,
    tax: 7800,
    discount: 0,
    shippingCost: 1800,
    total: 139600,
    
    status: "shipped",
    orderType: "online",
    priority: "normal",
    
    originatingStore: {
      id: "STORE-002",
      name: "Abuja Branch",
      address: "Plot 456 Wuse II, Abuja",
      phone: "+234 708 345 6789",
      manager: "Ahmed Bello"
    },
    
    paymentMethod: "Bank Transfer",
    paymentStatus: "paid",
    
    deliveryType: "delivery",
    deliveryTracking: {
      stage: "in-transit",
      estimatedDelivery: "2024-01-18T16:00:00Z",
      trackingNumber: "RED789012345",
      courier: "Red Star Express",
      deliveryAddress: {
        street: "78 Independence Layout",
        city: "Enugu",
        state: "Enugu",
        postalCode: "400001",
        country: "Nigeria"
      },
      updates: [
        {
          id: "UPD-005",
          timestamp: "2024-01-16T09:00:00Z",
          stage: "confirmed",
          location: "Abuja Branch",
          notes: "Order confirmed and ready for dispatch"
        },
        {
          id: "UPD-006",
          timestamp: "2024-01-16T14:30:00Z",
          stage: "dispatched",
          location: "Red Star Abuja Hub",
          notes: "Package dispatched to Red Star facility"
        },
        {
          id: "UPD-007",
          timestamp: "2024-01-17T11:45:00Z",
          stage: "in-transit",
          location: "En Route to Enugu",
          notes: "Package in transit to destination city"
        }
      ]
    },
    
    createdAt: "2024-01-16T08:30:00Z",
    updatedAt: "2024-01-17T11:45:00Z",
    confirmedAt: "2024-01-16T09:00:00Z",
    shippedAt: "2024-01-16T14:30:00Z",
    
    loyaltyPoints: 140,
    customerLevel: "Silver",
    hasActivePromotions: false,
    
    notes: "Customer preferred Red Star delivery",
    tags: ["online", "footwear"]
  }
];
