
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/redux/services/products.services";

interface RecentOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

// Mock order data
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    customer: "John Doe",
    customerPhone: "+234 801 234 5678",
    quantity: 2,
    unitPrice: 750000,
    total: 1500000,
    status: "Completed",
    paymentMethod: "Card"
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-14",
    customer: "Jane Smith",
    customerPhone: "+234 802 345 6789",
    quantity: 1,
    unitPrice: 750000,
    total: 750000,
    status: "Completed",
    paymentMethod: "Transfer"
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-12",
    customer: "Mike Johnson",
    customerPhone: "+234 803 456 7890",
    quantity: 1,
    unitPrice: 750000,
    total: 750000,
    status: "Pending",
    paymentMethod: "Cash"
  },
  {
    id: "ORD-2024-004",
    date: "2024-01-10",
    customer: "Sarah Wilson",
    customerPhone: "+234 804 567 8901",
    quantity: 3,
    unitPrice: 750000,
    total: 2250000,
    status: "Completed",
    paymentMethod: "Card"
  },
  {
    id: "ORD-2024-005",
    date: "2024-01-08",
    customer: "David Brown",
    customerPhone: "+234 805 678 9012",
    quantity: 1,
    unitPrice: 750000,
    total: 750000,
    status: "Cancelled",
    paymentMethod: "Transfer"
  }
];

export function RecentOrdersDialog({ open, onOpenChange, product }: RecentOrdersDialogProps) {
  if (!product) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalQuantity = mockOrders.reduce((sum, order) => sum + order.quantity, 0);
  const totalValue = mockOrders.filter(order => order.status === 'Completed').reduce((sum, order) => sum + order.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders - {product.productName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockOrders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalQuantity}</div>
              <div className="text-sm text-gray-600">Units Ordered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₦{totalValue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {mockOrders.filter(o => o.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.customerPhone}</TableCell>
                  <TableCell className="text-right">{order.quantity}</TableCell>
                  <TableCell className="text-right">₦{order.unitPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₦{order.total.toLocaleString()}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
