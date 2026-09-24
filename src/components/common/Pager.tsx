import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PagerProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
}

export function Pager({ page, totalPages, totalItems, onPageChange }: PagerProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 border-t px-4 py-3 text-sm">
      <span className="text-muted-foreground">
        Page {page} of {totalPages}
        {totalItems !== undefined && <span className="hidden sm:inline"> · {totalItems} results</span>}
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
