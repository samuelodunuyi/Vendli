
export interface Store {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  openingDate: string;
  totalSales: number;
  monthlyRevenue: number;
}

export interface StoreFilter {
  storeId?: string;
  productId?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
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
