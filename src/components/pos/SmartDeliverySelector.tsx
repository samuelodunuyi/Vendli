
import { Truck, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface DeliveryRate {
  id: string;
  name: string;
  estimatedCost: number;
  estimatedTime: string;
}

interface SmartDeliverySelectorProps {
  selectedProvider: string;
  useSmartSelection: boolean;
  deliveryRates: DeliveryRate[];
  onProviderChange: (providerId: string) => void;
  onSmartSelectionToggle: (enabled: boolean) => void;
}

export function SmartDeliverySelector({
  selectedProvider,
  useSmartSelection,
  deliveryRates,
  onProviderChange,
  onSmartSelectionToggle
}: SmartDeliverySelectorProps) {
  if (deliveryRates.length === 0) return null;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Smart Delivery Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-select Best Provider</Label>
            <p className="text-sm text-gray-500">Use AI to select optimal delivery provider</p>
          </div>
          <Switch 
            checked={useSmartSelection}
            onCheckedChange={onSmartSelectionToggle}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="delivery-provider">Delivery Provider</Label>
            <Select value={selectedProvider} onValueChange={onProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {deliveryRates.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{provider.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className="text-xs">
                          ₦{provider.estimatedCost.toLocaleString()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {provider.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {useSmartSelection && deliveryRates.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <DollarSign className="h-4 w-4" />
              <span>
                Optimized: ₦{deliveryRates[0]?.estimatedCost.toLocaleString()} | {deliveryRates[0]?.estimatedTime}
              </span>
            </div>
          )}
        </div>
        
        {deliveryRates.length > 1 && (
          <div className="text-xs text-gray-500">
            Comparing {deliveryRates.length} providers • Best value automatically selected
          </div>
        )}
      </CardContent>
    </Card>
  );
}
