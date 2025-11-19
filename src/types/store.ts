
export interface Store {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  email: string;
  status: boolean;
  openingDate: string;
  totalSales: number;
  monthlyRevenue: number;
}

export interface StoreFilter {
  storeId?: number;
  categoryId?: number;
  timeline?: "last7days" | "last30days" | "last90days" | "thisYear";
}

export interface RevenueSource {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface CashRemittance {
  id: string;
  storeId: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  bankAccount: string;
}
