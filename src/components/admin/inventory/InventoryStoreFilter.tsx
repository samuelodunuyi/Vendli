import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Store as StoreIcon, MapPin } from "lucide-react";
import { useGetStoresQuery } from "@/redux/services/stores.services";

interface InventoryStoreFilterProps {
  selectedStoreId: string;
  onStoreChange: (storeId: string) => void;
}

export function InventoryStoreFilter({ selectedStoreId, onStoreChange }: InventoryStoreFilterProps) {
  const { data: storeResponse, isLoading } = useGetStoresQuery();
  const storeOptions =
    storeResponse?.stores?.map((store) => ({
      id: String(store.storeId),
      name: store.storeName,
      location: store.storeAddress,
    })) ?? [];

  const stores = [{ id: "all", name: "All Stores", location: "Network View" }, ...storeOptions];
  const selectedStore = stores.find((store) => store.id === selectedStoreId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StoreIcon className="h-5 w-5" />
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
                    {store.id === "all" ? <StoreIcon className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
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
