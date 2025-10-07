
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, ShoppingCart, MapPin, Heart } from "lucide-react";
import { Store } from "@/types/store";

interface CustomerAnalyticsProps {
  stores: Store[];
}

const customerBehaviorData = [
  { store: "Victoria Island", newCustomers: 45, returningCustomers: 123, loyaltyMembers: 89, avgVisits: 3.2 },
  { store: "Ikeja", newCustomers: 38, returningCustomers: 98, loyaltyMembers: 67, avgVisits: 2.8 },
  { store: "Lekki", newCustomers: 42, returningCustomers: 87, loyaltyMembers: 56, avgVisits: 2.5 },
  { store: "Ajah", newCustomers: 29, returningCustomers: 72, loyaltyMembers: 45, avgVisits: 2.3 },
  { store: "Egbeda", newCustomers: 25, returningCustomers: 65, loyaltyMembers: 38, avgVisits: 2.1 }
];

const migrationData = [
  { from: "Victoria Island", to: "Lekki", customers: 23 },
  { from: "Ikeja", to: "Victoria Island", customers: 18 },
  { from: "Lekki", to: "Ajah", customers: 15 },
  { from: "Victoria Island", to: "Ikeja", customers: 12 },
  { from: "Ajah", to: "Lekki", customers: 10 }
];

const preferenceData = [
  { region: "Lagos Island", electronics: 45, fashion: 25, home: 20, sports: 10 },
  { region: "Lagos Mainland", electronics: 35, fashion: 30, home: 25, sports: 10 },
  { region: "Suburban", electronics: 25, fashion: 35, home: 30, sports: 10 }
];

const loyaltyTrends = [
  { month: "Jan", tier1: 450, tier2: 280, tier3: 120 },
  { month: "Feb", tier1: 485, tier2: 295, tier3: 135 },
  { month: "Mar", tier1: 520, tier2: 310, tier3: 145 },
  { month: "Apr", tier1: 545, tier2: 325, tier3: 158 },
  { month: "May", tier1: 580, tier2: 340, tier3: 170 },
  { month: "Jun", tier1: 615, tier2: 358, tier3: 185 }
];

const categoryColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export function CustomerAnalytics({ stores }: CustomerAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Analytics & Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="behavior" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="behavior">Customer Behavior</TabsTrigger>
            <TabsTrigger value="migration">Store Migration</TabsTrigger>
            <TabsTrigger value="preferences">Regional Preferences</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          </TabsList>

          <TabsContent value="behavior" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Acquisition</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={customerBehaviorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="store" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="newCustomers" fill="#3B82F6" name="New Customers" />
                      <Bar dataKey="returningCustomers" fill="#10B981" name="Returning Customers" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loyalty Membership by Store</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={customerBehaviorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="store" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="loyaltyMembers" fill="#8B5CF6" name="Loyalty Members" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Customer Behavior Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Behavior Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Store</th>
                        <th className="text-right p-3">New Customers</th>
                        <th className="text-right p-3">Returning</th>
                        <th className="text-right p-3">Loyalty Members</th>
                        <th className="text-right p-3">Avg Visits/Month</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerBehaviorData.map((store) => (
                        <tr key={store.store} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{store.store}</td>
                          <td className="p-3 text-right">{store.newCustomers}</td>
                          <td className="p-3 text-right">{store.returningCustomers}</td>
                          <td className="p-3 text-right">
                            <Badge variant="outline">{store.loyaltyMembers}</Badge>
                          </td>
                          <td className="p-3 text-right">{store.avgVisits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="migration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Migration Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Track how customers move between different store locations
                  </p>
                  {migrationData.map((migration, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">
                            {migration.from} → {migration.to}
                          </div>
                          <div className="text-sm text-gray-600">
                            Customer migration flow
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          {migration.customers} customers
                        </div>
                        <div className="text-sm text-gray-500">
                          This month
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regional Customer Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {preferenceData.map((region) => (
                    <div key={region.region} className="space-y-2">
                      <h4 className="font-medium">{region.region}</h4>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{region.electronics}%</div>
                          <div className="text-sm text-gray-600">Electronics</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{region.fashion}%</div>
                          <div className="text-sm text-gray-600">Fashion</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">{region.home}%</div>
                          <div className="text-sm text-gray-600">Home & Garden</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{region.sports}%</div>
                          <div className="text-sm text-gray-600">Sports</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loyalty Program Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={loyaltyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="tier1" stroke="#3B82F6" strokeWidth={2} name="Bronze Tier" />
                      <Line type="monotone" dataKey="tier2" stroke="#10B981" strokeWidth={2} name="Silver Tier" />
                      <Line type="monotone" dataKey="tier3" stroke="#F59E0B" strokeWidth={2} name="Gold Tier" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Loyalty Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-yellow-500" />
                        <span>Gold Tier</span>
                      </div>
                      <Badge variant="default">185 members</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span>Silver Tier</span>
                      </div>
                      <Badge variant="secondary">358 members</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-orange-400" />
                        <span>Bronze Tier</span>
                      </div>
                      <Badge variant="outline">615 members</Badge>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">1,158</div>
                        <div className="text-sm text-gray-600">Total Active Members</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
