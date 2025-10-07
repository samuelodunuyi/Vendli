
import { DeliveryProvider } from "@/types/delivery";

export const customDeliveryProviders: DeliveryProvider[] = [
  {
    id: 'custom-api',
    name: 'Custom API Provider',
    type: 'custom',
    logo: '/placeholder.svg',
    baseRate: 0,
    isEnabled: false,
    apiConfig: {
      baseUrl: '',
      apiKey: '',
      merchantId: '',
      webhookUrl: '',
      supportedServices: []
    },
    serviceAreas: [],
    estimatedDeliveryTime: 'Configurable',
    trackingSupported: false,
    autoSubmissionEnabled: false,
    costOptimizationScore: 0,
    performanceMetrics: {
      onTimeDeliveryRate: 0,
      customerSatisfactionRate: 0,
      averageCost: 0,
      totalDeliveries: 0
    }
  }
];
