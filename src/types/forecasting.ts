
export interface SalesForecast {
  period: string;
  predictedSales: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RestockRecommendation {
  productId: string;
  productName: string;
  basestock: number;
  predictedDemand: number;
  recommendedOrder: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedStockoutDate: string;
}

export interface FraudAlert {
  id: string;
  type: 'high_refunds' | 'bulk_purchase' | 'unusual_pattern' | 'payment_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  transactionId?: string;
  customerId?: string;
  amount?: number;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
}

export interface VoiceCommand {
  id: string;
  command: string;
  response: string;
  timestamp: string;
  confidence: number;
}
