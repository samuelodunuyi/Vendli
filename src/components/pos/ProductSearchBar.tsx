import { ScanBarcode, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchBarProps {
  value: string;
  onChange: (query: string) => void;
  /** Called on Enter: lets a hand-held scanner (which "types" the code) add items directly. */
  onSubmit: (query: string) => void;
  onScannerOpen: () => void;
}

export function ProductSearchBar({ value, onChange, onSubmit, onScannerOpen }: ProductSearchBarProps) {
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value.trim());
      }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Search name, SKU or scan a barcode…"
          className="h-11 pl-9"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Button type="button" variant="outline" className="h-11 shrink-0 px-3" onClick={onScannerOpen} aria-label="Open barcode scanner">
        <ScanBarcode className="h-5 w-5" />
        <span className="ml-2 hidden sm:inline">Scan</span>
      </Button>
    </form>
  );
}
