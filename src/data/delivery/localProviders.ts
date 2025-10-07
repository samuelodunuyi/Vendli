
import { DeliveryProvider } from "@/types/delivery";

export const localDeliveryProviders: DeliveryProvider[] = [
  {
    id: 'gig-logistics',
    name: 'GIG Logistics',
    type: 'local',
    logo: '/placeholder.svg',
    baseRate: 1500,
    isEnabled: true,
    apiConfig: {
      baseUrl: 'https://api.giglogistics.com',
      apiKey: 'gig_live_abc123xyz789',
      merchantId: 'MERCHANT_12345',
      webhookUrl: 'https://yourdomain.com/webhooks/gig',
      supportedServices: ['standard', 'express', 'same-day']
    },
    serviceAreas: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'],
    estimatedDeliveryTime: '1-3 days',
    trackingSupported: true,
    autoSubmissionEnabled: true,
    costOptimizationScore: 9.2,
    performanceMetrics: {
      onTimeDeliveryRate: 94.2,
      customerSatisfactionRate: 4.6,
      averageCost: 1850,
      totalDeliveries: 1247
    }
  },
  {
    id: 'red-star',
    name: 'Red Star Express',
    type: 'local',
    logo: '/placeholder.svg',
    baseRate: 2000,
    isEnabled: true,
    apiConfig: {
      baseUrl: 'https://api.redstarexpress.com.ng',
      apiKey: 'red_star_key_456def',
      merchantId: 'RSE_MERCHANT_67890',
      webhookUrl: 'https://yourdomain.com/webhooks/redstar',
      supportedServices: ['regular', 'priority', 'next-day']
    },
    serviceAreas: ['All Nigerian States'],
    estimatedDeliveryTime: '2-4 days',
    trackingSupported: true,
    autoSubmissionEnabled: true,
    costOptimizationScore: 8.7,
    performanceMetrics: {
      onTimeDeliveryRate: 89.8,
      customerSatisfactionRate: 4.3,
      averageCost: 2200,
      totalDeliveries: 892
    }
  },
  {
    id: 'jumia-logistics',
    name: 'Jumia Logistics',
    type: 'local',
    logo: '/placeholder.svg',
    baseRate: 1800,
    isEnabled: true,
    apiConfig: {
      baseUrl: 'https://logistics-api.jumia.com.ng',
      apiKey: 'jumia_logistics_789ghi',
      merchantId: 'JL_PARTNER_11223',
      webhookUrl: 'https://yourdomain.com/webhooks/jumia',
      supportedServices: ['standard', 'express']
    },
    serviceAreas: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Enugu', 'Benin'],
    estimatedDeliveryTime: '1-4 days',
    trackingSupported: true,
    autoSubmissionEnabled: false,
    costOptimizationScore: 8.9,
    performanceMetrics: {
      onTimeDeliveryRate: 91.5,
      customerSatisfactionRate: 4.4,
      averageCost: 1950,
      totalDeliveries: 673
    }
  },
  {
    id: 'kobo360',
    name: 'Kobo360',
    type: 'local',
    logo: '/placeholder.svg',
    baseRate: 1600,
    isEnabled: true,
    apiConfig: {
      baseUrl: 'https://api.kobo360.com',
      apiKey: 'kobo360_key_ghi789',
      merchantId: 'KOBO_MERCHANT_33445',
      webhookUrl: 'https://yourdomain.com/webhooks/kobo360',
      supportedServices: ['standard', 'bulk', 'fragile-handling']
    },
    serviceAreas: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'],
    estimatedDeliveryTime: '2-5 days',
    trackingSupported: true,
    autoSubmissionEnabled: true,
    costOptimizationScore: 8.4,
    performanceMetrics: {
      onTimeDeliveryRate: 87.3,
      customerSatisfactionRate: 4.2,
      averageCost: 1750,
      totalDeliveries: 445
    }
  }
];
