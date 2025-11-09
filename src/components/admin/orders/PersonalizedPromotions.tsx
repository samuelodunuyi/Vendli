
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Target, Percent } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface PersonalizedPromotion {
  id: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed" | "bogo";
  discountValue: number;
  validUntil: string;
  targetProducts: string[];
  usageCount: number;
  maxUsage: number;
  customerSegment: string;
}

interface PersonalizedPromotionsProps {
  customerId: number;
  customerName: string;
  purchaseHistory: any[];
  onApplyPromotion: (promotionId: string) => void;
}

export function PersonalizedPromotions({ 
  customerId, 
  customerName, 
  purchaseHistory,
  onApplyPromotion 
}: PersonalizedPromotionsProps) {
  // Mock personalized promotions based on purchase history
  const [promotions] = useState<PersonalizedPromotion[]>([
    {
      id: "PROMO001",
      title: "Electronics Enthusiast Deal",
      description: "15% off on all electronics - Based on your recent purchases",
      discountType: "percentage",
      discountValue: 15,
      validUntil: "2024-01-31",
      targetProducts: ["electronics"],
      usageCount: 0,
      maxUsage: 3,
      customerSegment: "tech-lovers"
    },
    {
      id: "PROMO002", 
      title: "Loyal Customer Bonus",
      description: "₦5,000 off on orders above ₦25,000",
      discountType: "fixed",
      discountValue: 5000,
      validUntil: "2024-02-15",
      targetProducts: ["all"],
      usageCount: 1,
      maxUsage: 5,
      customerSegment: "vip"
    },
    {
      id: "PROMO003",
      title: "Fashion Friday Special",
      description: "Buy 2 Get 1 Free on fashion items",
      discountType: "bogo",
      discountValue: 1,
      validUntil: "2024-01-26",
      targetProducts: ["fashion", "clothing"],
      usageCount: 0,
      maxUsage: 2,
      customerSegment: "fashion-forward"
    }
  ]);

  const handleApplyPromotion = (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId);
    if (promotion) {
      onApplyPromotion(promotionId);
      toast.success(`Applied "${promotion.title}" to order`);
    }
  };

  const getDiscountDisplay = (promo: PersonalizedPromotion) => {
    switch (promo.discountType) {
      case "percentage":
        return `${promo.discountValue}% OFF`;
      case "fixed":
        return `₦${promo.discountValue.toLocaleString()} OFF`;
      case "bogo":
        return "BOGO";
      default:
        return "SPECIAL OFFER";
    }
  };

  const isExpiringSoon = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Personalized Offers for {customerName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {promotions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No personalized offers available</p>
            <p className="text-sm">Check back later for exclusive deals!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {promotions.map((promo) => (
              <div key={promo.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{promo.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {getDiscountDisplay(promo)}
                      </Badge>
                      {isExpiringSoon(promo.validUntil) && (
                        <Badge variant="destructive" className="text-xs">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{promo.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Valid until {new Date(promo.validUntil).toLocaleDateString()}
                      </div>
                      <div>
                        Used {promo.usageCount}/{promo.maxUsage}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={promo.usageCount >= promo.maxUsage}
                    onClick={() => handleApplyPromotion(promo.id)}
                    className="ml-2"
                  >
                    Apply
                  </Button>
                </div>
                
                {/* Progress bar for usage */}
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-purple-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(promo.usageCount / promo.maxUsage) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
