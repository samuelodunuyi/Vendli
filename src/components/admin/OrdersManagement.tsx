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
  const orderTiles = ordersData?.tiles;
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
    total: ordersData?.pagination.totalItems || 0,
    pending: orderTiles?.delivered,
    completed: orderTiles?.completed,
    cancelled: orderTiles?.cancelled,
    totalRevenue: orders
      ?.filter((o) => o.status === 4) 
      .reduce((sum, o) => {
        const orderTotal = o.orderItems?.reduce(
          (itemSum, item) => itemSum + item.priceAtOrder * item.quantity,
          0
        );
        return sum + orderTotal;
      }, 0),
    avgRating: orderTiles?.averageRating ?? 0,
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
