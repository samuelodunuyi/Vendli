/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingDown,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  useGetSalesStatisticsQuery,
  useGetStatisticsQuery,
} from "@/redux/services/stores.services";

import { useGetPromotionsQuery } from "@/redux/services/promotions.services";
import { skipToken } from "@reduxjs/toolkit/query";

// Props
interface StoreAnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId?: number;
  storeName?: string;
}

export function StoreAnalyticsDialog({
  open,
  onOpenChange,
  storeId,
  storeName,
}: StoreAnalyticsDialogProps) {
const {
  data: statsData,
  isLoading: statsLoading,
  isError: statsError,
} = useGetStatisticsQuery(
  storeId ? { store: storeId } : skipToken
);

const {
  data: salesDataAPI,
  isLoading: salesLoading,
  isError: salesError,
} = useGetSalesStatisticsQuery(
  storeId ? { storeId } : skipToken
);

const {
  data: promotionsData,
  isLoading: promotionsLoading,
} = useGetPromotionsQuery(
  storeId ? { storeId, includeDeleted: false } : skipToken
);
useEffect(() => {
  if (promotionsData) {
    console.log("Store promotions LOADED:", promotionsData);
  }
}, [promotionsData]);

  const storePromotions = promotionsData ?? [];
  // Metrics
  const totalRevenue = statsData?.totalSales ?? 0;
  const totalOrders = statsData?.totalOrders ?? 0;
  const activeCustomers = statsData?.activeCustomers ?? 0;
  const inventoryItems = statsData?.totalProducts ?? 0;

  // Sales Trend
  const salesTrendData = useMemo(() => {
    if (!salesDataAPI?.salesTrend) return [];
    return salesDataAPI.salesTrend.labels.map((label, index) => ({
      month: label,
      revenue: salesDataAPI.salesTrend.values[index] ?? 0,
      orders:
        salesDataAPI.salesByCategory?.[index]?.totalSales ?? 0,
    }));
  }, [salesDataAPI]);

  // Top Products
  const topProducts =
    statsData?.topSellingProducts?.map((p) => ({
      name: p.productName,
      sales: p.totalSales,
      revenue: p.totalAmount,
    })) ?? [];

  // Categories
  const categoryData =
    statsData?.topSellingCategories?.map((cat) => ({
      name: cat.categoryName,
      value: cat.totalSales,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    })) ?? [];

  // Loading or error fallback
  if (statsLoading || salesLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto flex items-center justify-center">
          <p>Loading analytics...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (statsError || salesError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto flex items-center justify-center">
          <p>Error loading analytics. Please try again.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Store Analytics - {storeName || "Store"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>

          {/* ---------------- OVERVIEW ---------------- */}
          <TabsContent value="overview" className="space-y-4">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₦{totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{totalOrders}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Customers</p>
                      <p className="text-2xl font-bold">{activeCustomers}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Inventory Items</p>
                      <p className="text-2xl font-bold">{inventoryItems}</p>
                    </div>
                    <Package className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={salesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `₦${(value as number).toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}`, "Units Sold"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ---------------- SALES ---------------- */}
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue (₦)" />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- PRODUCTS ---------------- */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-600">
                            {product.sales} units sold
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ₦{product.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- CUSTOMERS ---------------- */}
          <TabsContent value="customers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {activeCustomers}
                  </div>
                  <div className="text-sm text-gray-600">
                    Active Customers
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ₦
                    {Number(
                      (
                        totalRevenue / Math.max(totalOrders, 1)
                      ).toFixed(2)
                    ).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Order Value</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(totalOrders /
                      Math.max(activeCustomers, 1)).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Avg. Orders/Customer
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ---------------- PROMOTIONS ---------------- */}
          <TabsContent value="promotions" className="space-y-4">
            {/* LOADING */}
            {promotionsLoading && (
              <Card className="p-6 text-center text-sm text-gray-500">
                Loading promotions...
              </Card>
            )}

            {/* EMPTY */}
            {!promotionsLoading && storePromotions.length === 0 && (
              <Card className="p-6 text-center">
                <p className="text-gray-500">
                  No promotions found for this store.
                </p>
              </Card>
            )}

            {/* PROMOTIONS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storePromotions.map((promo: any) => (
                <Card key={promo.id} className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{promo.title}</span>

                      {/* Status Badge */}
                      <Badge
                        variant={
                          new Date() > new Date(promo.endDate)
                            ? "destructive"
                            : "default"
                        }
                      >
                        {new Date() > new Date(promo.endDate)
                          ? "Expired"
                          : "Active"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      {promo.description}
                    </p>

                    {/* Discount */}
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-xs text-gray-500">Discount</p>

                        <p className="text-lg font-bold text-green-600">
                          {promo.discountType === "Percentage"
                            ? `${promo.discountValue}%`
                            : `₦${promo.discountValue.toLocaleString()}`}
                        </p>
                      </div>

                      <TrendingDown className="w-6 h-6 text-green-600" />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500">Start</p>
                        <p className="font-medium">
                          {promo.startDate.split("T")[0]}
                        </p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500">End</p>
                        <p className="font-medium">
                          {promo.endDate.split("T")[0]}
                        </p>
                      </div>
                    </div>

                    {/* Scope */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 font-semibold">
                        Applies To:
                      </p>

                      {/* Stores */}
{/* Stores */}
<div className="flex flex-wrap gap-2">
  {promo.appliesToAllStores ? (
    <Badge
      variant="outline"
      className="bg-blue-50 text-blue-600"
    >
      All Stores
    </Badge>
  ) : (
    (typeof promo.applicableStoreIds === "string"
      ? promo.applicableStoreIds.split(",").map(Number)
      : promo.applicableStoreIds ?? []
    ).map((id: number) => (
      <Badge
        key={id}
        variant="outline"
        className="bg-blue-50 text-blue-600"
      >
        Store #{id}
      </Badge>
    ))
  )}
</div>


                      {/* Products */}
                      <div className="flex flex-wrap gap-2">
                        {promo.appliesToAllProducts ? (
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-600"
                          >
                            All Products
                          </Badge>
                        ) : (
                          promo.applicableProductIds?.map(
                            (id: number) => (
                              <Badge
                                key={id}
                                variant="outline"
                                className="bg-purple-50 text-purple-600"
                              >
                                Product #{id}
                              </Badge>
                            )
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
