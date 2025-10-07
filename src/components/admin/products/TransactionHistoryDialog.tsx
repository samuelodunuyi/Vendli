
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { History } from "lucide-react";

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

// Mock transaction data
const mockTransactions = [
  {
    id: "TXN-001",
    date: "2024-01-15",
    type: "Sale",
    quantity: -2,
    unitPrice: 750000,
    customer: "John Doe",
    reference: "INV-2024-001",
    store: "Main Store"
  },
  {
    id: "TXN-002",
    date: "2024-01-14",
    type: "Stock Adjustment",
    quantity: +5,
    unitPrice: 0,
    customer: "System",
    reference: "ADJ-2024-001",
    store: "Main Store"
  },
  {
    id: "TXN-003",
    date: "2024-01-12",
    type: "Purchase",
    quantity: +10,
    unitPrice: 650000,
    customer: "Supplier ABC",
    reference: "PO-2024-005",
    store: "Main Store"
  },
  {
    id: "TXN-004",
    date: "2024-01-10",
    type: "Transfer Out",
    quantity: -3,
    unitPrice: 0,
    customer: "Abuja Branch",
    reference: "TRN-2024-002",
    store: "Main Store"
  },
  {
    id: "TXN-005",
    date: "2024-01-08",
    type: "Sale",
    quantity: -1,
    unitPrice: 750000,
    customer: "Jane Smith",
    reference: "INV-2024-002",
    store: "Main Store"
  }
];

export function TransactionHistoryDialog({ open, onOpenChange, product }: TransactionHistoryDialogProps) {
  if (!product) return null;

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "Sale": return "bg-blue-100 text-blue-800";
      case "Purchase": return "bg-green-100 text-green-800";
      case "Stock Adjustment": return "bg-yellow-100 text-yellow-800";
      case "Transfer Out": return "bg-red-100 text-red-800";
      case "Transfer In": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History - {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Product Code:</span>
                <div className="font-medium">{product.barcode}</div>
              </div>
              <div>
                <span className="text-gray-600">Current Stock:</span>
                <div className="font-medium">{product.stock} units</div>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <div className="font-medium">{product.category}</div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                  {product.status}
                </Badge>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead>Customer/Supplier</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Store</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getTransactionTypeColor(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.unitPrice > 0 ? `₦${transaction.unitPrice.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell>{transaction.store}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
