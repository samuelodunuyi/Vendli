import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { RetentionRate, SalesChart } from "@/redux/services/stores.services";
import { formatCompactCurrency } from "@/lib/format";

const RETENTION_COLORS = ["hsl(var(--primary))", "hsl(142 70% 45%)"];

export function DashboardCharts({ sales, retention }: { sales: SalesChart; retention: RetentionRate }) {
  const salesData = sales.labels.map((label, i) => ({ label, revenue: sales.values[i] ?? 0 }));
  const retentionData = retention.labels.map((name, i) => ({ name, value: retention.values[i] ?? 0 }));
  const customers = retentionData.reduce((s, r) => s + r.value, 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-base">Revenue</CardTitle></CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }} className="h-[260px] w-full sm:h-[300px]">
            <BarChart data={salesData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={16} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} width={56} fontSize={12} tickFormatter={(v) => formatCompactCurrency(v)} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatCompactCurrency(Number(v))} />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Customer retention</CardTitle></CardHeader>
        <CardContent>
          {customers === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No identified customers in this period.</p>
          ) : (
            <>
              <ChartContainer config={{ value: { label: "Customers" } }} className="mx-auto h-[200px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={retentionData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                    {retentionData.map((_, i) => <Cell key={i} fill={RETENTION_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-2 flex justify-center gap-6 text-sm">
                {retentionData.map((r, i) => (
                  <span key={r.name} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: RETENTION_COLORS[i] }} />
                    {r.name} <span className="font-semibold">{r.value}</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
