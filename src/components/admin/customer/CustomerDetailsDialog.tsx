import { Award, Mail, Phone, Store } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/StatCard";
import { OrderStatusBadge } from "@/components/common/StatusBadges";
import type { Customer } from "@/redux/services/customer.services";
import { useGetLoyaltyActivityQuery, useGetOrdersQuery } from "@/redux/services/orders.services";
import { CUSTOMER_CLASSIFICATION, CUSTOMER_STATUS, KYC_STATUS, LOYALTY_TIER, orderTotal } from "@/lib/enums";
import { formatCompactCurrency, formatCurrency, formatDate, formatNumber } from "@/lib/format";

interface CustomerDetailsDialogProps {
  customer: Customer | null;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailsDialog({ customer, onOpenChange }: CustomerDetailsDialogProps) {
  const skip = !customer;
  const { data: orders } = useGetOrdersQuery({ userId: String(customer?.userId), itemsPerPage: 8 }, { skip });
  const { data: loyalty } = useGetLoyaltyActivityQuery({ customer_id: customer?.userId }, { skip });
  if (!customer) return null;

  const u = customer.userInfo;
  const redeemed = loyalty?.reduce((s, a) => s + a.pointsRedeemed, 0) ?? 0;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{u.firstName} {u.lastName}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-1.5 pt-1">
            <Badge>{LOYALTY_TIER[customer.loyaltyTier]}</Badge>
            <Badge variant="outline">{CUSTOMER_CLASSIFICATION[customer.customerClassification]}</Badge>
            <Badge variant={customer.customerStatus === 1 ? "secondary" : "destructive"}>{CUSTOMER_STATUS[customer.customerStatus]}</Badge>
            <Badge variant="outline">KYC: {KYC_STATUS[customer.kycStatus]}</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 text-sm sm:grid-cols-3">
          {u.email && <p className="flex items-center gap-2 truncate"><Mail className="h-4 w-4 shrink-0 text-muted-foreground" />{u.email}</p>}
          {u.phoneNumber && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{u.phoneNumber}</p>}
          {customer.preferredStore && <p className="flex items-center gap-2"><Store className="h-4 w-4 text-muted-foreground" />{customer.preferredStore}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Lifetime spend" value={formatCompactCurrency(customer.totalSpent)} />
          <StatCard label="Orders" value={formatNumber(orders?.pagination.totalItems)} loading={!orders} />
          <StatCard label="Points balance" value={formatNumber(customer.loyaltyPoints)} icon={Award} />
          <StatCard label="Points redeemed" value={formatNumber(redeemed)} loading={!loyalty} />
        </div>

        {customer.companyName && (
          <p className="text-sm"><span className="text-muted-foreground">Company:</span> {customer.companyName}{customer.industryClass && ` · ${customer.industryClass}`}</p>
        )}
        {customer.notes && <p className="rounded-md bg-muted p-3 text-sm">{customer.notes}</p>}

        <div>
          <h3 className="mb-2 font-medium">Recent orders</h3>
          {!orders?.orders.length ? (
            <p className="text-sm text-muted-foreground">No orders yet. Customer since {formatDate(u.joinedDate)}.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {orders.orders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 p-3 text-sm">
                  <span className="font-medium">#{o.id}</span>
                  <span className="text-muted-foreground">{formatDate(o.orderDate)} · {o.store.storeName}</span>
                  <OrderStatusBadge status={o.status} />
                  <span className="ml-auto font-medium tabular-nums">{formatCurrency(orderTotal(o))}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
