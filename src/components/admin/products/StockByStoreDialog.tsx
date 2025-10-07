
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/types";
import { MapPin } from "lucide-react";

interface StockByStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

// Mock store data for demonstration
const mockStoreStock = [
  { storeCode: "MAIN", storeName: "Main Store - Lagos", stock: 12, reserved: 2, available: 10 },
  { storeCode: "ABJ", storeName: "Abuja Branch", stock: 8, reserved: 1, available: 7 },
  { storeCode: "PH", storeName: "Port Harcourt Branch", stock: 5, reserved: 0, available: 5 },
  { storeCode: "KAN", storeName: "Kano Branch", stock: 3, reserved: 1, available: 2 },
  { storeCode: "IBD", storeName: "Ibadan Branch", stock: 7, reserved: 0, available: 7 }
];

export function StockByStoreDialog({ open, onOpenChange, product }: StockByStoreDialogProps) {
  if (!product) return null;

  const totalStock = mockStoreStock.reduce((sum, store) => sum + store.stock, 0);
  const totalReserved = mockStoreStock.reduce((sum, store) => sum + store.reserved, 0);
  const totalAvailable = mockStoreStock.reduce((sum, store) => sum + store.available, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Stock Distribution - {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalStock}</div>
              <div className="text-sm text-gray-600">Total Stock</div>
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Code</TableHead>
                <TableHead>Store Name</TableHead>
                <TableHead className="text-right">Total Stock</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStoreStock.map((store) => (
                <TableRow key={store.storeCode}>
                  <TableCell className="font-medium">{store.storeCode}</TableCell>
                  <TableCell>{store.storeName}</TableCell>
                  <TableCell className="text-right">{store.stock}</TableCell>
                  <TableCell className="text-right">{store.reserved}</TableCell>
                  <TableCell className="text-right">{store.available}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      store.available > 5 ? 'bg-green-100 text-green-800' :
                      store.available > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {store.available > 5 ? 'In Stock' : store.available > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
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
