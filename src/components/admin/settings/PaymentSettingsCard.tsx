
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";

export function PaymentSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Accept Cash Payments</Label>
            <p className="text-sm text-gray-500">Enable cash payments at POS</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Accept Card Payments</Label>
            <p className="text-sm text-gray-500">Enable card payments via POS device</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Accept Bank Transfers</Label>
            <p className="text-sm text-gray-500">Enable bank transfer payments</p>
          </div>
          <Switch />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="merchant-id">Merchant ID</Label>
            <Input id="merchant-id" placeholder="Enter merchant ID" />
          </div>
          <div>
            <Label htmlFor="terminal-id">Terminal ID</Label>
            <Input id="terminal-id" placeholder="Enter terminal ID" />
          </div>
        </div>
        
        <Button className="font-bold bg-blue-600 hover:bg-blue-700 text-white">
          Save Payment Settings
        </Button>
      </CardContent>
    </Card>
  );
}
