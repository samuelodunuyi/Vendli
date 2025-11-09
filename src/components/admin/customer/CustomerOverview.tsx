import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Star, AlertCircle } from "lucide-react";
import { useGetCustomerAnalyticsQuery } from "@/redux/services/customer.services";

// ===== ENUM MAPPINGS =====
const CustomerClassificationEnum: Record<string, string> = {
  Corporate: "blue-600",
  VIP: "purple-600",
  Regular: "green-600",
  "Walk-in": "orange-600",
};

const LoyaltyTierEnum: Record<string, string> = {
  Bronze: "bg-yellow-100 text-yellow-800",
  Silver: "bg-gray-100 text-gray-800",
  Gold: "bg-yellow-200 text-yellow-900",
  Platinum: "bg-teal-100 text-teal-800",
};

interface CustomerOverviewProps {
  timeline?: string;
  storeId?: number;
  startDate?: string;
  endDate?: string;
}

export function CustomerOverview({ timeline, storeId, startDate, endDate }: CustomerOverviewProps) {
  const { data, isLoading, isError } = useGetCustomerAnalyticsQuery({ timeline, storeId, startDate, endDate });

  if (isLoading) return <p>Loading customer overview...</p>;
  if (isError || !data) return <p>Error loading customer overview</p>;

  const { demographics, activityMetrics, financialMetrics, topCustomersByLifetimeValue } = data;

  // Metrics
  const totalCustomers = demographics?.totalCustomers ?? 0;
  const newCustomersThisMonth = activityMetrics?.newCustomersInPeriod ?? 0;
  const activeCustomers = activityMetrics?.activeCustomers ?? 0;
  const customerRetentionRate = activityMetrics?.customerRetentionRate ?? 0;
  const averageLifetimeValue = financialMetrics?.revenuePerCustomer ?? 0;

  // Classification counts
  const classificationCounts = demographics?.byClassification ?? [];
  const recentCustomers = topCustomersByLifetimeValue ?? [];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{newCustomersThisMonth} new this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{customerRetentionRate.toFixed(2)}% retention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Revenue per Customer</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{averageLifetimeValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{/* Add complaints metrics if available */}</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Classification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classificationCounts.map((cls) => (
          <Card key={cls.classification}>
            <CardHeader>
              <CardTitle className="text-base">{cls.classification}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold text-${CustomerClassificationEnum[cls.classification]}`}>
                {cls.count.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                {((cls.count / totalCustomers) * 100).toFixed(2)}% of total customers
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent High-Value Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Recent High-Value Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCustomers.map((customer) => (
              <div key={customer.customerId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{customer.customerName}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                                                            <Badge variant={customer.customerClassification === 0 ? 'default' : 
                                   customer.customerClassification === 1 ? 'secondary' : 'outline'}>
                      {customer.customerClassification}
                    </Badge>
                    <Badge variant="outline">{customer.loyaltyTier}</Badge>
                  </div>
                  <div className="text-sm font-medium">₦{customer.totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{customer.lastTransactionDate}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
