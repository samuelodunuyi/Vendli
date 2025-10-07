
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Star, Trophy, TrendingUp } from "lucide-react";

interface LoyaltyProgram {
  customerId: string;
  customerName: string;
  points: number;
  level: string;
  nextLevelPoints: number;
  availableRewards: Reward[];
  recentActivity: LoyaltyActivity[];
}

interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  type: "discount" | "freeItem" | "upgrade";
}

interface LoyaltyActivity {
  id: string;
  date: string;
  action: string;
  points: number;
}

interface LoyaltyProgramCardProps {
  loyalty: LoyaltyProgram;
  onApplyReward: (rewardId: string) => void;
}

export function LoyaltyProgramCard({ loyalty, onApplyReward }: LoyaltyProgramCardProps) {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "bronze": return "bg-amber-600";
      case "silver": return "bg-gray-400";
      case "gold": return "bg-yellow-500";
      case "platinum": return "bg-purple-600";
      default: return "bg-blue-600";
    }
  };

  const progressPercentage = (loyalty.points / loyalty.nextLevelPoints) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Loyalty Program - {loyalty.customerName}
          </CardTitle>
          <Badge className={`${getLevelColor(loyalty.level)} text-white`}>
            {loyalty.level} Member
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Points Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{loyalty.points}</div>
            <div className="text-sm text-gray-600">Current Points</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{loyalty.nextLevelPoints - loyalty.points}</div>
            <div className="text-sm text-gray-600">Points to Next Level</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Next Level</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Available Rewards */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Available Rewards
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {loyalty.availableRewards.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">{reward.name}</div>
                  <div className="text-xs text-gray-500">{reward.description}</div>
                  <div className="text-xs text-blue-600">{reward.pointsCost} points</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loyalty.points < reward.pointsCost}
                  onClick={() => onApplyReward(reward.id)}
                  className="ml-2"
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recent Activity
          </h4>
          <div className="space-y-1 max-h-24 overflow-y-auto text-xs">
            {loyalty.recentActivity.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex justify-between text-gray-600">
                <span>{activity.action}</span>
                <span className="text-green-600">+{activity.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
