import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/redux/services/products.services";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: number;
  onCategoryChange: (category: number) => void;
  productCount: number;
  loading?: boolean;
}

export function CategorySelector({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  productCount,
  loading = false
}: CategorySelectorProps) {
  console.log(selectedCategory)
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Product Categories</CardTitle>
          <Badge variant="secondary" className="text-sm">
            {productCount} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading categories...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(null)}
              className="min-w-fit"
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.categoryId}
                variant={selectedCategory === category.categoryId ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.categoryId)}
                className="min-w-fit"
              >
                {category.categoryName}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
