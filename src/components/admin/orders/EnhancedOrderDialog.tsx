
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DigitalReceiptManager } from "./DigitalReceiptManager";
import { EnhancedOrderDetails } from "./EnhancedOrderDetails";
import { toast } from "@/components/ui/sonner";
import { Order } from "@/redux/services/orders.services";

interface EnhancedOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

// Mock loyalty data
const mockLoyaltyData = {
  customerId: "CUST001",
  customerName: "Adebayo Johnson",
  points: 1250,
  level: "Gold",
  nextLevelPoints: 2000,
  availableRewards: [
    {
      id: "REW001",
      name: "10% Off Next Purchase",
      pointsCost: 500,
      description: "Get 10% discount on your next order",
      type: "discount" as const
    },
    {
      id: "REW002", 
      name: "Free Delivery",
      pointsCost: 200,
      description: "Free delivery on your next order",
      type: "upgrade" as const
    },
    {
      id: "REW003",
      name: "Complimentary Gift Wrap",
      pointsCost: 100,
      description: "Free gift wrapping service",
      type: "upgrade" as const
    }
  ],
  recentActivity: [
    { id: "ACT001", date: "2023-12-15", action: "Purchase reward", points: 75 },
    { id: "ACT002", date: "2023-12-10", action: "Birthday bonus", points: 100 },
    { id: "ACT003", date: "2023-12-05", action: "Review submitted", points: 25 }
  ]
};

export function EnhancedOrderDialog({ open, onOpenChange, order }: EnhancedOrderDialogProps) {
  const [activeTab, setActiveTab] = useState("details");

  if (!order) return null;

  const handleApplyReward = (rewardId: string) => {
    const reward = mockLoyaltyData.availableRewards.find(r => r.id === rewardId);
    if (reward) {
      toast.success(`Applied reward: ${reward.name}`);
    }
  };

  const handleApplyPromotion = (promotionId: string) => {
    toast.success(`Applied personalized promotion to order`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSendReceipt = (method: "email" | "sms", details: any) => {
    console.log(`Sending receipt via ${method}:`, details);
    toast.success(`Digital receipt sent successfully via ${method.toUpperCase()}`);
  };

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

          <TabsContent value="details" className="mt-4">
            <EnhancedOrderDetails order={order} />
          </TabsContent>

          <TabsContent value="receipt" className="mt-4">
            <DigitalReceiptManager
              orderId={order.id}
              customerEmail={order.customer.email}
              customerPhone={order.customer.phoneNumber}
              onSendReceipt={handleSendReceipt}
            />
          </TabsContent>

          <TabsContent value="engagement" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Customer Engagement Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Loyalty Points Balance:</span>
                    <span className="font-medium">{order.loyaltyPoints || 0} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Promotions:</span>
                    <span className="font-medium">{order.hasActivePromotions ? "Active offers" : "None"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Feedback:</span>
                    <span className="font-medium">{order.rating ? `${order.rating}/5 stars` : "None"}</span>
                  </div>
                </div>
              </div>
              
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
