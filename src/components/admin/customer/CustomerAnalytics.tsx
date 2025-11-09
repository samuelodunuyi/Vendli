import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useGetCustomerAnalyticsQuery } from "@/redux/services/customer.services";

// ===== ENUM MAPPINGS =====
const CustomerClassificationColors = {
  Corporate: { label: "Corporate", color: "#3b82f6" },
  VIP: { label: "VIP", color: "#8b5cf6" },
  Regular: { label: "Regular", color: "#10b981" },
  "Walk-in": { label: "Walk-in", color: "#f59e0b" },
};

const LoyaltyTierColors = {
  Bronze: { label: "Bronze", color: "#a16207" },
  Silver: { label: "Silver", color: "#6b7280" },
  Gold: { label: "Gold", color: "#f59e0b" },
  Platinum: { label: "Platinum", color: "#14b8a6" },
};

interface CustomerAnalyticsProps {
  timeline?: string;
  storeId?: number;
  startDate?: string;
  endDate?: string;
}

export function CustomerAnalytics({
  timeline,
  storeId,
  startDate,
  endDate,
}: CustomerAnalyticsProps) {
  const { data, isLoading, isError } = useGetCustomerAnalyticsQuery({
    timeline,
    storeId,
    startDate,
    endDate,
  });

  if (isLoading) return <p>Loading analytics...</p>;
  if (isError || !data) return <p>Error loading analytics</p>;

  const customerClassificationData = data.demographics?.byClassification || [];
  const loyaltyTierData = data.demographics?.byLoyaltyTier || [];
  const customerAcquisitionData = data.customerAcquisitionTrend || [];

  const categoryDistributionFromAPI = data.financialMetrics;
  const categoryDistribution = [
    { category: "Total Revenue", value: categoryDistributionFromAPI.totalRevenue },
    { category: "Average Order Value", value: categoryDistributionFromAPI.averageOrderValue },
    { category: "Revenue per Customer", value: categoryDistributionFromAPI.revenuePerCustomer },
  ];

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* 1. Customer Classification Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Customer Classification</CardTitle>
          </CardHeader>
          <CardContent className="w-full overflow-hidden">
            <ChartContainer config={CustomerClassificationColors} className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerClassificationData}
                    dataKey="count"
                    nameKey="classification"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ classification, percent }) =>
                      `${classification} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {customerClassificationData.map((entry) => (
                      <Cell
                        key={entry.classification}
                        fill={CustomerClassificationColors[entry.classification]?.color ?? "#ccc"}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 2. Loyalty Tier Bar Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Loyalty Tier Performance</CardTitle>
          </CardHeader>
          <CardContent className="w-full overflow-hidden">
            <ChartContainer config={LoyaltyTierColors} className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loyaltyTierData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="loyaltyTier"
                    tickFormatter={(tier) => LoyaltyTierColors[tier]?.label ?? "Unknown"}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Customer Acquisition Trend */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Customer Acquisition Trend</CardTitle>
        </CardHeader>
        <CardContent className="w-full overflow-hidden">
          <ChartContainer
            config={{ newCustomers: { label: "New Customers", color: "#3b82f6" } }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerAcquisitionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="newCustomers" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 4. Financial Metrics (Bar Chart) */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Financial Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="w-full overflow-hidden">
          <ChartContainer
            config={{ value: { label: "Value", color: "#10b981" } }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
