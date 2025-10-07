
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "@/types/store";

interface StoreNetworkStatsProps {
  stores: Store[];
}

export function StoreNetworkStats({ stores }: StoreNetworkStatsProps) {
  const totalNetworkRevenue = stores.reduce((sum, store) => sum + store.monthlyRevenue, 0);
  const averageStorePerformance = Math.round(totalNetworkRevenue / stores.length);
  const topPerformingStore = stores.reduce((top, store) => 
    store.monthlyRevenue > top.monthlyRevenue ? store : top
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Network Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            ₦{totalNetworkRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">This month across all stores</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Store Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            ₦{averageStorePerformance.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Average monthly revenue per store</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Store</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-orange-600">
            {topPerformingStore.name}
          </div>
          <div className="text-sm text-gray-600">Highest monthly revenue</div>
        </CardContent>
      </Card>
    </div>
  );
}
