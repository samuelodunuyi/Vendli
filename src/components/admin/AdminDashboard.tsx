import { useState } from "react";
import { Banknote, Package, ShoppingCart, Users } from "lucide-react";
import { DashboardHeader, type Period } from "./dashboard/DashboardHeader";
import { DashboardCharts } from "./dashboard/DashboardCharts";
import { DashboardTables } from "./dashboard/DashboardTables";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { PageLoader } from "@/components/common/PageLoader";
import { useGetStatisticsQuery } from "@/redux/services/stores.services";
import { formatCompactCurrency, formatNumber, percentChange } from "@/lib/format";

export function AdminDashboard() {
  const [period, setPeriod] = useState<Period>("month");
  const [storeId, setStoreId] = useState<number>();
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});

  const { data, isFetching, isError, refetch } = useGetStatisticsQuery({
    timeline: period,
    store: storeId,
    startDate: period === "custom" ? range.from?.toISOString() : undefined,
    endDate: period === "custom" ? range.to?.toISOString() : undefined,
  });

  return (
    <div className="space-y-6">
      <DashboardHeader period={period} onPeriodChange={setPeriod} storeId={storeId} onStoreChange={setStoreId} range={range} onRangeChange={setRange} />

      {isError ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          Couldn't load statistics. <button className="underline" onClick={refetch}>Try again</button>
        </div>
      ) : !data ? (
        <PageLoader className="min-h-[40vh]" />
      ) : (
        <div className={isFetching ? "space-y-6 opacity-60 transition-opacity" : "space-y-6"}>
          <StatGrid>
            <StatCard label="Revenue" value={formatCompactCurrency(data.totalSales)} icon={Banknote} change={percentChange(data.totalSales, data.totalSalesPrevious)} hint="vs previous period" />
            <StatCard label="Orders" value={formatNumber(data.totalOrders)} icon={ShoppingCart} hint={`${data.totalOfflineOrders} in-store`} />
            <StatCard label="Units sold" value={formatNumber(data.productsSold)} icon={Package} change={percentChange(data.totalProducts, data.totalProductsPrevious)} />
            <StatCard label="Active customers" value={formatNumber(data.activeCustomers)} icon={Users} hint={`${data.activeStores}/${data.totalStores} stores active`} />
          </StatGrid>

          <StatGrid className="lg:grid-cols-6">
            <StatCard label="Pending" value={data.pendingOrders} tone="warning" />
            <StatCard label="Confirmed" value={data.confirmedOrders} tone="info" />
            <StatCard label="Delivered" value={data.deliveredOrders} tone="success" />
            <StatCard label="Delayed" value={data.delayedOrders} tone="warning" />
            <StatCard label="Returned" value={data.returnedOrders} tone="danger" />
            <StatCard label="Cancelled" value={data.cancelledOrders} tone="danger" />
          </StatGrid>

          <DashboardCharts sales={data.salesChart} retention={data.retentionRate} />
          <DashboardTables stats={data} showStores={!storeId} />
        </div>
      )}
    </div>
  );
}
