
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store as StoreIcon, MapPin } from "lucide-react";
import { Store } from "@/redux/services/stores.services";

interface StoreGridProps {
  stores: Store[];
  activeStoreId: number;
  onStoreSwitch: (storeId: number) => void;
}

export function StoreGrid({ stores, activeStoreId, onStoreSwitch }: StoreGridProps) {
  const filteredStores = stores.filter(store => store.storeId !== activeStoreId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStores.map((store) => (
        <Card 
          key={store.storeId} 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => onStoreSwitch(store.storeId)}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <StoreIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{store.storeName}</CardTitle>
              </div>
              <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                {store.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {store.storeAddress}
              </div>
              <div className="text-sm text-gray-600 mb-1">Manager: {store.storeAdmin}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-sm text-gray-600">Total Sales</div>
                <div className="font-bold">
                  ₦{store.totalSales.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
