import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin } from "lucide-react";
import { Product, useGetInventoryProductsQuery } from "@/redux/services/products.services";

interface StockByStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function StockByStoreDialog({ open, onOpenChange, product }: StockByStoreDialogProps) {
  const { data, isLoading, isError } = useGetInventoryProductsQuery(
    {
      productId: product?.productId ?? 0,
      page: 1,
      itemsPerPage: 100,
    },
    { skip: !product }
  );

  if (!product) return null;

  const inventory = data?.items ?? [];

  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalReserved = 0; // adjust if you have reserved calculation
  const totalAvailable = totalStock - totalReserved;

  const getStockColor = (stock: number, minimum: number) =>
    stock <= minimum ? "text-red-600 font-semibold" : "text-green-600 font-semibold";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Stock Distribution - {product.productName}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="p-4 text-center text-sm text-gray-600">
            Loading stock...
          </div>
        )}

        {isError && (
          <div className="p-4 text-center text-red-600">
            Failed to load stock
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getStockColor(product.basestock ?? 0, product.minimumStockLevel ?? 0)}`}>
                  {product.basestock ?? 0}
                </div>
                <div className="text-sm text-gray-600">Product Base Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalStock}</div>
                <div className="text-sm text-gray-600">Total Stock Across Stores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalReserved}</div>
                <div className="text-sm text-gray-600">Reserved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalAvailable}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>

            {/* Table */}
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Store ID</TableHead>
      <TableHead>Store Name</TableHead>
      <TableHead className="text-center">Total Stock</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {inventory.map((item) => (
      <TableRow key={item.store.id}>
        <TableCell className="font-medium">{item.store.id}</TableCell>
        <TableCell>{item.store.name}</TableCell>
        <TableCell className="text-center">{item.quantity}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              item.stockStatus === "instock"
                ? "bg-green-100 text-green-800"
                : item.stockStatus === "low stock"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.stockStatus}
          </span>
        </TableCell>
      </TableRow>
    ))}

    {inventory.length === 0 && (
      <TableRow>
        <TableCell colSpan={4} className="text-center text-gray-500 py-4">
          No inventory records found for this product
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
