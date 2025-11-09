import { Discount, Tax, PaymentMethod } from "@/types";

// Discounts
export const discounts: Discount[] = [
  { id: "1", type: "percentage", value: 5, description: "5% Staff Discount" },
  { id: "2", type: "percentage", value: 10, description: "10% Loyalty Discount" },
  { id: "3", type: "fixed", value: 1000, description: "₦1,000 Bulk Purchase" },
  { id: "4", type: "percentage", value: 15, description: "15% Student Discount" },
];

// Taxes
export const taxes: Tax[] = [
  { id: "1", name: "VAT", rate: 7.5, description: "Value Added Tax" },
  { id: "2", name: "Service Tax", rate: 2.5, description: "Service Tax" },
];

// Payment Methods (using enum for type safety)
export const paymentMethods: { label: string; value: PaymentMethod }[] = [
  { label: "Cash", value: PaymentMethod.PAYMENT_CASH },
  { label: "Card Payment", value: PaymentMethod.PAYMENT_CARD },
  { label: "Bank Transfer", value: PaymentMethod.PAYMENT_BANK_TRANSFER },
];
