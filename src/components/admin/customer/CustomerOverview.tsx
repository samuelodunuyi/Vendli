
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Star, AlertCircle, Building, MapPin, Phone } from "lucide-react";

const mockMetrics = {
  totalCustomers: 15847,
  newCustomersThisMonth: 342,
  activeCustomers: 12456,
  customerRetentionRate: 87.5,
  averageLifetimeValue: 125000,
  complaintsThisMonth: 23,
  resolvedComplaints: 19,
  customerSatisfactionScore: 4.3,
};

const recentCustomers = [
  {
    id: "1",
    name: "Adebayo Ogundimu",
    email: "adebayo@company.com",
    classification: "corporate",
    totalSpent: 2500000,
    lastTransaction: "2024-01-20",
    loyaltyTier: "gold",
    preferredStore: "Victoria Island Store"
  },
  {
    id: "2", 
    name: "Fatima Ahmed",
    email: "fatima.ahmed@email.com",
    classification: "vip",
    totalSpent: 1850000,
    lastTransaction: "2024-01-19",
    loyaltyTier: "platinum",
    preferredStore: "Ikeja Store"
  },
  {
    id: "3",
    name: "Chidi Okwu",
    email: "chidi.okwu@gmail.com", 
    classification: "regular",
    totalSpent: 450000,
    lastTransaction: "2024-01-18",
    loyaltyTier: "silver",
    preferredStore: "Lekki Store"
  }
];

export function CustomerOverview() {
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{mockMetrics.newCustomersThisMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.activeCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockMetrics.customerRetentionRate}% retention rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Lifetime Value</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{mockMetrics.averageLifetimeValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Customer satisfaction: {mockMetrics.customerSatisfactionScore}/5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.complaintsThisMonth - mockMetrics.resolvedComplaints}</div>
            <p className="text-xs text-muted-foreground">
              {mockMetrics.resolvedComplaints} resolved this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Classification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Corporate Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">2,847</div>
            <p className="text-sm text-muted-foreground">18% of total customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">VIP Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">1,256</div>
            <p className="text-sm text-muted-foreground">8% of total customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Regular Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">9,847</div>
            <p className="text-sm text-muted-foreground">62% of total customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Walk-in Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600">1,897</div>
            <p className="text-sm text-muted-foreground">12% of total customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent High-Value Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Recent High-Value Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={customer.classification === 'corporate' ? 'default' : 
                                   customer.classification === 'vip' ? 'secondary' : 'outline'}>
                      {customer.classification}
                    </Badge>
                    <Badge variant="outline">{customer.loyaltyTier}</Badge>
                  </div>
                  <div className="text-sm font-medium">₦{customer.totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{customer.lastTransaction}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
