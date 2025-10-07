
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Package, DollarSign } from "lucide-react";

interface StorePerformance {
  storeId: string;
  storeName: string;
  revenue: number;
  orders: number;
  customers: number;
  inventory: number;
  growth: number;
  efficiency: number;
}

interface StoreComparisonProps {
  selectedStores: string[];
  onClose: () => void;
}

const mockPerformanceData: Record<string, StorePerformance> = {
  "store1": {
    storeId: "store1",
    storeName: "Victoria Island Store",
    revenue: 3750000,
    orders: 245,
    customers: 189,
    inventory: 1240,
    growth: 15.2,
    efficiency: 92
  },
  "store2": {
    storeId: "store2",
    storeName: "Ikeja Store",
    revenue: 2800000,
    orders: 198,
    customers: 156,
    inventory: 1180,
    growth: 8.5,
    efficiency: 88
  },
  "store3": {
    storeId: "store3",
    storeName: "Lekki Store",
    revenue: 2400000,
    orders: 167,
    customers: 134,
    inventory: 1050,
    growth: 12.1,
    efficiency: 85
  }
};

export function StoreComparison({ selectedStores, onClose }: StoreComparisonProps) {
  const storeData = selectedStores.map(storeId => mockPerformanceData[storeId]).filter(Boolean);

  if (storeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Store Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Select stores to compare their performance metrics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Store Performance Comparison</h3>
        <Badge variant="outline">{storeData.length} stores selected</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {storeData.map((store) => (
              <div key={store.storeId} className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">{store.storeName}</span>
                <span className="text-sm font-bold">₦{store.revenue.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Orders Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              Monthly Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {storeData.map((store) => (
              <div key={store.storeId} className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">{store.storeName}</span>
                <span className="text-sm font-bold">{store.orders}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customers Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {storeData.map((store) => (
              <div key={store.storeId} className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">{store.storeName}</span>
                <span className="text-sm font-bold">{store.customers}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Growth Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {storeData.map((store) => (
              <div key={store.storeId} className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">{store.storeName}</span>
                <div className="flex items-center gap-1">
                  {store.growth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-sm font-bold ${store.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {store.growth > 0 ? '+' : ''}{store.growth}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Store</th>
                  <th className="text-right p-3">Revenue</th>
                  <th className="text-right p-3">Orders</th>
                  <th className="text-right p-3">Customers</th>
                  <th className="text-right p-3">Inventory</th>
                  <th className="text-right p-3">Growth</th>
                  <th className="text-right p-3">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {storeData.map((store) => (
                  <tr key={store.storeId} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{store.storeName}</td>
                    <td className="p-3 text-right">₦{store.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right">{store.orders}</td>
                    <td className="p-3 text-right">{store.customers}</td>
                    <td className="p-3 text-right">{store.inventory}</td>
                    <td className="p-3 text-right">
                      <span className={store.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                        {store.growth > 0 ? '+' : ''}{store.growth}%
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Badge variant={store.efficiency > 90 ? 'default' : store.efficiency > 80 ? 'secondary' : 'destructive'}>
                        {store.efficiency}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
