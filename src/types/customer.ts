
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  classification: 'corporate' | 'walk-in' | 'regular' | 'vip';
  industryClass?: string;
  companyName?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  preferredStoreId: string;
  loyaltyProgram?: {
    memberId: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    points: number;
    joinDate: string;
  };
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycDocuments?: {
    type: string;
    documentNumber: string;
    expiryDate?: string;
  }[];
  lastTransactionDate?: string;
  totalSpent: number;
  averageOrderValue: number;
  transactionCount: number;
  preferredPaymentMethod?: string;
  marketingConsent: boolean;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CustomerComplaint {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  category: 'product' | 'service' | 'billing' | 'delivery' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolution?: string;
  satisfactionRating?: number;
  followUpRequired: boolean;
  callCenterTicketId?: string;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeCustomers: number;
  customerRetentionRate: number;
  averageLifetimeValue: number;
  topSpenders: Customer[];
  customersByClassification: Record<string, number>;
  customersByLoyaltyTier: Record<string, number>;
  complaintsThisMonth: number;
  resolvedComplaints: number;
  averageResolutionTime: number;
  customerSatisfactionScore: number;
}
