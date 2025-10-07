
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  userFilter: string;
  onUserFilterChange: (user: string) => void;
}

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  dateRange,
  onDateRangeChange,
  userFilter,
  onUserFilterChange
}: TransactionFiltersProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const clearFilters = () => {
    onSearchChange("");
    onTypeFilterChange("all");
    onDateRangeChange({});
    onUserFilterChange("all");
  };

  const activeFiltersCount = [
    searchQuery,
    typeFilter !== "all" ? typeFilter : null,
    dateRange.from || dateRange.to ? "date" : null,
    userFilter !== "all" ? userFilter : null
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search transactions, products, references..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="in">Stock In</SelectItem>
              <SelectItem value="out">Stock Out</SelectItem>
              <SelectItem value="adjustment">Adjustments</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
            </SelectContent>
          </Select>

          <Select value={userFilter} onValueChange={onUserFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="admin">Admin Users</SelectItem>
              <SelectItem value="manager">Managers</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => onDateRangeChange(range || {})}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary">Search: {searchQuery}</Badge>
          )}
          {typeFilter !== "all" && (
            <Badge variant="secondary">Type: {typeFilter}</Badge>
          )}
          {(dateRange.from || dateRange.to) && (
            <Badge variant="secondary">Date Range</Badge>
          )}
          {userFilter !== "all" && (
            <Badge variant="secondary">User: {userFilter}</Badge>
          )}
        </div>
      )}
    </div>
  );
}
