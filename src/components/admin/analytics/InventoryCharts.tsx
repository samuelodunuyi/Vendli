import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { SalesStatistics } from "@/redux/services/stores.services";

interface InventoryChartsProps {
  stats: SalesStatistics;
}

export function InventoryCharts({ stats }: InventoryChartsProps) {
  const labels = stats.inventoryValueTrend?.labels ?? [];
  const values = stats.inventoryValueTrend?.values ?? [];
  const data = labels.map((lbl, i) => ({
    name: lbl,
    totalValue: values[i] ?? 0,
  }));

  return (
    <div className="w-full overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Inventory Value Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <ChartContainer config={{}} className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: "Period", position: "bottom", offset: 10 }} tick={{ fontSize: 12 }} angle={-30} textAnchor="end" />
                <YAxis domain={[0, "auto"]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="totalValue" stroke="#3B82F6" strokeWidth={2} animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Low Stock & Stockouts</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-500">Low Stock Items</div>
                <div className="text-xl font-bold text-orange-600">{stats.lowStockProducts}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Out of Stock</div>
                <div className="text-xl font-bold text-red-600">{stats.outOfStockProducts}</div>
              </div>
            </div>
            <div style={{ height: 260 }}>
              <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[{ name: "Current", lowStock: stats.lowStockProducts ?? 0, stockouts: stats.outOfStockProducts ?? 0 }]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="lowStock" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="stockouts" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
