import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StoreSelect } from "@/components/common/StoreSelect";
import { useGetCategoriesQuery } from "@/redux/services/products.services";
import type { StoreFilter as Filters } from "@/types/store";

const ALL = "all";
const RANGES = [
  { value: "last7days", label: "Last 7 days" },
  { value: "last30days", label: "Last 30 days" },
  { value: "last90days", label: "Last 90 days" },
  { value: "thisYear", label: "This year" },
] as const;

interface StoreFilterProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function StoreFilter({ filters, onFiltersChange }: StoreFilterProps) {
  const { data } = useGetCategoriesQuery({});
  const set = (patch: Partial<Filters>) => onFiltersChange({ ...filters, ...patch });

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
      <StoreSelect value={filters.storeId} onChange={(storeId) => set({ storeId })} />
      <Select value={filters.categoryId ? String(filters.categoryId) : ALL} onValueChange={(v) => set({ categoryId: v === ALL ? undefined : Number(v) })}>
        <SelectTrigger className="lg:w-52"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All categories</SelectItem>
          {data?.categories.map((c) => <SelectItem key={c.categoryId} value={String(c.categoryId)}>{c.categoryName}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.timeline ?? "last30days"} onValueChange={(v) => set({ timeline: v as Filters["timeline"] })}>
        <SelectTrigger className="lg:w-44"><SelectValue /></SelectTrigger>
        <SelectContent>
          {RANGES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
