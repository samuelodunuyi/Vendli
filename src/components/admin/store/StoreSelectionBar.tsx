
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Store } from "@/types/store";

interface StoreSelectionBarProps {
  stores: Store[];
  activeStoreId: string;
  compareMode: boolean;
  selectedStoresForComparison: string[];
  onStoreSwitch: (storeId: string) => void;
  onStoreSelect: (storeId: string) => void;
}

export function StoreSelectionBar({
  stores,
  activeStoreId,
  compareMode,
  selectedStoresForComparison,
  onStoreSwitch,
  onStoreSelect
}: StoreSelectionBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Store View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {stores.map((store) => (
            <Button
              key={store.id}
              variant={activeStoreId === store.id ? "default" : "outline"}
              size="sm"
              onClick={() => compareMode ? onStoreSelect(store.id) : onStoreSwitch(store.id)}
              className={`${compareMode && selectedStoresForComparison.includes(store.id) ? 'ring-2 ring-blue-500' : ''}`}
            >
              {compareMode && selectedStoresForComparison.includes(store.id) && (
                <Eye className="h-3 w-3 mr-1" />
              )}
              {store.name}
            </Button>
          ))}
        </div>
        {compareMode && (
          <div className="mt-2 text-sm text-gray-600">
            Select up to 3 stores to compare. Currently selected: {selectedStoresForComparison.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
