
import { Transaction } from "@/types";

export const voidedTransactions: Transaction[] = [
  {
    id: "TXN-004",
    items: [
      {
        product: {
          id: "4",
          name: "Sony WH-1000XM4 Headphones",
          description: "Premium noise-cancelling headphones",
          price: 180000,
          imageUrl: "/placeholder.svg",
          barcode: "4567890123456",
          category: "Audio",
          stock: 12,
          status: "Active",
          createdAt: "2023-08-10",
        },
        quantity: 1
      }
    ],
    subtotal: 180000,
    totalDiscount: 18000,
    totalTax: 9720,
    total: 171720,
    paymentMethod: {
      id: "card",
      name: "Debit/Credit Card",
      type: "card",
      icon: "credit-card"
    },
    customerName: "Grace Emenike",
    customerPhone: "+234 809 456 7890",
    cashierName: "Kemi Ogundimu",
    timestamp: "2024-01-18T09:20:00Z",
    status: "voided",
    voidReason: "Customer requested cancellation after payment",
    approvedBy: "Store Manager"
  }
];

export const returnedTransactions: Transaction[] = [
  {
    id: "TXN-005",
    items: [
      {
        product: {
          id: "6",
          name: "Oraimo FreePods 4",
          description: "Wireless earbuds with noise cancellation",
          price: 28000,
          imageUrl: "/placeholder.svg",
          barcode: "2345678901234",
          category: "Audio",
          stock: 25,
          status: "Inactive",
          createdAt: "2023-09-05",
        },
        quantity: 3
      }
    ],
    subtotal: 84000,
    totalDiscount: 8400,
    totalTax: 4536,
    total: 80136,
    paymentMethod: {
      id: "cash",
      name: "Cash",
      type: "cash",
      icon: "receipt"
    },
    customerName: "Yusuf Musa",
    customerPhone: "+234 805 345 6789",
    cashierName: "Fatima Ibrahim",
    timestamp: "2024-01-16T13:30:00Z",
    status: "returned",
    returnReason: "Defective products - customer complaint",
    approvedBy: "Store Manager"
  }
];
