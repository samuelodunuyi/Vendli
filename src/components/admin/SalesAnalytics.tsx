import { useState } from "react";
import { AlertTriangle, Banknote, Boxes, PackageX, Receipt, ShoppingCart, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { PageLoader } from "@/components/common/PageLoader";
import { StoreFilter } from "@/components/admin/StoreFilter";
import { SalesCharts } from "@/components/admin/analytics/SalesCharts";
import { SalesDetails } from "@/components/admin/analytics/SalesDetails";
import { FinancialCharts } from "@/components/admin/analytics/FinancialCharts";
import { FinancialSummary } from "@/components/admin/analytics/FinancialSummary";
import { InventoryCharts } from "@/components/admin/analytics/InventoryCharts";
import { useGetSalesStatisticsQuery } from "@/redux/services/stores.services";
import type { StoreFilter as Filters } from "@/types/store";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/format";

export function SalesAnalytics() {
  const [filters, setFilters] = useState<Filters>({ timeline: "last30days" });
  const { data: stats, isFetching, isError } = useGetSalesStatisticsQuery({
    storeId: filters.storeId,
    categoryId: filters.categoryId,
    dateRangeTimeline: filters.timeline,
  });
  const cash = stats?.cashRemittanceByStore.reduce((s, r) => s + r.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <StoreFilter filters={filters} onFiltersChange={setFilters} />

      {isError ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">Couldn't load sales statistics.</p>
      ) : !stats ? (
        <PageLoader className="min-h-[40vh]" />
      ) : (
        <Tabs defaultValue="sales" className={isFetching ? "opacity-60 transition-opacity" : undefined}>
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <StatGrid>
              <StatCard label="Revenue" value={formatCompactCurrency(stats.totalSales)} icon={Banknote} />
              <StatCard label="Orders" value={formatNumber(stats.totalOrders)} icon={ShoppingCart} />
              <StatCard label="Avg. order value" value={formatCurrency(stats.averageOrderValue)} icon={Receipt} />
              <StatCard label="Catalogue size" value={formatNumber(stats.totalProducts)} icon={Boxes} hint="products" />
            </StatGrid>
            <SalesCharts stats={stats} />
            <SalesDetails stats={stats} />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <StatGrid>
              <StatCard label="Revenue" value={formatCompactCurrency(stats.totalSales)} icon={Banknote} />
              <StatCard label="Avg. order value" value={formatCurrency(stats.averageOrderValue)} icon={Receipt} />
              <StatCard label="Cash to remit" value={formatCompactCurrency(cash)} icon={Wallet} tone="warning" hint="cash sales" />
              <StatCard label="Stock at cost" value={formatCompactCurrency(stats.inventoryValue)} icon={Boxes} />
            </StatGrid>
            <FinancialCharts stats={stats} />
            <FinancialSummary stats={stats} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <StatGrid>
              <StatCard label="Products" value={formatNumber(stats.totalProducts)} icon={Boxes} />
              <StatCard label="Low stock" value={formatNumber(stats.lowStockProducts)} icon={AlertTriangle} tone="warning" />
              <StatCard label="Out of stock" value={formatNumber(stats.outOfStockProducts)} icon={PackageX} tone="danger" />
              <StatCard label="Stock at cost" value={formatCompactCurrency(stats.inventoryValue)} icon={Wallet} />
            </StatGrid>
            <InventoryCharts stats={stats} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
