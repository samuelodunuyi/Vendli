
export interface DeliveryProvider {
  id: string;
  name: string;
  type: 'local' | 'international' | 'custom';
  logo: string;
  baseRate: number;
  isEnabled: boolean;
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    merchantId: string;
    webhookUrl: string;
    supportedServices: string[];
  };
  serviceAreas: string[];
  estimatedDeliveryTime: string;
  trackingSupported: boolean;
  autoSubmissionEnabled: boolean;
  costOptimizationScore: number;
  performanceMetrics: {
    onTimeDeliveryRate: number;
    customerSatisfactionRate: number;
    averageCost: number;
    totalDeliveries: number;
  };
}

export interface DeliveryOptimization {
  orderId: string;
  originalProvider: string;
  optimizedProvider: string;
  costSaving: number;
  reason: string;
}

export interface DeliveryServiceMetrics {
  totalActiveProviders: number;
  totalDeliveries: number;
  averageDeliveryCost: number;
  overallOnTimeRate: number;
  costSavingsThroughOptimization: number;
  topPerformingProvider: string;
  mostCostEffectiveProvider: string;
  recentOptimizations: DeliveryOptimization[];
}
