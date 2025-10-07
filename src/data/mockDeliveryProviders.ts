
import { DeliveryProvider } from "@/types/delivery";
import { localDeliveryProviders } from "./delivery/localProviders";
import { internationalDeliveryProviders } from "./delivery/internationalProviders";
import { customDeliveryProviders } from "./delivery/customProviders";

export { deliveryServiceMetrics } from "./delivery/deliveryMetrics";
export type { DeliveryProvider, DeliveryServiceMetrics, DeliveryOptimization } from "@/types/delivery";

export const mockDeliveryProviders: DeliveryProvider[] = [
  ...localDeliveryProviders,
  ...internationalDeliveryProviders,
  ...customDeliveryProviders
];
