
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { Product } from "@/redux/services/products.services";

interface ProductsLowStockAlertProps {
  lowStockProducts: Product[];
}

export function ProductsLowStockAlert({ lowStockProducts }: ProductsLowStockAlertProps) {
  if (lowStockProducts?.length === 0) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Low Stock Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lowStockProducts?.slice(0, 3).map(product => (
            <div key={product.productId} className="flex justify-between items-center">
              <span className="text-red-700">{product.productName}</span>
              <Badge variant="destructive">{product.basestock } left</Badge>
            </div>
          ))}
          {lowStockProducts?.length > 3 && (
            <p className="text-red-600 text-sm">
              +{lowStockProducts.length - 3} more items need restocking
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
