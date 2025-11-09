
import { StoreSelectionBar } from "./StoreSelectionBar";
import { ActiveStoreDetails } from "./ActiveStoreDetails";
import { StoreGrid } from "./StoreGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, DollarSign, Clock, TrendingUp, Package } from "lucide-react";
import { Store } from "@/redux/services/stores.services";

interface StoreOverviewTabProps {
  stores: Store[];
  activeStore: Store | undefined;
  activeStoreId: number;
  compareMode: boolean;
  selectedStoresForComparison: number[];
  onStoreSwitch: (storeId: number) => void;
  onStoreSelect: (storeId: number) => void;
  onEditStore: (storeId: number) => void;
  onViewAnalytics: (storeId: number) => void;
  onManageStaff: () => void;
}

export function StoreOverviewTab({
  stores,
  activeStore,
  activeStoreId,
  compareMode,
  selectedStoresForComparison,
  onStoreSwitch,
  onStoreSelect,
  onEditStore,
  onViewAnalytics,
  onManageStaff
}: StoreOverviewTabProps) {
  // Mock delivery metrics for the active store
  const deliveryMetrics = {
    totalOrders: 245,
    averageDeliveryCost: 2150,
    costSavings: 18500,
    topProvider: "GIG Logistics",
    onTimeDeliveryRate: 94.2,
    activeProviders: 4
  };

  return (
    <div className="space-y-6">
      <StoreSelectionBar
        stores={stores}
        activeStoreId={activeStoreId}
        compareMode={compareMode}
        selectedStoresForComparison={selectedStoresForComparison}
        onStoreSwitch={onStoreSwitch}
        onStoreSelect={onStoreSelect}
      />

      {activeStore && !compareMode && (
        <>
          <ActiveStoreDetails
            store={activeStore}
            onEditStore={onEditStore}
            onViewAnalytics={onViewAnalytics}
            onManageStaff={onManageStaff}
          />

        </>
      )}

      {!compareMode && (
        <StoreGrid
          stores={stores}
          activeStoreId={activeStoreId}
          onStoreSwitch={onStoreSwitch}
        />
      )}
    </div>
  );
}
