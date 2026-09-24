import type { LucideIcon } from "lucide-react";
import { Package, Star, Store, TrendingDown, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Statistics } from "@/redux/services/stores.services";
import { formatCurrency, formatNumber } from "@/lib/format";

interface RankedListProps {
  title: string;
  icon: LucideIcon;
  rows: { key: string | number; label: string; value: string }[];
}

function RankedList({ title, icon: Icon, rows }: RankedListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-muted-foreground" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No data for this period.</p>
        ) : (
          <ol className="space-y-2.5">
            {rows.map((r, i) => (
              <li key={r.key} className="flex items-center gap-3 text-sm">
                <span className="w-4 text-muted-foreground tabular-nums">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate">{r.label}</span>
                <span className="font-medium tabular-nums">{r.value}</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardTables({ stats, showStores }: { stats: Statistics; showStores: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <RankedList title="Top categories" icon={Package} rows={stats.topSellingCategories.slice(0, 5).map((c) => ({ key: c.categoryId, label: c.categoryName, value: formatCurrency(c.totalAmount) }))} />
      <RankedList title="Best sellers" icon={Star} rows={stats.topSellingProducts.map((p) => ({ key: p.productId, label: p.productName, value: `${formatNumber(p.totalSales)} sold` }))} />
      <RankedList title="Slow movers" icon={TrendingDown} rows={stats.lowSellingProducts.map((p) => ({ key: p.productId, label: p.productName, value: `${formatNumber(p.totalSales)} sold` }))} />
      {showStores && stats.topPerformingStores.length > 1 && (
        <RankedList title="Store performance" icon={Store} rows={stats.topPerformingStores.map((s) => ({ key: s.storeId, label: s.storeName, value: formatCurrency(s.totalSales) }))} />
      )}
      <RankedList title="Top customers" icon={Users} rows={stats.topCustomers.map((c) => ({ key: c.userId, label: c.userName, value: formatCurrency(c.totalAmount) }))} />
    </div>
  );
}
