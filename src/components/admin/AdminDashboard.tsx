import { useState } from "react";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardMetrics } from "./dashboard/DashboardMetrics";
import { DashboardCharts } from "./dashboard/DashboardCharts";
import { DashboardTables } from "./dashboard/DashboardTables";
import { useGetStatisticsQuery } from "@/redux/services/stores.services";
import { useAppSelector } from "@/redux/store";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const { data, isLoading, isError } = useGetStatisticsQuery({
    timeline: selectedPeriod,
    store: selectedStore,
    startDate: customDateRange.from?.toISOString(),
    endDate: customDateRange.to?.toISOString(),
  });

  const currentUser = useAppSelector((state) => state.auth.user);

  if (isLoading) return <p>Loading statistics...</p>;
  if (isError || !data) return <p>Failed to load statistics.</p>;

  const mappedSalesData = data.salesChart.labels.map((label, index) => ({
    labels: label,
    values: data.salesChart.values[index] ?? 0,
  }));

  const mappedTopCategories = data.topSellingCategories.map((cat) => ({
    name: cat.categoryName,
    sold: cat.totalSales,
  }));

  const RETENTION_COLORS = [
    "hsl(142, 70.6%, 45.3%)", 
    "hsl(271, 76%, 53%)" 
];

const mappedRetentionData = data.retentionRate.labels.map((label, index) => ({
    name: label,
    value: data.retentionRate.values[index] || 0, 
    color: RETENTION_COLORS[index] || '#ccc', 
}));
  const mappedTopProducts = data.topSellingProducts.map((prod) => ({
    name: prod.productName,
    sold: prod.totalSales,
  }));

  const mappedLowProducts = data.lowSellingProducts.map((prod) => ({
    name: prod.productName,
    sold: prod.totalSales,
  }));

const mappedTopStores = data.topPerformingStores.map((store) => ({
    name: store.storeName,
    sales: store.totalSales,
  }));

  const mappedTopCustomers = data.topCustomers.map((cust) => ({
    name: cust.userName,
    orders: cust.totalOrders,
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader
        currentUser={currentUser}
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        customDateRange={customDateRange}
        onCustomDateRangeChange={setCustomDateRange}
      />

      <DashboardMetrics
        metrics={{
          totalCustomers: data.activeCustomers,
          pendingOrders: data.pendingOrders,
          delayedOrders: data.delayedOrders,
          cancelledOrders: data.cancelledOrders,
          offlineOrders: data.totalOfflineOrders,
          confirmedOrders: data.confirmedOrders,
          deliveredOrders: data.deliveredOrders,
          returnedOrders:data.returnedOrders,
          totalOrders: data.totalOrders,
          totalProducts: data.totalProducts,
          totalSales: data.totalSales,
          totalStores: data.totalStores
        }}
      />

      <DashboardCharts salesData={mappedSalesData} retentionData={mappedRetentionData} />

      <DashboardTables
        topCategories={mappedTopCategories}
        topProducts={mappedTopProducts}
        lowProducts={mappedLowProducts}
        topStores={mappedTopStores}
        topCustomers={mappedTopCustomers}
      />
    </div>
  );
}
