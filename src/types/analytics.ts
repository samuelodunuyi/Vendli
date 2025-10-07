
export interface SalesData {
  todaysSales: number;
  yesterdaysSales: number;
  weekSales: number;
  monthSales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentTransactions: Array<{
    id: string;
    time: string;
    amount: number;
    items: number;
    method: string;
  }>;
}

export interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  taxes: number;
  cashFlow: number;
  bankBalance: number;
  accountsReceivable: number;
  accountsPayable: number;
}

export interface InventoryStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStock: number;
  totalValue: number;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface DailyReceiptsData {
  date: string;
  inStore: number;
  online: number;
  wholesale: number;
}

export interface CashRemittanceData {
  store: string;
  pending: number;
  completed: number;
  failed: number;
}

export interface TrendData {
  name: string;
  revenue: number;
  profit: number;
  expenses: number;
}

export interface InventoryTrendData {
  name: string;
  totalValue: number;
  turnover: number;
  stockouts: number;
}
