
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download } from "lucide-react";

interface CustomerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  classificationFilter: string;
  onClassificationChange: (value: string) => void;
  storeFilter: string;
  onStoreChange: (value: string) => void;
  onAddCustomer: () => void;
  onExport: () => void;
}

export function CustomerFilters({
  searchTerm,
  onSearchChange,
  classificationFilter,
  onClassificationChange,
  storeFilter,
  onStoreChange,
  onAddCustomer,
  onExport
}: CustomerFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={classificationFilter} onValueChange={onClassificationChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="walk-in">Walk-in</SelectItem>
            </SelectContent>
          </Select>
          <Select value={storeFilter} onValueChange={onStoreChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="Victoria Island Store">Victoria Island Store</SelectItem>
              <SelectItem value="Ikeja Store">Ikeja Store</SelectItem>
              <SelectItem value="Lekki Store">Lekki Store</SelectItem>
              <SelectItem value="Ajah Store">Ajah Store</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={onAddCustomer}>
              Add Customer
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={onExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
