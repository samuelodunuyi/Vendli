import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DigitalReceiptManager } from "./DigitalReceiptManager";
import { EnhancedOrderDetails } from "./EnhancedOrderDetails";
import { toast } from "@/components/ui/sonner";
import { Order, useGetLoyaltyActivityQuery } from "@/redux/services/orders.services";
import { skipToken } from "@reduxjs/toolkit/query/react";

interface EnhancedOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function EnhancedOrderDialog({ open, onOpenChange, order }: EnhancedOrderDialogProps) {
  const [activeTab, setActiveTab] = useState("details");

  // Always call hook; skip if order is null
  const { data: loyaltyData, isLoading: loyaltyLoading } = useGetLoyaltyActivityQuery(
    order ? { customer_id: order.customer.id } : skipToken
  );

  if (!order) return null;

  const handleApplyReward = (rewardId: string) => {
    toast.success(`Applied reward: ${rewardId}`);
  };

  const handleApplyPromotion = (promotionId: string) => {
    toast.success(`Applied personalized promotion to order`);
  };

  const handleSendReceipt = (method: "email" | "sms", details) => {
    console.log(`Sending receipt via ${method}:`, details);
    toast.success(`Digital receipt sent successfully via ${method.toUpperCase()}`);
  };

  // Filter loyalty activity for this specific order
  const orderLoyaltyActivity = loyaltyData?.filter(a => a.orderId === order.id) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enhanced Order Management - ORD-{order.id}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="receipt">Digital Receipt</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          {/* Order Details */}
          <TabsContent value="details" className="mt-4">
            <EnhancedOrderDetails order={order} />
          </TabsContent>

          {/* Digital Receipt */}
          <TabsContent value="receipt" className="mt-4">
            <DigitalReceiptManager
              orderId={order.id}
              customerEmail={order.customer.email}
              customerPhone={order.customer.phoneNumber}
              onSendReceipt={handleSendReceipt}
            />
          </TabsContent>

          {/* Engagement / Loyalty */}
          <TabsContent value="engagement" className="mt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Metrics */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Loyalty Points Balance:</span>
                    <span className="font-medium">{order.loyaltyPoints || 0} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Feedback:</span>
                    <span className="font-medium">{order.rating ? `${order.rating}/5 stars` : "None"}</span>
                  </div>
                </div>

                {/* Loyalty Activity */}
                <div className="space-y-2">
                  <h4 className="font-medium">Loyalty Activity for this Order</h4>
                  {loyaltyLoading ? (
                    <p className="text-sm text-muted-foreground">Loading loyalty activity...</p>
                  ) : orderLoyaltyActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No loyalty activity for this order.</p>
                  ) : (
                    orderLoyaltyActivity.map(a => (
                      <div key={a.id} className="flex justify-between p-3 border rounded-lg text-sm">
                        <div>
                          <p>{a.pointsEarned > 0 ? `+${a.pointsEarned} pts` : `-${a.pointsRedeemed} pts`}</p>
                          <p className="text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
