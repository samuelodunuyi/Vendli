
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const salesData = [
  { month: "Jan", sales: 65 },
  { month: "Feb", sales: 45 },
  { month: "Mar", sales: 85 },
  { month: "Apr", sales: 70 },
  { month: "May", sales: 75 },
  { month: "Jun", sales: 72 },
  { month: "Jul", sales: 78 },
  { month: "Aug", sales: 95 },
  { month: "Sep", sales: 88 },
  { month: "Oct", sales: 60 },
  { month: "Nov", sales: 82 },
  { month: "Dec", sales: 90 }
];

const retentionData = [
  { name: "New Customers", value: 40, color: "#10B981" },
  { name: "Returning Customers", value: 60, color: "#8B5CF6" }
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#EF4444",
  },
};

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sales Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Retention Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Retention Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={retentionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {retentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">New Customers</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm">Returning Customers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
