import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { SalesStatistics } from "@/redux/services/stores.services";

interface FinancialChartsProps {
  stats: SalesStatistics;
}

export function FinancialCharts({ stats }: FinancialChartsProps) {
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const revenueByCategory = (stats.salesByCategory ?? []).map((s) => ({
    name: s.categoryName,
    value: s.totalAmount ?? s.totalSales ?? 0,
    percent: 0,
  }));

  const receiptsTrend = (stats.salesTrend?.labels ?? []).map((label, idx) => ({
    name: label,
    inStore: stats.salesTrend?.values?.[idx] ?? 0,
  }));

  const remittanceData = (stats.cashRemittanceByStore ?? []).map((c) => ({
    store: c.storeName,
    amount: c.amount,
  }));

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden shadow-md">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full">
              <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md">
          <CardHeader>
            <CardTitle>Daily/Period Receipts</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full">
              <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={receiptsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="inStore" stackId="1" stroke={colors[0]} fill={colors[0]} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-md">
        <CardHeader>
          <CardTitle>Cash Remittance by Store</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-80 w-full">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={remittanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="store" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill={colors[1]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
