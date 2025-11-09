import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, RefreshCw } from "lucide-react";

interface OrdersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: number;
  setStatusFilter: (status: number) => void;
}

export function OrdersFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex gap-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
<Select
  value={statusFilter !== null ? statusFilter.toString() : undefined}
  onValueChange={(val) =>
    setStatusFilter(val === undefined ? null : Number(val))
  }
>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="All Status" />
  </SelectTrigger>
  <SelectContent>
    {/* No empty string value here */}
    <SelectItem value="0">Pending</SelectItem>
    <SelectItem value="1">Confirmed</SelectItem>
    <SelectItem value="3">Shipped</SelectItem>
    <SelectItem value="4">Delivered</SelectItem>
    <SelectItem value="7">Cancelled</SelectItem>
    <SelectItem value="6">Returned</SelectItem>
  </SelectContent>
</Select>

      </div>

      <div className="flex gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
