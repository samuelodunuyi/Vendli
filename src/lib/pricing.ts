export interface Discount {
  id: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
}

export const VAT_RATE = 0.075;

/** The only discounts a till may apply. The server re-applies these by id, so clients can't invent their own. */
export const DISCOUNTS: Discount[] = [
  { id: "staff-5", type: "percentage", value: 5, description: "5% Staff Discount" },
  { id: "loyalty-10", type: "percentage", value: 10, description: "10% Loyalty Discount" },
  { id: "bulk-1000", type: "fixed", value: 1000, description: "₦1,000 Bulk Purchase" },
  { id: "student-15", type: "percentage", value: 15, description: "15% Student Discount" },
];

export const findDiscount = (id?: string | null) => DISCOUNTS.find((d) => d.id === id);

/** Discount amount for a whole line, never more than the line itself. */
export const lineDiscount = (unitPrice: number, quantity: number, discount?: Discount) => {
  if (!discount) return 0;
  const gross = unitPrice * quantity;
  const off = discount.type === "percentage" ? (gross * discount.value) / 100 : discount.value;
  return Math.min(off, gross);
};

export function computeTotals(lines: { unitPrice: number; quantity: number; discount?: Discount }[]) {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const discount = lines.reduce((s, l) => s + lineDiscount(l.unitPrice, l.quantity, l.discount), 0);
  const tax = Math.round((subtotal - discount) * VAT_RATE);
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}
