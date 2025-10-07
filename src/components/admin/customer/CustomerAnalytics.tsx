
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";

const customerClassificationData = [
  { name: "Corporate", value: 2847, color: "#3b82f6" },
  { name: "VIP", value: 1256, color: "#8b5cf6" },
  { name: "Regular", value: 9847, color: "#10b981" },
  { name: "Walk-in", value: 1897, color: "#f59e0b" }
];

const loyaltyTierData = [
  { name: "Bronze", customers: 6500, spending: 125000 },
  { name: "Silver", customers: 4200, spending: 285000 },
  { name: "Gold", customers: 2800, spending: 465000 },
  { name: "Platinum", customers: 1200, spending: 750000 }
];

const customerAcquisitionData = [
  { month: "Jul", customers: 1200 },
  { month: "Aug", customers: 1450 },
  { month: "Sep", customers: 1380 },
  { month: "Oct", customers: 1620 },
  { month: "Nov", customers: 1520 },
  { month: "Dec", customers: 1750 },
  { month: "Jan", customers: 1890 }
];

const industryDistribution = [
  { industry: "Banking & Finance", customers: 3200, revenue: 45000000 },
  { industry: "Oil & Gas", customers: 2100, revenue: 38000000 },
  { industry: "Telecommunications", customers: 1800, revenue: 28000000 },
  { industry: "Manufacturing", customers: 1500, revenue: 22000000 },
  { industry: "Retail", customers: 2200, revenue: 18000000 },
  { industry: "Others", customers: 1200, revenue: 15000000 }
];

export function CustomerAnalytics() {
  return (
    <div className="space-y-6">
      {/* Customer Classification Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                corporate: { label: "Corporate", color: "#3b82f6" },
                vip: { label: "VIP", color: "#8b5cf6" },
                regular: { label: "Regular", color: "#10b981" },
                walkin: { label: "Walk-in", color: "#f59e0b" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerClassificationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerClassificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loyalty Tier Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                customers: { label: "Customers", color: "#3b82f6" },
                spending: { label: "Avg Spending", color: "#10b981" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loyaltyTierData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="customers" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Acquisition Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Acquisition Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              customers: { label: "New Customers", color: "#3b82f6" }
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerAcquisitionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Industry Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Distribution by Industry</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              customers: { label: "Customers", color: "#3b82f6" },
              revenue: { label: "Revenue", color: "#10b981" }
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryDistribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="industry" type="category" width={120} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="customers" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
