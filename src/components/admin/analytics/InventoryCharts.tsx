import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { InventoryTrendData } from "@/types/analytics";

interface InventoryChartsProps {
  inventoryTrendData: InventoryTrendData[];
}

const chartConfig = {
  sales: { label: "Sales", color: "#3B82F6" },
  orders: { label: "Orders", color: "#10B981" },
};

export function InventoryCharts({ inventoryTrendData }: InventoryChartsProps) {
  return (
<div className="w-full overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Inventory Value Trend</CardTitle>
    </CardHeader>
    <CardContent className="p-2">
      <ChartContainer config={chartConfig} className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={inventoryTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{ value: "Period", position: "bottom", offset: 10 }}
              tick={{ fontSize: 12 }}
              angle={-30}
              textAnchor="end"
            />
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
      <CardTitle>Inventory Turnover & Stockouts</CardTitle>
    </CardHeader>
    <CardContent className="p-2">
      <ChartContainer config={chartConfig} className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={inventoryTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{ value: "Period", position: "bottom", offset: 10 }}
              tick={{ fontSize: 12 }}
              angle={-30}
              textAnchor="end"
            />
            <YAxis yAxisId="left" domain={[0, "auto"]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, "auto"]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} />
            <Bar yAxisId="left" dataKey="turnover" fill="#10B981" animationDuration={800} />
            <Bar yAxisId="right" dataKey="stockouts" fill="#EF4444" animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
</div>
  );
}
