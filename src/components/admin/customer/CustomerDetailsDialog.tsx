
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Phone, Mail, MapPin, CreditCard, Calendar, TrendingUp } from "lucide-react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  classification: string;
  industryClass?: string;
  companyName?: string;
  preferredStore: string;
  loyaltyTier: string;
  loyaltyPoints: number;
  totalSpent: number;
  lastTransaction: string;
  kycStatus: string;
  status: string;
}

interface CustomerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

// Mock additional data for customer details
const mockCustomerTransactions = [
  { id: "TXN001", date: "2024-01-20", amount: 125000, items: "iPhone 15, Case", store: "Victoria Island" },
  { id: "TXN002", date: "2024-01-15", amount: 85000, items: "AirPods Pro", store: "Victoria Island" },
  { id: "TXN003", date: "2024-01-10", amount: 200000, items: "MacBook Air", store: "Ikeja" },
];

const mockLoyaltyActivity = [
  { date: "2024-01-20", action: "Purchase reward", points: 125 },
  { date: "2024-01-15", action: "Birthday bonus", points: 100 },
  { date: "2024-01-10", action: "Purchase reward", points: 200 },
];

export function CustomerDetailsDialog({ open, onOpenChange, customer }: CustomerDetailsDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details - {customer.firstName} {customer.lastName}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Customer Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                    {customer.companyName && (
                      <p className="text-sm text-muted-foreground">{customer.companyName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3" />
                    {customer.preferredStore}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant={customer.classification === 'corporate' ? 'default' : 
                                   customer.classification === 'vip' ? 'secondary' : 'outline'}>
                      {customer.classification}
                    </Badge>
                    <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                      {customer.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Customer Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-green-600">₦{customer.totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{customer.loyaltyPoints}</p>
                      <p className="text-sm text-muted-foreground">Loyalty Points</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Badge variant="outline">{customer.loyaltyTier}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Loyalty Tier</p>
                    </div>
                    <div>
                      <Badge variant={customer.kycStatus === 'verified' ? 'default' : 'secondary'}>
                        {customer.kycStatus}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">KYC Status</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Transaction</p>
                    <p className="text-sm text-muted-foreground">{customer.lastTransaction}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCustomerTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.id}</p>
                        <p className="text-sm text-muted-foreground">{transaction.items}</p>
                        <p className="text-xs text-muted-foreground">{transaction.store} Store</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">₦{transaction.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLoyaltyActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">+{activity.points} points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Preferred Store</p>
                    <p className="text-sm text-muted-foreground">{customer.preferredStore}</p>
                  </div>
                  <div>
                    <p className="font-medium">Communication Preferences</p>
                    <p className="text-sm text-muted-foreground">Email notifications: Enabled</p>
                    <p className="text-sm text-muted-foreground">SMS notifications: Enabled</p>
                  </div>
                  <div>
                    <p className="font-medium">Purchase Categories</p>
                    <p className="text-sm text-muted-foreground">Electronics (65%), Fashion (25%), Home & Garden (10%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
