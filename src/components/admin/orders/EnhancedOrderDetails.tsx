
import { OrderHeader } from "./cards/OrderHeader";
import { CustomerInfoCard } from "./cards/CustomerInfoCard";
import { StoreStaffCard } from "./cards/StoreStaffCard";
import { PaymentInfoCard } from "./cards/PaymentInfoCard";
import { DeliveryInfoCard } from "./cards/DeliveryInfoCard";
import { OrderItemsCard } from "./cards/OrderItemsCard";
import { OrderTimelineCard } from "./cards/OrderTimelineCard";
import { OrderNotesCard } from "./cards/OrderNotesCard";
import { Order } from "@/redux/services/orders.services";

interface EnhancedOrderDetailsProps {
  order: Order;
}

export function EnhancedOrderDetails({ order }: EnhancedOrderDetailsProps) {
  return (
    <div className="space-y-6">
      <OrderHeader order={order}  />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CustomerInfoCard order={order} />
        <StoreStaffCard order={order} />
        <PaymentInfoCard order={order} />
      </div>

      <OrderItemsCard order={order} />
      <OrderTimelineCard order={order} />
      <OrderNotesCard order={order} />
    </div>
  );
}
