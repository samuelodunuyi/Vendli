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
  const [selectedStore, setSelectedStore] = useState("");
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

  // ✅ Map API data to the shapes expected by DashboardTables
  const mappedSalesData = data.salesChart.labels.map((label, index) => ({
    labels: label,
    values: data.salesChart.values[index] ?? 0,
  }));

  const mappedTopCategories = data.topSellingCategories.map((cat) => ({
    name: cat.categoryName,
    sold: cat.totalSales,
  }));

  const mappedTopProducts = data.topSellingProducts.map((prod) => ({
    name: prod.productName,
    sold: prod.totalSales,
  }));

  const mappedLowProducts = data.lowSellingProducts.map((prod) => ({
    name: prod.productName,
    sold: prod.totalSales,
  }));

  const mappedTopStores = data.totalStores // Not available? Assume topStores comes from API differently
    ? [] // or map if you have API field
    : [];

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
          totalCustomers: data.topCustomers.length,
          pendingOrders: data.confirmedOrders,
          delayedOrders: data.failedOrders,
          cancelledOrders: data.returnedOrders,
          offlineOrders: data.totalOfflineOrders,
          confirmedOrders: 0,
          deliveredOrders: 0,
          returnedOrders:0,
          totalOrders: 0,
          totalProducts: 0,
          totalSales: 0,
          totalStores: 0
        }}
      />

      <DashboardCharts salesData={mappedSalesData} retentionData={[]} />

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
