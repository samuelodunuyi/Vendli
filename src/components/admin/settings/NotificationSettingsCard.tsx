
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

export function NotificationSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Low Stock Alerts</Label>
            <p className="text-sm text-gray-500">Get notified when products are running low</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Daily Sales Reports</Label>
            <p className="text-sm text-gray-500">Receive daily sales summary via email</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>System Updates</Label>
            <p className="text-sm text-gray-500">Get notified about system updates</p>
          </div>
          <Switch />
        </div>
        
        <div>
          <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
          <Input id="low-stock-threshold" type="number" defaultValue="10" />
        </div>
      </CardContent>
    </Card>
  );
}
