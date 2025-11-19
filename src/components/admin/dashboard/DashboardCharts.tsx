import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardChartsProps {
  salesData: { labels: string; values: number }[];
  retentionData: { name: string; value: number; color: string }[];
}

export function DashboardCharts({ salesData, retentionData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Sales Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales Chart</CardTitle>
        </CardHeader>

        <CardContent>
          <ChartContainer
            config={{
              sales: { label: "Sales", color: "#EF4444" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis dataKey="labels" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="values" fill="#EF4444" />
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
          <ChartContainer
            config={{
              retention: { label: "Retention", color: "#000" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={retentionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                >
                  {retentionData.map((item, index) => (
                    <Cell key={index} fill={item.color} />
                  ))}
                </Pie>

                {/* Tooltip MUST stay inside ChartContainer */}
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {retentionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}