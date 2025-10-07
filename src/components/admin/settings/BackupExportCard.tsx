
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download } from "lucide-react";

export function BackupExportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Backup & Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="font-bold border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
            Export Sales Data
          </Button>
          <Button variant="outline" className="font-bold border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
            Export Inventory
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Automatic Daily Backup</Label>
            <p className="text-sm text-gray-500">Automatically backup data daily</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <Button className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white">
          Create Manual Backup
        </Button>
      </CardContent>
    </Card>
  );
}
