/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, MapPin } from "lucide-react";
import { Store } from "@/redux/services/stores.services";
import {
  useGetCustomerBehaviourAnalyticsQuery,
  useGetStoreMigrationAnalyticsQuery,
  useGetRegionalPreferencesAnalyticsQuery,
  StoreCustomerBehaviour,
  StoreRegionalPreferences,
  StoreCategoryAllocation,
} from "@/redux/services/analytics.services";
import { skipToken } from "@reduxjs/toolkit/query/react";

interface CustomerAnalyticsProps {
  stores: Store[];
}

export function CustomerAnalytics({ stores }: CustomerAnalyticsProps) {
  const [fromStoreId, setFromStoreId] = React.useState<number | null>(null);
const [toStoreId, setToStoreId] = React.useState<number | null>(null);
  const {
    data: behaviourData,
    isLoading: behaviourLoading,
    isError: behaviourError,
  } = useGetCustomerBehaviourAnalyticsQuery({ windowDays: 90 });

const migrationArg = fromStoreId && toStoreId ? { fromStoreId, toStoreId } : skipToken;
const { data: migrationData, isLoading: migrationLoading, isError: migrationError } =
  useGetStoreMigrationAnalyticsQuery(migrationArg as any);

  const {
    data: preferencesData,
    isLoading: preferencesLoading,
    isError: preferencesError,
  } = useGetRegionalPreferencesAnalyticsQuery();

  const behaviourStores: StoreCustomerBehaviour[] = behaviourData?.stores ?? [];
  const preferencesStores: StoreRegionalPreferences[] = preferencesData?.stores ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Analytics & Insights
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="behavior" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="behavior">Customer Behavior</TabsTrigger>
            <TabsTrigger value="migration">Store Migration</TabsTrigger>
            <TabsTrigger value="preferences">Regional Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="behavior" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Acquisition</CardTitle>
                </CardHeader>
                <CardContent>
                  {behaviourLoading ? (
                    <p className="text-sm text-gray-500">Loading acquisition chart...</p>
                  ) : behaviourError ? (
                    <p className="text-sm text-red-600">Failed to load acquisition data</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={behaviourStores}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="storeName" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="newCustomers" fill="#3B82F6" name="New Customers" />
                        <Bar dataKey="returningCustomers" fill="#10B981" name="Returning Customers" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loyalty Membership by Store</CardTitle>
                </CardHeader>
                <CardContent>
                  {behaviourLoading ? (
                    <p className="text-sm text-gray-500">Loading loyalty chart...</p>
                  ) : behaviourError ? (
                    <p className="text-sm text-red-600">Failed to load loyalty data</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={behaviourStores}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="storeName" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="loyaltyMembers" fill="#8B5CF6" name="Loyalty Members" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Behavior Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {behaviourLoading ? (
                  <p className="text-sm text-gray-500">Loading customer behaviour...</p>
                ) : behaviourError ? (
                  <p className="text-sm text-red-600">Failed to load customer behaviour data</p>
                ) : behaviourStores.length === 0 ? (
                  <p className="text-sm text-gray-500">No customer behaviour data available.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Store</th>
                          <th className="text-right p-3">New Customers</th>
                          <th className="text-right p-3">Returning</th>
                          <th className="text-right p-3">Loyalty Members</th>
                          <th className="text-right p-3">Avg Visits/Month</th>
                        </tr>
                      </thead>
                      <tbody>
                        {behaviourStores.map((s) => (
                          <tr key={s.storeId} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{s.storeName}</td>
                            <td className="p-3 text-right">{s.newCustomers}</td>
                            <td className="p-3 text-right">{s.returningCustomers}</td>
                            <td className="p-3 text-right">
                              <Badge variant="outline">{s.loyaltyMembers}</Badge>
                            </td>
                            <td className="p-3 text-right">{s.avgVisitsPerMonth}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- MIGRATION TAB ---------- */}
<TabsContent value="migration" className="space-y-6">
  <div className="flex gap-4 mb-4 items-center">
    {/* From Store */}
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">From Store</label>
      <select
        className="border rounded px-2 py-1"
        value={fromStoreId ?? ""}
        onChange={(e) => setFromStoreId(Number(e.target.value))}
      >
        <option value="">Select store</option>
        {stores.map((store) => (
          <option key={store.storeId} value={store.storeId}>
            {store.storeName}
          </option>
        ))}
      </select>
    </div>

    {/* To Store */}
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">To Store</label>
      <select
        className="border rounded px-2 py-1"
        value={toStoreId ?? ""}
        onChange={(e) => setToStoreId(Number(e.target.value))}
      >
        <option value="">Select store</option>
        {stores.map((store) => (
          <option key={store.storeId} value={store.storeId}>
            {store.storeName}
          </option>
        ))}
      </select>
    </div>
  </div>

  {migrationLoading ? (
    <p className="text-sm text-gray-500">Loading migration analytics...</p>
  ) : migrationError ? (
    <p className="text-sm text-red-600">Failed to load migration data</p>
  ) : migrationData ? (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer Migration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium">
                From {stores.find((s) => s.storeId === migrationData.fromStoreId)?.storeName} → 
                To {stores.find((s) => s.storeId === migrationData.toStoreId)?.storeName}
              </div>
              <div className="text-sm text-gray-600">
                Customers who moved within 30 days
              </div>
            </div>
          </div>
          <div className="text-right font-bold text-blue-600">
            {migrationData.migrationCount} customers
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    <p className="text-sm text-gray-500">Select both stores to see migration data.</p>
  )}
</TabsContent>


          {/* ---------- PREFERENCES TAB ---------- */}
          <TabsContent value="preferences" className="space-y-6">
            {preferencesLoading ? (
              <p className="text-sm text-gray-500">Loading regional preferences...</p>
            ) : preferencesError ? (
              <p className="text-sm text-red-600">Failed to load regional preferences</p>
            ) : preferencesStores.length === 0 ? (
              <p className="text-sm text-gray-500">No regional preferences data available.</p>
            ) : (
              preferencesStores.map((store) => (
                <Card key={store.storeId}>
                  <CardHeader>
                    <CardTitle className="text-lg">{store.storeName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {store.categories.map((cat: StoreCategoryAllocation, idx: number) => (
                        <div
                          key={cat.categoryId}
                          className={`text-center p-3 rounded-lg ${
                            ["bg-blue-50", "bg-green-50", "bg-yellow-50", "bg-red-50"][idx % 4]
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              ["text-blue-600", "text-green-600", "text-yellow-600", "text-red-600"][idx % 4]
                            }`}
                          >
                            {cat.orderPercentage}%
                          </div>
                          <div className="text-sm text-gray-600">{cat.categoryName}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
