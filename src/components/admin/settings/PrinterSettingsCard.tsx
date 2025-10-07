
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer } from "lucide-react";

export function PrinterSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Printer Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="printer-name">Receipt Printer</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select printer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thermal-80mm">Thermal Printer (80mm)</SelectItem>
              <SelectItem value="thermal-58mm">Thermal Printer (58mm)</SelectItem>
              <SelectItem value="default">Default System Printer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-print Receipts</Label>
            <p className="text-sm text-gray-500">Automatically print receipts after payment</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Print Company Logo</Label>
            <p className="text-sm text-gray-500">Include store logo on receipts</p>
          </div>
          <Switch />
        </div>
        
        <Button className="font-bold bg-blue-600 hover:bg-blue-700 text-white">
          Test Print
        </Button>
      </CardContent>
    </Card>
  );
}
