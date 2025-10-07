
import { Transaction } from "@/types";

export const sampleTransactions: Transaction[] = [
  {
    id: "TXN-001",
    items: [
      {
        product: {
          id: "1",
          name: "Samsung Galaxy S23",
          description: "Latest Samsung flagship smartphone",
          price: 450000,
          imageUrl: "/placeholder.svg",
          barcode: "8901234567890",
          category: "Electronics",
          stock: 15,
          status: "Active",
          createdAt: "2023-06-15",
        },
        quantity: 1
      }
    ],
    subtotal: 450000,
    totalDiscount: 0,
    totalTax: 27000,
    total: 477000,
    paymentMethod: {
      id: "card",
      name: "Debit/Credit Card",
      type: "card",
      icon: "credit-card"
    },
    customerName: "Adebayo Johnson",
    customerPhone: "+234 803 123 4567",
    cashierName: "Kemi Ogundimu",
    timestamp: "2024-01-18T10:30:00Z",
    status: "completed"
  },
  {
    id: "TXN-002",
    items: [
      {
        product: {
          id: "2",
          name: "Nike Air Max",
          description: "Comfortable running shoes",
          price: 65000,
          imageUrl: "/placeholder.svg",
          barcode: "6789012345678",
          category: "Footwear",
          stock: 23,
          status: "Active",
          createdAt: "2023-05-12",
        },
        quantity: 2
      },
      {
        product: {
          id: "5",
          name: "Adidas Tracksuit",
          description: "Comfortable tracksuit for sports",
          price: 35000,
          imageUrl: "/placeholder.svg",
          barcode: "3456789012345",
          category: "Clothing",
          stock: 30,
          status: "Active",
          createdAt: "2023-06-25",
        },
        quantity: 1,
        discount: {
          id: "DISC-001",
          type: "percentage",
          value: 10,
          description: "10% Staff Discount"
        }
      }
    ],
    subtotal: 165000,
    totalDiscount: 3500,
    totalTax: 9690,
    total: 171190,
    paymentMethod: {
      id: "cash",
      name: "Cash",
      type: "cash",
      icon: "receipt"
    },
    customerName: "Chioma Okwu",
    customerPhone: "+234 806 234 5678",
    cashierName: "Tope Adeyemi",
    timestamp: "2024-01-18T14:15:00Z",
    status: "completed"
  }
];
