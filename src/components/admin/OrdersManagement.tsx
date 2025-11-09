import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EnhancedOrderDialog } from "./orders/EnhancedOrderDialog";
import { EnhancedOrderDetails } from "./orders/EnhancedOrderDetails";
import { DeliveryTrackingDialog } from "./orders/DeliveryTrackingDialog";
import { OrdersStats } from "./orders/OrdersStats";
import { OrdersFilters } from "./orders/OrdersFilters";
import { OrdersTable } from "./orders/OrdersTable";
import { Order, useGetOrdersQuery } from "@/redux/services/orders.services";

export function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<number>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showEnhancedDialog, setShowEnhancedDialog] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDeliveryTracking, setShowDeliveryTracking] = useState(false);
  const { data: ordersData, isLoading } = useGetOrdersQuery({});
  const orders = ordersData?.orders ?? [];
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery.toLowerCase()) ||
      order.customer.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.customer.lastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.customer.phoneNumber.includes(searchQuery);
    const matchesStatus =
      statusFilter === null || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders?.length,
    pending: orders?.filter((o) => o.status === 0).length,
    processing: orders?.filter((o) => o.status === 1).length,
    completed: orders?.filter((o) => o.status === 2).length,
    cancelled: orders?.filter((o) => o.status === 7).length,
    totalRevenue: orders
      ?.filter((o) => o.status === 4) // delivered orders
      .reduce((sum, o) => {
        const orderTotal = o.orderItems?.reduce(
          (itemSum, item) => itemSum + item.priceAtOrder * item.quantity,
          0
        );
        return sum + orderTotal;
      }, 0),
    // avgRating: orders.filter(o => o.feedbackRating).reduce((sum, o) => sum + (o.feedbackRating || 0), 0) / orders.filter(o => o.feedbackRating).length || 0
    avgRating: 0,
  };

  const handleViewEnhancedOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowEnhancedDialog(true);
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleViewDeliveryTracking = (order: Order) => {
    setSelectedOrder(order);
    setShowDeliveryTracking(true);
  };

  return (
    <div className="space-y-6">
      <OrdersStats orderStats={orderStats} />

      <OrdersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <OrdersTable
        orders={filteredOrders}
        onViewOrderDetails={handleViewOrderDetails}
        onViewEnhancedOrder={handleViewEnhancedOrder}
        onViewDeliveryTracking={handleViewDeliveryTracking}
      />

      <EnhancedOrderDialog
        open={showEnhancedDialog}
        onOpenChange={setShowEnhancedDialog}
        order={selectedOrder}
      />

      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && <EnhancedOrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>

      <DeliveryTrackingDialog
        open={showDeliveryTracking}
        onOpenChange={setShowDeliveryTracking}
        orderId={selectedOrder?.id || null}
        // deliveryTracking={selectedOrder?.deliveryTracking}
      />
    </div>
  );
}
