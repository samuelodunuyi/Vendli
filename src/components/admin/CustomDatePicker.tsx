
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface CustomDatePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function CustomDatePicker({ dateRange, onDateRangeChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    if (dateRange.from) {
      return format(dateRange.from, "MMM d, yyyy");
    }
    return "Select date range";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-64 justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange.from}
          selected={dateRange}
          onSelect={(range) => {
            if (range) {
              onDateRangeChange({
                from: range.from,
                to: range.to
              });
            }
          }}
          numberOfMonths={2}
          className="p-3 pointer-events-auto"
        />
        <div className="p-3 border-t">
          <Button 
            onClick={() => setIsOpen(false)}
            className="w-full"
          >
            Apply Date Range
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
