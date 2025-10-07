
import { Discount, Tax, PaymentMethod } from "@/types";

export const discounts: Discount[] = [
  {
    id: "1",
    type: "percentage",
    value: 5,
    description: "5% Staff Discount"
  },
  {
    id: "2",
    type: "percentage",
    value: 10,
    description: "10% Loyalty Discount"
  },
  {
    id: "3",
    type: "fixed",
    value: 1000,
    description: "₦1,000 Bulk Purchase"
  },
  {
    id: "4",
    type: "percentage",
    value: 15,
    description: "15% Student Discount"
  }
];

export const taxes: Tax[] = [
  {
    id: "1",
    name: "VAT",
    rate: 7.5,
    description: "Value Added Tax"
  },
  {
    id: "2",
    name: "Service Tax",
    rate: 2.5,
    description: "Service Tax"
  }
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    name: "Card Payment",
    type: "card",
    icon: "credit-card"
  },
  {
    id: "2",
    name: "Bank Transfer",
    type: "transfer",
    icon: "receipt"
  },
  {
    id: "3",
    name: "Cash",
    type: "cash",
    icon: "cash"
  },
  {
    id: "4",
    name: "Mobile Wallet",
    type: "wallet",
    icon: "credit-card"
  }
];
