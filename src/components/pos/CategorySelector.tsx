import { Button } from "@/components/ui/button";
import type { Category } from "@/redux/services/products.services";

interface CategorySelectorProps {
  categories: Category[];
  selected: number | null;
  onChange: (categoryId: number | null) => void;
}

export function CategorySelector({ categories, selected, onChange }: CategorySelectorProps) {
  const options = [{ categoryId: null as number | null, categoryName: "All" }, ...categories];
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
      {options.map((c) => (
        <Button
          key={c.categoryId ?? "all"}
          size="sm"
          variant={selected === c.categoryId ? "default" : "outline"}
          className="shrink-0 rounded-full"
          onClick={() => onChange(c.categoryId)}
        >
          {c.categoryName}
        </Button>
      ))}
    </div>
  );
}
