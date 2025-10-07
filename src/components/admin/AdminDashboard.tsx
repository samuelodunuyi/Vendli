
import { useState } from "react";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardMetrics } from "./dashboard/DashboardMetrics";
import { DashboardCharts } from "./dashboard/DashboardCharts";
import { DashboardTables } from "./dashboard/DashboardTables";

interface DashboardMetrics {
  totalSales: number;
  totalStores: number;
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  delayedOrders: number;
  cancelledOrders: number;
  offlineOrders: number;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Mock data for different time periods
const mockMetrics: Record<string, DashboardMetrics> = {
  today: {
    totalSales: 2400000,
    totalStores: 8,
    totalProducts: 145,
    totalCustomers: 89,
    totalOrders: 47,
    pendingOrders: 8,
    confirmedOrders: 12,
    deliveredOrders: 20,
    returnedOrders: 3,
    delayedOrders: 2,
    cancelledOrders: 1,
    offlineOrders: 1
  },
  week: {
    totalSales: 12400000,
    totalStores: 10,
    totalProducts: 892,
    totalCustomers: 456,
    totalOrders: 247,
    pendingOrders: 33,
    confirmedOrders: 25,
    deliveredOrders: 41,
    returnedOrders: 33,
    delayedOrders: 25,
    cancelledOrders: 7,
    offlineOrders: 23
  },
  month: {
    totalSales: 48500000,
    totalStores: 10,
    totalProducts: 2724,
    totalCustomers: 1527,
    totalOrders: 956,
    pendingOrders: 89,
    confirmedOrders: 102,
    deliveredOrders: 187,
    returnedOrders: 65,
    delayedOrders: 43,
    cancelledOrders: 28,
    offlineOrders: 89
  },
  year: {
    totalSales: 485000000,
    totalStores: 10,
    totalProducts: 15480,
    totalCustomers: 8945,
    totalOrders: 5847,
    pendingOrders: 234,
    confirmedOrders: 456,
    deliveredOrders: 987,
    returnedOrders: 287,
    delayedOrders: 189,
    cancelledOrders: 156,
    offlineOrders: 432
  },
  custom: {
    totalSales: 25600000,
    totalStores: 9,
    totalProducts: 1845,
    totalCustomers: 987,
    totalOrders: 456,
    pendingOrders: 45,
    confirmedOrders: 67,
    deliveredOrders: 123,
    returnedOrders: 34,
    delayedOrders: 23,
    cancelledOrders: 12,
    offlineOrders: 45
  }
};

export function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedStore, setSelectedStore] = useState("All Stores");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });
  
  // Mock user data - in real app this would come from auth context
  const currentUser = {
    firstName: "Tunde",
    lastName: "Adebayo"
  };

  const currentMetrics = mockMetrics[selectedPeriod];

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

      <DashboardMetrics metrics={currentMetrics} />

      <DashboardCharts />

      <DashboardTables />
    </div>
  );
}
