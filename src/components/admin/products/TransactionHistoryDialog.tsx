import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { Product, useGetInventoryTransactionsQuery } from "@/redux/services/products.services";

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function TransactionHistoryDialog({ open, onOpenChange, product }: TransactionHistoryDialogProps) {
  const { data, isLoading, isError } = useGetInventoryTransactionsQuery(
    { productId: product?.productId, page: 1, itemsPerPage: 100 },
    { skip: !product }
  );

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
            Transaction History - {product.productName}
          </DialogTitle>
        </DialogHeader>

        {/* Product Summary */}
        <div className="p-4 bg-gray-50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Product Code:</span>
            <div className="font-medium">{product.productId}</div>
          </div>
          <div>
            <span className="text-gray-600">Current Stock:</span>
            <div className="font-medium">{product.basestock} units</div>
          </div>
          <div>
            <span className="text-gray-600">Category:</span>
            <div className="font-medium">{product.categoryId}</div>
          </div>
          <div>
            <span className="text-gray-600">Status: </span>
            <Badge variant={product.isActive ? "default" : "secondary"}>
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="mt-4 space-y-4">
          {isLoading && <div className="p-4 text-center text-gray-600">Loading transactions...</div>}
          {isError && <div className="p-4 text-center text-red-600">Failed to load transactions</div>}

          {!isLoading && !isError && data?.items && data.items.length > 0 && (
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
                {data.items.map(txn => (
                  <TableRow key={txn.id}>
                    <TableCell>{new Date(txn.createdOn).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getTransactionTypeColor(txn.type)}>
                        {txn.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${txn.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                      {txn.quantity > 0 ? "+" : ""}{txn.quantity}
                    </TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell>{txn.createdBy?.username || "-"}</TableCell>
                    <TableCell>{txn.reference || txn.reason || "-"}</TableCell>
                    <TableCell>{txn.store.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && !isError && (!data?.items || data.items.length === 0) && (
            <div className="p-4 text-center text-gray-500">No transactions found for this product.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
