
import { Transaction } from "@/types";

export const highValueTransactions: Transaction[] = [
  {
    id: "TXN-003",
    items: [
      {
        product: {
          id: "3",
          name: "Dell XPS 13 Laptop",
          description: "Powerful laptop with Intel processor",
          price: 750000,
          imageUrl: "/placeholder.svg",
          barcode: "5678901234567",
          category: "Electronics",
          stock: 8,
          status: "Active",
          createdAt: "2023-07-02",
        },
        quantity: 1
      }
    ],
    subtotal: 750000,
    totalDiscount: 0,
    totalTax: 45000,
    total: 795000,
    paymentMethod: {
      id: "transfer",
      name: "Bank Transfer",
      type: "transfer",
      icon: "credit-card"
    },
    customerName: "Emeka Okafor",
    customerPhone: "+234 812 567 8901",
    cashierName: "Ibrahim Sani",
    timestamp: "2024-01-17T16:45:00Z",
    status: "completed"
  }
];
