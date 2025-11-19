import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/redux/services/products.services";
import { useGetOrdersQuery } from "@/redux/services/orders.services";

interface RecentOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function RecentOrdersDialog({
  open,
  onOpenChange,
  product
}: RecentOrdersDialogProps) {
  const { data, isLoading, isError } = useGetOrdersQuery(
    {
      productId: product?.productId ?? undefined,
      page: 1,
      itemsPerPage: 100
    },
    { skip: !product }
  );

  if (!product) return null;

  const orders = data?.orders ?? [];

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "bg-blue-100 text-blue-800";
      case 2:
        return "bg-green-100 text-green-800";
      case 3:
        return "bg-yellow-100 text-yellow-800";
      case 4:
        return "bg-purple-100 text-purple-800";
      case 5:
        return "bg-red-100 text-red-800";
      case 6:
        return "bg-gray-100 text-gray-800";
      case 7:
        return "bg-red-200 text-red-900"; 
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calcOrderTotal = (order) => {
    const items = Array.isArray(order.orderItems) ? order.orderItems : [];
    return items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.priceAtOrder) || 0;
      const line = qty * price;
      return sum + (Number.isFinite(line) ? line : 0);
    }, 0);
  };

  // Sum of all orders
  const totalValueAll = orders.reduce((sum, o) => sum + calcOrderTotal(o), 0);

  // Sum of completed + delivered
  const totalValueCompleted = orders.reduce((sum, o) => {
    return o.status === 2 || o.status === 4
      ? sum + calcOrderTotal(o)
      : sum;
  }, 0);

  const totalQuantity = orders.reduce((sum, o) => {
    const items = Array.isArray(o.orderItems) ? o.orderItems : [];
    return (
      sum +
      items.reduce((x, i) => x + (Number(i.quantity) || 0), 0)
    );
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders — {product.productName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalQuantity}
              </div>
              <div className="text-sm text-gray-600">Units Ordered</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ₦{totalValueCompleted.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Completed & Delivered Value
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ₦{totalValueAll.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Value (All)</div>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => {
                const itemCount = order.orderItems?.reduce(
                  (sum: number, x) => sum + (Number(x.quantity) || 0),
                  0
                );

                const orderTotal = calcOrderTotal(order);

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">ORD - {order.id}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {order?.customer?.firstName} {order?.customer?.lastName}
                    </TableCell>

                    <TableCell>{order?.customer?.phoneNumber ?? "-"}</TableCell>

                    <TableCell className="text-right">{itemCount}</TableCell>

                    <TableCell className="text-right">
                      ₦{orderTotal?.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {order.paymentOption === 1
                        ? "Card"
                        : order.paymentOption === 2
                        ? "Transfer"
                        : "Cash"}
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {[
                          "Pending",
                          "Confirmed",
                          "Completed",
                          "Awaiting Delivery",
                          "Delivered",
                          "Failed",
                          "Returned",
                          "Cancelled"
                        ][order.status] ?? "Unknown"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
