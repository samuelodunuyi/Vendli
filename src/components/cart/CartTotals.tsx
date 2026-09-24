import { Separator } from "@/components/ui/separator";
import { VAT_RATE } from "@/lib/pricing";
import { formatCurrency } from "@/lib/format";

interface CartTotalsProps {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export function CartTotals({ subtotal, discount, tax, total }: CartTotalsProps) {
  return (
    <dl className="space-y-1.5 text-sm">
      <Row label="Subtotal" value={formatCurrency(subtotal)} />
      {discount > 0 && <Row label="Discounts" value={`−${formatCurrency(discount)}`} className="text-emerald-600" />}
      <Row label={`VAT (${VAT_RATE * 100}%)`} value={formatCurrency(tax)} className="text-muted-foreground" />
      <Separator className="my-2" />
      <Row label="Total" value={formatCurrency(total)} className="text-lg font-bold" />
    </dl>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex justify-between ${className ?? ""}`}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
