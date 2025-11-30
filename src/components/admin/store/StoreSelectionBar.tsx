// StoreSelectionBar.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "@/redux/services/stores.services";
import { Eye } from "lucide-react";

interface StoreSelectionBarProps {
  stores: Store[];
  activeStoreId: number;
  compareMode: boolean;
  selectedStoresForComparison: number[];
  onStoreSwitch: (storeId: number) => void;
  onStoreSelect: (storeId: number) => void;
}

export function StoreSelectionBar({
  stores,
  activeStoreId,
  compareMode,
  selectedStoresForComparison,
  onStoreSwitch,
  onStoreSelect,
}: StoreSelectionBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Store View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {stores?.map((store) => (
            <Button
              key={store.storeId}
              variant={activeStoreId === store.storeId ? "default" : "outline"}
              size="sm"
              onClick={() =>
                compareMode
                  ? onStoreSelect(store.storeId)
                  : onStoreSwitch(store.storeId)
              }
              className={`${
                compareMode && selectedStoresForComparison.includes(store.storeId)
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              {compareMode && selectedStoresForComparison.includes(store.storeId) && (
                <Eye className="h-3 w-3 mr-1" />
              )}
              {store.storeName}
            </Button>
          ))}
        </div>
        {compareMode && (
          <div className="mt-2 text-sm text-gray-600">
            Select up to 3 stores to compare. Currently selected:{" "}
            {selectedStoresForComparison.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
