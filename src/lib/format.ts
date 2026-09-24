const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number | null | undefined) => naira.format(value ?? 0);

export const formatCompactCurrency = (value: number | null | undefined) =>
  `₦${new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0)}`;

export const formatNumber = (value: number | null | undefined) =>
  new Intl.NumberFormat("en-NG").format(value ?? 0);

export const formatDate = (value: string | Date | null | undefined) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const formatDateTime = (value: string | Date | null | undefined) =>
  value
    ? new Date(value).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

export const fullName = (p?: { firstName?: string | null; lastName?: string | null } | null) =>
  [p?.firstName, p?.lastName].filter(Boolean).join(" ") || "—";

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "?";

export const percentChange = (current: number, previous: number) =>
  previous ? ((current - previous) / previous) * 100 : null;
