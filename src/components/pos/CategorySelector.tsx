
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  productCount: number;
}

export function CategorySelector({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  productCount 
}: CategorySelectorProps) {
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange("all")}
            className="min-w-fit"
          >
            All Products
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="min-w-fit"
            >
              {category}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
