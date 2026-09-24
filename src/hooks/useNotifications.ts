import { useMemo } from "react";
import { AlertTriangle, Clock, MessageSquareWarning, PackageX, type LucideIcon } from "lucide-react";
import { useGetInventoryProductsQuery } from "@/redux/services/products.services";
import { useGetOrdersQuery } from "@/redux/services/orders.services";
import { useGetComplaintsQuery } from "@/redux/services/customer.services";

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: LucideIcon;
  tone: string;
  href: string;
}

/** Builds actionable alerts from live data. The API already scopes it to the user's store. */
export function useNotifications(): Notification[] {
  const opts = { pollingInterval: 60_000 };
  const { data: stock } = useGetInventoryProductsQuery({ itemsPerPage: 500 }, opts);
  const { data: pending } = useGetOrdersQuery({ status: "0", itemsPerPage: 1 }, opts);
  const { data: complaints } = useGetComplaintsQuery({ status: "0", itemsPerPage: 1 }, opts);

  return useMemo(() => {
    const items: Notification[] = [];
    const out = stock?.items.filter((i) => i.stockStatus === "out of stock") ?? [];
    const low = stock?.items.filter((i) => i.stockStatus === "low stock") ?? [];
    if (out.length)
      items.push({ id: "out", title: `${out.length} item${out.length > 1 ? "s" : ""} out of stock`, message: out.slice(0, 3).map((i) => `${i.product.name} (${i.store.name})`).join(", "), icon: PackageX, tone: "text-red-600", href: "/admin/products" });
    if (low.length)
      items.push({ id: "low", title: `${low.length} item${low.length > 1 ? "s" : ""} running low`, message: low.slice(0, 3).map((i) => `${i.product.name} — ${i.quantity} left`).join(", "), icon: AlertTriangle, tone: "text-amber-600", href: "/admin/products" });
    const pendingCount = pending?.pagination.totalItems ?? 0;
    if (pendingCount)
      items.push({ id: "pending", title: `${pendingCount} order${pendingCount > 1 ? "s" : ""} awaiting confirmation`, message: "Confirm or update them from the Orders page.", icon: Clock, tone: "text-blue-600", href: "/admin/orders" });
    const openComplaints = complaints?.pagination.totalItems ?? 0;
    if (openComplaints)
      items.push({ id: "complaints", title: `${openComplaints} open complaint${openComplaints > 1 ? "s" : ""}`, message: "Customers are waiting for a response.", icon: MessageSquareWarning, tone: "text-violet-600", href: "/admin/customers" });
    return items;
  }, [stock, pending, complaints]);
}
