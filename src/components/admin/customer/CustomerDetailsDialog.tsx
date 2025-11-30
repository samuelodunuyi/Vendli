import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Phone, Mail, MapPin, TrendingUp } from "lucide-react";
import { Customer } from "@/redux/services/customer.services";
import { useGetOrdersQuery, useGetLoyaltyActivityQuery } from "@/redux/services/orders.services";
import { skipToken } from "@reduxjs/toolkit/query/react";

interface CustomerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

// Enums
const CustomerClassificationEnum = { 0: "Corporate", 1: "VIP", 2: "Regular", 3: "Walk-in" } as const;
const CustomerStatusEnum = { 0: "Inactive", 1: "Active", 2: "Suspended" } as const;
const LoyaltyTierEnum = { 0: "Bronze", 1: "Silver", 2: "Gold", 3: "Platinum" } as const;
const KycStatusEnum = { 0: "Pending", 1: "Verified", 2: "Rejected" } as const;

// Badge variants
const classificationBadgeVariant = { 0: "default", 1: "secondary", 2: "outline", 3: "outline" };
const statusBadgeVariant = { 0: "secondary", 1: "default", 2: "destructive" };
const loyaltyTierBadgeVariant = { 0: "outline", 1: "secondary", 2: "default", 3: "default" };
const kycStatusBadgeVariant = { 0: "secondary", 1: "default", 2: "destructive" };

export function CustomerDetailsDialog({ open, onOpenChange, customer }: CustomerDetailsDialogProps) {
  // Always call hooks
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({});
  const { data: loyaltyData, isLoading: loyaltyLoading } = useGetLoyaltyActivityQuery(
    customer ? { customer_id: customer.id } : skipToken
  );

  if (!customer) return null;

  // Compute total loyalty points for the tab
  const totalPointsEarned = loyaltyData?.reduce((sum, a) => sum + (a.pointsEarned || 0), 0) ?? 0;
  const totalPointsRedeemed = loyaltyData?.reduce((sum, a) => sum + (a.pointsRedeemed || 0), 0) ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Customer Details - {customer.userInfo.firstName} {customer.userInfo.lastName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{customer.userInfo.firstName} {customer.userInfo.lastName}</p>
                    {customer.companyName && <p className="text-sm text-muted-foreground">{customer.companyName}</p>}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3" /> {customer.userInfo.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3" /> {customer.userInfo.phoneNumber}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3" /> {customer.preferredStore}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant={classificationBadgeVariant[customer.customerClassification]}>
                      {CustomerClassificationEnum[customer.customerClassification]}
                    </Badge>
                    <Badge variant={statusBadgeVariant[customer.customerStatus]}>
                      {CustomerStatusEnum[customer.customerStatus]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Customer Metrics
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
                      <Badge variant={loyaltyTierBadgeVariant[customer.loyaltyTier]}>
                        {LoyaltyTierEnum[customer.loyaltyTier]}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">Loyalty Tier</p>
                    </div>
                    <div>
                      <Badge variant={kycStatusBadgeVariant[customer.kycStatus]}>
                        {KycStatusEnum[customer.kycStatus]}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">KYC Status</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Transaction</p>
                    <p className="text-sm text-muted-foreground">{customer.lastTransactionDate || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <p className="text-sm text-muted-foreground">Loading transactions...</p>
                ) : !ordersData?.orders?.length ? (
                  <p className="text-sm text-muted-foreground">No transactions found.</p>
                ) : (
                  <div className="space-y-4">
                    {ordersData.orders
                      ?.filter((order) => order?.customer?.id === customer?.id)
                      .map((order) => (
                        <div key={order.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm">Order #{order.id}</p>
                              <p className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{order.store?.storeName}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">
                                ₦
                                {order.orderItems
                                  ?.reduce((sum, item) => sum + item.priceAtOrder * item.quantity, 0)
                                  .toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-3 border-t pt-3 space-y-2">
                            {order.orderItems?.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                  <img src={item.productImageUrl} alt={item.productName} className="w-10 h-10 rounded object-cover" />
                                  <div>
                                    <p className="font-medium">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground">{item.quantity} × ₦{item.priceAtOrder.toLocaleString()}</p>
                                  </div>
                                </div>
                                <p className="font-semibold">₦{(item.priceAtOrder * item.quantity).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program Activity</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Earned: {totalPointsEarned} pts | Total Redeemed: {totalPointsRedeemed} pts
                </p>
              </CardHeader>
              <CardContent>
                {loyaltyLoading ? (
                  <p className="text-sm text-muted-foreground">Loading loyalty activity...</p>
                ) : !loyaltyData?.length ? (
                  <p className="text-sm text-muted-foreground">No loyalty activity found.</p>
                ) : (
                  <div className="space-y-4">
                    {loyaltyData.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{activity.orderId}</p>
                          <p className="text-sm text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">
                            +{activity.pointsEarned} / -{activity.pointsRedeemed} pts
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
