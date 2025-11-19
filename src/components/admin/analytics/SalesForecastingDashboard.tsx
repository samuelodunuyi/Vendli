
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Package, Brain, RefreshCw } from "lucide-react";
import { SalesForecast, RestockRecommendation } from "@/types/forecasting";

interface SalesForecastingDashboardProps {
  storeFilter?: string;
}

const mockForecastData: SalesForecast[] = [
  { period: "Week 1", predictedSales: 2850000, confidence: 92, trend: 'up' },
  { period: "Week 2", predictedSales: 3100000, confidence: 89, trend: 'up' },
  { period: "Week 3", predictedSales: 2950000, confidence: 87, trend: 'down' },
  { period: "Week 4", predictedSales: 3250000, confidence: 85, trend: 'up' },
  { period: "Month 2", predictedSales: 12800000, confidence: 78, trend: 'up' },
  { period: "Month 3", predictedSales: 13500000, confidence: 72, trend: 'up' },
];

const mockRestockData: RestockRecommendation[] = [
  {
    productId: "1",
    productName: "Samsung Galaxy S23",
    basestock: 12,
    predictedDemand: 45,
    recommendedOrder: 50,
    urgency: 'critical',
    estimatedStockoutDate: "2024-01-15"
  },
  {
    productId: "2", 
    productName: "iPhone 15 Pro",
    basestock: 8,
    predictedDemand: 32,
    recommendedOrder: 40,
    urgency: 'high',
    estimatedStockoutDate: "2024-01-18"
  },
  {
    productId: "3",
    productName: "Dell XPS 15",
    basestock: 25,
    predictedDemand: 18,
    recommendedOrder: 15,
    urgency: 'medium',
    estimatedStockoutDate: "2024-02-02"
  },
  {
    productId: "4",
    productName: "Nike Air Max",
    basestock: 45,
    predictedDemand: 28,
    recommendedOrder: 20,
    urgency: 'low',
    estimatedStockoutDate: "2024-02-15"
  }
];

const heatmapData = [
  { hour: "9AM", mon: 85, tue: 78, wed: 92, thu: 88, fri: 95, sat: 120, sun: 65 },
  { hour: "10AM", mon: 95, tue: 88, wed: 102, thu: 98, fri: 105, sat: 135, sun: 75 },
  { hour: "11AM", mon: 110, tue: 105, wed: 118, thu: 115, fri: 125, sat: 150, sun: 85 },
  { hour: "12PM", mon: 125, tue: 120, wed: 135, thu: 130, fri: 140, sat: 165, sun: 95 },
  { hour: "1PM", mon: 135, tue: 130, wed: 145, thu: 140, fri: 150, sat: 175, sun: 105 },
  { hour: "2PM", mon: 120, tue: 115, wed: 130, thu: 125, fri: 135, sat: 160, sun: 90 },
  { hour: "3PM", mon: 105, tue: 100, wed: 115, thu: 110, fri: 120, sat: 145, sun: 80 },
  { hour: "4PM", mon: 90, tue: 85, wed: 100, thu: 95, fri: 105, sat: 130, sun: 70 },
  { hour: "5PM", mon: 85, tue: 80, wed: 95, thu: 90, fri: 100, sat: 125, sun: 65 },
];

export function SalesForecastingDashboard({ storeFilter }: SalesForecastingDashboardProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">AI Sales Forecasting</h2>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Predictions
        </Button>
      </div>

      <Tabs defaultValue="forecast" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecast">Sales Forecast</TabsTrigger>
          <TabsTrigger value="restock">Restock Recommendations</TabsTrigger>
          <TabsTrigger value="heatmap">Performance Heatmap</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Next Week Forecast</p>
                    <p className="text-2xl font-bold text-green-600">₦3.1M</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-green-600">92% Confidence</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Next Month Forecast</p>
                    <p className="text-2xl font-bold text-blue-600">₦12.8M</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-blue-600">78% Confidence</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Growth Trend</p>
                    <p className="text-2xl font-bold text-purple-600">+15.2%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-purple-600">vs Last Period</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Forecast Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockForecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${(value as number).toLocaleString()}`, 'Predicted Sales']} />
                  <Area 
                    type="monotone" 
                    dataKey="predictedSales" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                AI-Powered Restock Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRestockData.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            Current: {item.basestock} | Predicted Demand: {item.predictedDemand}
                          </p>
                          <p className="text-xs text-gray-500">
                            Est. stockout: {item.estimatedStockoutDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600 mb-2">
                        Order: {item.recommendedOrder} units
                      </div>
                      <Badge className={getUrgencyColor(item.urgency)}>
                        {item.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={heatmapData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="mon" stackId="a" fill="#3B82F6" name="Monday" />
                  <Bar dataKey="tue" stackId="a" fill="#10B981" name="Tuesday" />
                  <Bar dataKey="wed" stackId="a" fill="#F59E0B" name="Wednesday" />
                  <Bar dataKey="thu" stackId="a" fill="#EF4444" name="Thursday" />
                  <Bar dataKey="fri" stackId="a" fill="#8B5CF6" name="Friday" />
                  <Bar dataKey="sat" stackId="a" fill="#EC4899" name="Saturday" />
                  <Bar dataKey="sun" stackId="a" fill="#6B7280" name="Sunday" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Peak Performance</p>
                      <p className="text-sm text-gray-600">Saturdays show 40% higher sales than weekdays</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Stock Alert</p>
                      <p className="text-sm text-gray-600">4 items need immediate restocking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">AI Recommendation</p>
                      <p className="text-sm text-gray-600">Increase weekend staff by 25%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Action Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Schedule bulk orders for critical items
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Adjust weekend staffing schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Review electronics promotion strategy
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Analyze customer behavior patterns
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
