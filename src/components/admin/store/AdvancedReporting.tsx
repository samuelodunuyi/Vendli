
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, BarChart3, Download, Filter } from "lucide-react";
import { Store } from "@/redux/services/stores.services";

interface AdvancedReportingProps {
  stores: Store[];
}

const performanceData = [
  { store: "Victoria Island", efficiency: 92, salesPerSqFt: 1250, conversionRate: 15.2, avgTransactionValue: 28500 },
  { store: "Ikeja", efficiency: 88, salesPerSqFt: 1180, conversionRate: 12.8, avgTransactionValue: 24200 },
  { store: "Lekki", efficiency: 85, salesPerSqFt: 1050, conversionRate: 11.5, avgTransactionValue: 22800 },
  { store: "Ajah", efficiency: 87, salesPerSqFt: 980, conversionRate: 13.2, avgTransactionValue: 19500 },
  { store: "Egbeda", efficiency: 83, salesPerSqFt: 890, conversionRate: 10.8, avgTransactionValue: 18200 }
];

const regionalTrends = [
  { month: "Jan", mainland: 12500000, island: 18200000, suburban: 8900000 },
  { month: "Feb", mainland: 13200000, island: 19800000, suburban: 9400000 },
  { month: "Mar", mainland: 14800000, island: 21500000, suburban: 10200000 },
  { month: "Apr", mainland: 13900000, island: 20200000, suburban: 9800000 },
  { month: "May", mainland: 15200000, island: 22800000, suburban: 11100000 },
  { month: "Jun", mainland: 16500000, island: 24200000, suburban: 12300000 }
];

const predictiveData = [
  { product: "Samsung Galaxy S24", basestock: 45, predictedDemand: 67, recommendedReorder: 85 },
  { product: "iPhone 15 Pro", basestock: 32, predictedDemand: 89, recommendedReorder: 120 },
  { product: "Nike Air Max", basestock: 78, predictedDemand: 45, recommendedReorder: 30 },
  { product: "Dell XPS 15", basestock: 12, predictedDemand: 28, recommendedReorder: 40 },
  { product: "Sony WH-1000XM5", basestock: 56, predictedDemand: 72, recommendedReorder: 90 }
];

const categoryColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export function AdvancedReporting({ stores }: AdvancedReportingProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Advanced Reporting & Analytics
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="regional">Regional Trends</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Store Efficiency Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Store Efficiency Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="store" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="efficiency" fill="#3B82F6" name="Efficiency %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sales per Square Foot</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="store" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₦${value}`, 'Sales/Sq.Ft']} />
                      <Bar dataKey="salesPerSqFt" fill="#10B981" name="Sales/Sq.Ft" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Store</th>
                        <th className="text-right p-3">Efficiency</th>
                        <th className="text-right p-3">Sales/Sq.Ft</th>
                        <th className="text-right p-3">Conversion Rate</th>
                        <th className="text-right p-3">Avg Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((store) => (
                        <tr key={store.store} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{store.store}</td>
                          <td className="p-3 text-right">
                            <Badge variant={store.efficiency > 90 ? 'default' : store.efficiency > 85 ? 'secondary' : 'destructive'}>
                              {store.efficiency}%
                            </Badge>
                          </td>
                          <td className="p-3 text-right">₦{store.salesPerSqFt.toLocaleString()}</td>
                          <td className="p-3 text-right">{store.conversionRate}%</td>
                          <td className="p-3 text-right">₦{store.avgTransactionValue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regional Sales Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={regionalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₦${(value as number).toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="island" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Lagos Island" />
                    <Area type="monotone" dataKey="mainland" stackId="1" stroke="#10B981" fill="#10B981" name="Lagos Mainland" />
                    <Area type="monotone" dataKey="suburban" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Suburban Areas" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Predictive Inventory Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveData.map((item) => (
                    <div key={item.product} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.product}</div>
                        <div className="text-sm text-gray-600">
                          Current: {item.basestock} | Predicted Demand: {item.predictedDemand}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">
                          Reorder: {item.recommendedReorder} units
                        </div>
                        <Badge variant={item.basestock < item.predictedDemand ? 'destructive' : 'default'}>
                          {item.basestock < item.predictedDemand ? 'Low Stock Risk' : 'Adequate Stock'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Network Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Efficiency</span>
                      <span className="font-bold">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-bold">12.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales/Sq.Ft</span>
                      <span className="font-bold">₦1,070</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Industry Benchmark</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Efficiency</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-bold">11.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales/Sq.Ft</span>
                      <span className="font-bold">₦950</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance vs Benchmark</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Efficiency</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="font-bold text-green-600">+2.4%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="font-bold text-green-600">+13.4%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sales/Sq.Ft</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="font-bold text-green-600">+12.6%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
