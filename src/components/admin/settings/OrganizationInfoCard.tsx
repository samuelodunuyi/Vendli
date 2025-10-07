
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";

export function OrganizationInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Organization Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="store-name">Organization Name</Label>
            <Input id="store-name" defaultValue="EasyShop POS" />
          </div>
          <div>
            <Label htmlFor="store-phone">Phone Number</Label>
            <Input id="store-phone" defaultValue="+234 801 234 5678" />
          </div>
        </div>
        
        <div>
          <Label htmlFor="store-address">Corporate Address</Label>
          <Input id="store-address" defaultValue="123 Allen Avenue, Ikeja, Lagos State" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="store-email">Email</Label>
            <Input id="store-email" defaultValue="info@easyshop.ng" />
          </div>
          <div>
            <Label htmlFor="tax-rate">VAT (%)</Label>
            <Input id="tax-rate" type="number" defaultValue="7.5" />
          </div>
        </div>
        
        <Button className="font-bold bg-blue-600 hover:bg-blue-700 text-white">
          Save Store Information
        </Button>
      </CardContent>
    </Card>
  );
}
