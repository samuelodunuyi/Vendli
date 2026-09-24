type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const ORDER_STATUS: Record<number, { label: string; variant: BadgeVariant }> = {
  0: { label: "Pending", variant: "secondary" },
  1: { label: "Confirmed", variant: "default" },
  2: { label: "Completed", variant: "default" },
  3: { label: "Awaiting Delivery", variant: "outline" },
  4: { label: "Delivered", variant: "default" },
  5: { label: "Failed", variant: "destructive" },
  6: { label: "Returned", variant: "destructive" },
  7: { label: "Cancelled", variant: "destructive" },
};

export const PAYMENT_STATUS: Record<number, { label: string; variant: BadgeVariant }> = {
  0: { label: "Pending", variant: "secondary" },
  1: { label: "Paid", variant: "default" },
  2: { label: "Failed", variant: "destructive" },
  3: { label: "Refunded", variant: "outline" },
  4: { label: "Partial", variant: "secondary" },
};

export const PAYMENT_OPTION: Record<number, string> = {
  0: "Cash",
  1: "Card",
  2: "Bank Transfer",
};

export const ORDER_TYPE: Record<number, string> = {
  0: "Online",
  1: "In-store",
};

export const LOYALTY_TIER = ["Bronze", "Silver", "Gold", "Platinum"] as const;
export const CUSTOMER_CLASSIFICATION = ["Corporate", "VIP", "Regular", "Walk-in"] as const;
export const CUSTOMER_STATUS = ["Inactive", "Active", "Suspended"] as const;
export const KYC_STATUS = ["Pending", "Verified", "Rejected"] as const;

export const COMPLAINT_PRIORITY = ["Low", "Medium", "High", "Critical"] as const;
export const COMPLAINT_STATUS = ["Open", "In Progress", "Resolved", "Closed"] as const;

export const INVENTORY_TX_TYPE = ["Stock In", "Stock Out", "Adjustment", "Transfer"] as const;

export const orderTotal = (order: { orderItems?: { priceAtOrder: number; quantity: number }[] }) =>
  (order.orderItems ?? []).reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);
