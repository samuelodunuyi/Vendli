
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin } from "lucide-react";

interface InventoryStoreFilterProps {
  selectedStoreId: string;
  onStoreChange: (storeId: string) => void;
}

const stores = [
  { id: "all", name: "All Stores", location: "Network View" },
  { id: "store1", name: "Victoria Island Store", location: "1004 Victoria Island, Lagos" },
  { id: "store2", name: "Ikeja Store", location: "Allen Avenue, Ikeja, Lagos" },
  { id: "store3", name: "Lekki Store", location: "Phase 1, Lekki, Lagos" },
  { id: "store4", name: "Ajah Store", location: "Ajah, Lagos" },
  { id: "store5", name: "Egbeda Store", location: "Egbeda, Lagos" }
];

export function InventoryStoreFilter({ selectedStoreId, onStoreChange }: InventoryStoreFilterProps) {
  const selectedStore = stores.find(store => store.id === selectedStoreId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Store className="h-5 w-5" />
          Store Selection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedStoreId} onValueChange={onStoreChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  <div className="flex items-center gap-2">
                    {store.id === "all" ? (
                      <Store className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    {store.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedStore && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{selectedStore.name}</div>
                  <div className="text-sm text-gray-600">{selectedStore.location}</div>
                </div>
                <Badge variant={selectedStoreId === "all" ? "secondary" : "default"}>
                  {selectedStoreId === "all" ? "Network" : "Single Store"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
