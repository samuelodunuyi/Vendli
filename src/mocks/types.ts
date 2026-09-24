import type { UserRole } from "@/lib/roles";

export interface DbStore {
  storeId: number;
  storeName: string;
  storeAddress: string;
  storePhoneNumber: string;
  storeEmailAddress: string;
  storeType: string;
  isActive: boolean;
  userId: number | null;
  storeAdmin: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  phoneNumber: string;
  roleId: UserRole;
  storeId: number | null;
  isActive: boolean;
  joinedDate: string;
  createdAt: string;
}

export interface DbCategory {
  categoryId: number;
  categoryName: string;
  description: string;
  categoryIcon?: string;
  displayOrder?: number;
  storeId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbProduct {
  productId: number;
  productName: string;
  description: string;
  sku: string;
  barcode: string;
  categoryId: number;
  basePrice: number;
  costPrice: number;
  unitOfMeasure: string;
  imageUrl: string;
  showInWeb: boolean;
  showInPOS: boolean;
  isActive: boolean;
  minimumStockLevel: number;
  maximumStockLevel: number;
  warehouseStock: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export interface DbInventory {
  storeId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: number;
}

export interface DbCustomer {
  id: number;
  userId: number;
  loyaltyTier: number;
  kycStatus: number;
  loyaltyPoints: number;
  totalSpent: number;
  lastTransactionDate: string | null;
  customerClassification: number;
  companyName: string | null;
  industryClass: string | null;
  preferredStoreId: number | null;
  customerStatus: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbOrder {
  id: number;
  storeId: number;
  customerId: number | null;
  status: number;
  paymentOption: number;
  paymentStatus: number;
  orderType: number;
  transactionRef: string;
  createdBy: number;
  orderDate: string;
  lastUpdatedAt: string;
  estimatedDeliveryDate: string | null;
  rating: number | null;
  items: { productId: number; quantity: number; price: number }[];
}

export interface DbTransaction {
  id: number;
  type: number;
  storeId: number;
  productId: number;
  quantity: number;
  reference?: string;
  reason?: string;
  toStoreId?: number;
  createdBy: number;
  createdOn: string;
}

export interface DbLoyaltyActivity {
  id: number;
  customerId: number;
  orderId: number;
  pointsEarned: number;
  pointsRedeemed: number;
  createdAt: string;
}

export interface DbComplaint {
  id: number;
  title: string;
  complaintText: string;
  priority: number;
  status: number;
  customerId: number;
  storeId: number;
  assignedToUserId: number | null;
  dateClosed: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DbPromotion {
  id: number;
  title: string;
  description: string;
  discountType: number;
  discountValue: number;
  startDate: string;
  endDate: string;
  appliesToAllProducts: boolean;
  appliesToAllStores: boolean;
  applicableProductIds: number[] | null;
  applicableStoreIds: number[] | null;
  customCouponCode: string | null;
  isDeleted: boolean;
}

export interface Session {
  refreshToken: string;
  userId: number;
}

export interface Db {
  generatedAt: string;
  stores: DbStore[];
  users: DbUser[];
  categories: DbCategory[];
  products: DbProduct[];
  inventory: DbInventory[];
  customers: DbCustomer[];
  orders: DbOrder[];
  transactions: DbTransaction[];
  loyaltyActivity: DbLoyaltyActivity[];
  complaints: DbComplaint[];
  promotions: DbPromotion[];
  sessions: Session[];
}
