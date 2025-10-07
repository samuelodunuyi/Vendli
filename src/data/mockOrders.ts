
import { Order } from "@/types/order";
import { baseOrders } from "./orders/baseOrders";
import { pendingOrders } from "./orders/pendingOrders";
import { processingOrders } from "./orders/processingOrders";
import { cancelledReturnedOrders } from "./orders/cancelledReturnedOrders";

export const mockOrders: Order[] = [
  ...baseOrders,
  ...pendingOrders,
  ...processingOrders,
  ...cancelledReturnedOrders
];
