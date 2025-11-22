// StoreOverviewTab.tsx
import { StoreSelectionBar } from "./StoreSelectionBar";
import { ActiveStoreDetails } from "./ActiveStoreDetails";
import { StoreGrid } from "./StoreGrid";
import { Store } from "@/redux/services/stores.services";

interface StoreOverviewTabProps {
  stores: Store[];
  activeStore: Store | undefined;
  activeStoreId: number;
  compareMode: boolean;
  selectedStoresForComparison: number[];
  onStoreSwitch: (storeId: number, storeName?: string) => void;
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
  onManageStaff,
}: StoreOverviewTabProps) {
  return (
    <div className="space-y-6">
      <StoreSelectionBar
        stores={stores}
        activeStoreId={activeStoreId}
        compareMode={compareMode}
        selectedStoresForComparison={selectedStoresForComparison}
        onStoreSwitch={(storeId) => {
          const store = stores.find((s) => s.storeId === storeId);
          onStoreSwitch(storeId, store?.storeName);
        }}
        onStoreSelect={onStoreSelect}
      />

      {activeStore && !compareMode && (
        <ActiveStoreDetails
          store={activeStore}
          onEditStore={onEditStore}
          onViewAnalytics={onViewAnalytics}
          onManageStaff={onManageStaff}
        />
      )}

      {!compareMode && (
        <StoreGrid
          stores={stores}
          activeStoreId={activeStoreId}
          onStoreSwitch={(storeId) => {
            const store = stores.find((s) => s.storeId === storeId);
            onStoreSwitch(storeId, store?.storeName);
          }}
        />
      )}
    </div>
  );
}
