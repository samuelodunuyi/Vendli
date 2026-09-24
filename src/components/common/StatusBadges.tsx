import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/enums";

export const OrderStatusBadge = ({ status }: { status: number }) => {
  const s = ORDER_STATUS[status] ?? { label: "Unknown", variant: "secondary" as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
};

export const PaymentStatusBadge = ({ status }: { status: number }) => {
  const s = PAYMENT_STATUS[status] ?? { label: "Unknown", variant: "secondary" as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
};
