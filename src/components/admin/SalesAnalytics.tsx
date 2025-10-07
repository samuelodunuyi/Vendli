import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreFilter } from "@/components/admin/StoreFilter";
import { StoreFilter as StoreFilterType } from "@/types/store";
import { SalesMetrics } from "@/components/admin/analytics/SalesMetrics";
import { FinancialMetrics } from "@/components/admin/analytics/FinancialMetrics";
import { InventoryMetrics } from "@/components/admin/analytics/InventoryMetrics";
import { SalesCharts } from "@/components/admin/analytics/SalesCharts";
import { FinancialCharts } from "@/components/admin/analytics/FinancialCharts";
import { InventoryCharts } from "@/components/admin/analytics/InventoryCharts";
import { SalesDetails } from "@/components/admin/analytics/SalesDetails";
import { FinancialSummary } from "@/components/admin/analytics/FinancialSummary";
import { 
  SalesData, 
  FinancialData, 
  InventoryStats, 
  ChartDataPoint,
  DailyReceiptsData,
  CashRemittanceData,
  TrendData,
  InventoryTrendData
} from "@/types/analytics";

export function SalesAnalytics() {
  const [filters, setFilters] = useState<StoreFilterType>({});

  // Mock data for demonstration
  const salesData: SalesData = {
    todaysSales: 450000,
    yesterdaysSales: 380000,
    weekSales: 2800000,
    monthSales: 12500000,
    totalOrders: 156,
    pendingOrders: 12,
    completedOrders: 144,
    averageOrderValue: 2885,
    topProducts: [
      { name: "Samsung Galaxy S23", sales: 25, revenue: 11250000 },
      { name: "Nike Air Max", sales: 18, revenue: 1170000 },
      { name: "Sony WH-1000XM4", sales: 12, revenue: 2160000 },
    ],
    recentTransactions: [
      { id: "TXN001", time: "14:30", amount: 450000, items: 1, method: "Card" },
      { id: "TXN002", time: "14:15", amount: 65000, items: 1, method: "Cash" },
      { id: "TXN003", time: "13:45", amount: 750000, items: 1, method: "Card" },
    ]
  };

  const inventoryStats: InventoryStats = {
    totalProducts: 125,
    lowStockItems: 8,
    outOfStock: 3,
    totalValue: 25000000,
  };

  const chartData: ChartDataPoint[] = [
    { name: "Mon", sales: 240000, orders: 24 },
    { name: "Tue", sales: 390000, orders: 35 },
    { name: "Wed", sales: 300000, orders: 28 },
    { name: "Thu", sales: 480000, orders: 42 },
    { name: "Fri", sales: 520000, orders: 48 },
    { name: "Sat", sales: 680000, orders: 65 },
    { name: "Sun", sales: 450000, orders: 38 },
  ];

  const categoryData = [
    { name: "Electronics", value: 45, color: "#3B82F6" },
    { name: "Footwear", value: 25, color: "#10B981" },
    { name: "Clothing", value: 20, color: "#F59E0B" },
    { name: "Audio", value: 10, color: "#EF4444" },
  ];

  const financialData: FinancialData = {
    revenue: 12500000,
    expenses: 8200000,
    profit: 4300000,
    taxes: 650000,
    cashFlow: 3650000,
    bankBalance: 15000000,
    accountsReceivable: 2400000,
    accountsPayable: 1800000,
  };

  const revenueSourcesData = [
    { name: "In-Store Sales", value: 60, amount: 7500000, color: "#3B82F6" },
    { name: "Online Sales", value: 30, amount: 3750000, color: "#10B981" },
    { name: "Wholesale", value: 10, amount: 1250000, color: "#F59E0B" },
  ];

  const dailyReceiptsData: DailyReceiptsData[] = [
    { date: "Mon", inStore: 450000, online: 280000, wholesale: 120000 },
    { date: "Tue", inStore: 520000, online: 320000, wholesale: 150000 },
    { date: "Wed", inStore: 380000, online: 290000, wholesale: 110000 },
    { date: "Thu", inStore: 600000, online: 380000, wholesale: 180000 },
    { date: "Fri", inStore: 720000, online: 420000, wholesale: 200000 },
    { date: "Sat", inStore: 850000, online: 480000, wholesale: 220000 },
    { date: "Sun", inStore: 680000, online: 350000, wholesale: 160000 },
  ];

  const cashRemittanceData: CashRemittanceData[] = [
    { store: "Victoria Island", pending: 1200000, completed: 8500000, failed: 50000 },
    { store: "Ikeja", pending: 800000, completed: 6200000, failed: 30000 },
    { store: "Lekki", pending: 600000, completed: 4800000, failed: 20000 },
  ];

  const trendData: TrendData[] = [
    { name: "Jan", revenue: 8500000, profit: 2550000, expenses: 5950000 },
    { name: "Feb", revenue: 9200000, profit: 2760000, expenses: 6440000 },
    { name: "Mar", revenue: 10800000, profit: 3240000, expenses: 7560000 },
    { name: "Apr", revenue: 11500000, profit: 3450000, expenses: 8050000 },
    { name: "May", revenue: 12500000, profit: 3750000, expenses: 8750000 },
    { name: "Jun", revenue: 13200000, profit: 3960000, expenses: 9240000 },
  ];

  const inventoryTrendData: InventoryTrendData[] = [
    { name: "Jan", totalValue: 22000000, turnover: 4.2, stockouts: 5 },
    { name: "Feb", totalValue: 23500000, turnover: 4.5, stockouts: 3 },
    { name: "Mar", totalValue: 25000000, turnover: 4.8, stockouts: 2 },
    { name: "Apr", totalValue: 24800000, turnover: 5.1, stockouts: 4 },
    { name: "May", totalValue: 25000000, turnover: 5.3, stockouts: 3 },
    { name: "Jun", totalValue: 26200000, turnover: 5.5, stockouts: 1 },
  ];

  return (
    <div className="space-y-6">
      <StoreFilter filters={filters} onFiltersChange={setFilters} />
      
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <SalesMetrics salesData={salesData} />
          <SalesCharts chartData={chartData} categoryData={categoryData} />
          <SalesDetails salesData={salesData} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <FinancialMetrics 
            financialData={financialData}
            dailyReceiptsData={dailyReceiptsData}
            cashRemittanceData={cashRemittanceData}
          />
          <FinancialCharts 
            revenueSourcesData={revenueSourcesData}
            dailyReceiptsData={dailyReceiptsData}
            trendData={trendData}
            cashRemittanceData={cashRemittanceData}
          />
          <FinancialSummary financialData={financialData} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <InventoryMetrics inventoryStats={inventoryStats} />
          <InventoryCharts inventoryTrendData={inventoryTrendData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
