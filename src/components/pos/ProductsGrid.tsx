
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/redux/services/products.services";

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  console.log(products)
  return (
    <Card className="flex-1 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Products</CardTitle>
          <Badge variant="secondary" className="text-sm">
            {products?.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Search className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[calc(100vh-320px)] overflow-y-auto">
            {products?.map((product) => (
              <ProductCard key={product.productId} product={product} isPOS={true} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
