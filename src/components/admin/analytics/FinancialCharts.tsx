import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  DailyReceiptsData,
  CashRemittanceData,
  TrendData,
} from "@/types/analytics";

interface FinancialChartsProps {
  revenueSourcesData: Array<{
    name: string;
    value: number;
    amount: number;
    color: string;
  }>;
  dailyReceiptsData: DailyReceiptsData[];
  trendData: TrendData[];
  cashRemittanceData: CashRemittanceData[];
}

const chartConfig = {
  sales: { label: "Sales", color: "#3B82F6" },
  orders: { label: "Orders", color: "#10B981" },
};

export function FinancialCharts({
  revenueSourcesData,
  dailyReceiptsData,
  trendData,
  cashRemittanceData,
}: FinancialChartsProps) {
  return (
    <div className="w-full space-y-6">
      {/* Revenue & Daily Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Sources */}
        <Card className="overflow-hidden shadow-md">
          <CardHeader>
            <CardTitle>Revenue by Sources</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueSourcesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {revenueSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Receipts */}
        <Card className="overflow-hidden shadow-md">
          <CardHeader>
            <CardTitle>Daily Receipts by Source</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyReceiptsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="inStore"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                    />
                    <Area
                      type="monotone"
                      dataKey="online"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                    />
                    <Area
                      type="monotone"
                      dataKey="wholesale"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Trend */}
      <Card className="overflow-hidden shadow-md">
        <CardHeader>
          <CardTitle>Financial Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-96 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cash Remittance */}
      <Card className="overflow-hidden shadow-md">
        <CardHeader>
          <CardTitle>Cash Remittance Status by Store</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-80 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cashRemittanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="store" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
