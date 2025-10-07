
export interface BusinessCentralConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  companyId: string;
  environment: 'sandbox' | 'production';
}

export interface SyncStatus {
  lastSync: string;
  status: 'success' | 'error' | 'pending' | 'never';
  message?: string;
  recordsAffected?: number;
}

export interface BusinessCentralItem {
  id: string;
  number: string;
  displayName: string;
  type: string;
  baseUnitOfMeasure: string;
  unitPrice: number;
  inventory: number;
  lastModifiedDateTime: string;
}

export interface BusinessCentralSalesOrder {
  id: string;
  number: string;
  orderDate: string;
  customerNumber: string;
  customerName: string;
  totalAmountExcludingTax: number;
  totalAmountIncludingTax: number;
  status: string;
}

export interface BusinessCentralInvoice {
  id: string;
  number: string;
  invoiceDate: string;
  customerNumber: string;
  customerName: string;
  totalAmountExcludingTax: number;
  totalAmountIncludingTax: number;
  status: string;
}

export interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  syncInventory: boolean;
  syncSalesOrders: boolean;
  syncInvoices: boolean;
  syncReceipts: boolean;
  syncBankDeposits: boolean;
}
