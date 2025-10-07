
import { DeliveryServiceMetrics } from "@/types/delivery";

export const deliveryServiceMetrics: DeliveryServiceMetrics = {
  totalActiveProviders: 5,
  totalDeliveries: 3647,
  averageDeliveryCost: 2150,
  overallOnTimeRate: 92.4,
  costSavingsThroughOptimization: 18500,
  topPerformingProvider: 'DHL Express',
  mostCostEffectiveProvider: 'GIG Logistics',
  recentOptimizations: [
    {
      orderId: 'ORD-2024-001',
      originalProvider: 'Red Star Express',
      optimizedProvider: 'GIG Logistics',
      costSaving: 500,
      reason: 'Lower cost for same-city delivery'
    },
    {
      orderId: 'ORD-2024-002',
      originalProvider: 'DHL Express',
      optimizedProvider: 'Red Star Express',
      costSaving: 6500,
      reason: 'Domestic delivery more cost-effective'
    }
  ]
};
