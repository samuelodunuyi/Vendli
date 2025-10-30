
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

          {/* Delivery Services Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Services Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold">{deliveryMetrics.totalOrders}</div>
                  <div className="text-sm text-gray-500">Total Deliveries</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-xl font-bold">₦{deliveryMetrics.averageDeliveryCost.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Avg. Cost</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-xl font-bold text-green-600">₦{deliveryMetrics.costSavings.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Cost Savings</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-xl font-bold">{deliveryMetrics.onTimeDeliveryRate}%</div>
                  <div className="text-sm text-gray-500">On-Time Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Truck className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="text-xl font-bold">{deliveryMetrics.activeProviders}</div>
                  <div className="text-sm text-gray-500">Active Providers</div>
                </div>
                
                <div className="text-center">
                  <Badge className="mb-2 bg-blue-600">Top Provider</Badge>
                  <div className="text-lg font-semibold">{deliveryMetrics.topProvider}</div>
                  <div className="text-sm text-gray-500">Best Performance</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Smart Cost Optimization</h4>
                        <p className="text-sm text-green-600">
                          AI automatically selects the most cost-effective delivery provider
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Truck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">Real-Time Tracking</h4>
                        <p className="text-sm text-blue-600">
                          Live updates from delivery providers with webhook integration
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
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
