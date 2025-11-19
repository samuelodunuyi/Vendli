
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Product } from "@/redux/services/products.services";

interface ProductsSummaryCardsProps {
  productList: Product[];
  lowStockProducts: Product[];
  categories: Category[];
}

export function ProductsSummaryCards({ productList, lowStockProducts, categories }: ProductsSummaryCardsProps) {
  console.log(productList)
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productList?.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{lowStockProducts?.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₦{productList?.reduce((sum, p) => sum + (p.basePrice * p.basestock), 0).toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productList?.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}
