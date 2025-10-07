
import { DeliveryProvider } from "@/types/delivery";

export const internationalDeliveryProviders: DeliveryProvider[] = [
  {
    id: 'dhl',
    name: 'DHL Express',
    type: 'international',
    logo: '/placeholder.svg',
    baseRate: 8500,
    isEnabled: true,
    apiConfig: {
      baseUrl: 'https://api.dhl.com',
      apiKey: 'dhl_express_abc123',
      merchantId: 'DHL_ACCOUNT_98765',
      webhookUrl: 'https://yourdomain.com/webhooks/dhl',
      supportedServices: ['worldwide-express', 'domestic-express', 'same-day']
    },
    serviceAreas: ['Global', 'Nigeria Domestic'],
    estimatedDeliveryTime: '1-2 days domestic, 3-5 days international',
    trackingSupported: true,
    autoSubmissionEnabled: true,
    costOptimizationScore: 7.8,
    performanceMetrics: {
      onTimeDeliveryRate: 96.8,
      customerSatisfactionRate: 4.8,
      averageCost: 9200,
      totalDeliveries: 234
    }
  },
  {
    id: 'fedex',
    name: 'FedEx',
    type: 'international',
    logo: '/placeholder.svg',
    baseRate: 9200,
    isEnabled: false,
    apiConfig: {
      baseUrl: 'https://api.fedex.com',
      apiKey: 'fedex_api_key_def456',
      merchantId: 'FEDEX_ACCOUNT_54321',
      webhookUrl: 'https://yourdomain.com/webhooks/fedex',
      supportedServices: ['priority-overnight', 'standard-overnight', 'international-economy']
    },
    serviceAreas: ['Global', 'Nigeria Major Cities'],
    estimatedDeliveryTime: '1-3 days domestic, 2-7 days international',
    trackingSupported: true,
    autoSubmissionEnabled: false,
    costOptimizationScore: 7.5,
    performanceMetrics: {
      onTimeDeliveryRate: 95.2,
      customerSatisfactionRate: 4.7,
      averageCost: 9800,
      totalDeliveries: 156
    }
  }
];
