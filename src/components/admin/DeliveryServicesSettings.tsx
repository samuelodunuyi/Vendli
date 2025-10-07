
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Globe, MapPin, Settings, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

interface DeliveryProvider {
  id: string;
  name: string;
  type: 'local' | 'international' | 'custom';
  logo?: string;
  enabled: boolean;
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  baseUrl?: string;
  webhookUrl?: string;
  defaultService?: string;
  autoAssign?: boolean;
}

const predefinedProviders: DeliveryProvider[] = [
  {
    id: 'gig-logistics',
    name: 'GIG Logistics',
    type: 'local',
    enabled: false,
    defaultService: 'standard',
    autoAssign: false
  },
  {
    id: 'jumia-logistics',
    name: 'Jumia Logistics',
    type: 'local',
    enabled: false,
    defaultService: 'express',
    autoAssign: false
  },
  {
    id: 'kobo360',
    name: 'Kobo360',
    type: 'local',
    enabled: false,
    defaultService: 'freight',
    autoAssign: false
  },
  {
    id: 'red-star',
    name: 'Red Star Express',
    type: 'local',
    enabled: false,
    defaultService: 'next-day',
    autoAssign: false
  },
  {
    id: 'dhl',
    name: 'DHL Express',
    type: 'international',
    enabled: false,
    defaultService: 'international-express',
    autoAssign: false
  },
  {
    id: 'fedex',
    name: 'FedEx',
    type: 'international',
    enabled: false,
    defaultService: 'international-priority',
    autoAssign: false
  },
  {
    id: 'ups',
    name: 'UPS',
    type: 'international',
    enabled: false,
    defaultService: 'worldwide-express',
    autoAssign: false
  }
];

export function DeliveryServicesSettings() {
  const [providers, setProviders] = useState<DeliveryProvider[]>(predefinedProviders);
  const [activeProvider, setActiveProvider] = useState<string>('gig-logistics');

  const handleProviderToggle = (providerId: string, enabled: boolean) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, enabled } : p
    ));
    toast.success(`${enabled ? 'Enabled' : 'Disabled'} ${providers.find(p => p.id === providerId)?.name}`);
  };

  const handleProviderUpdate = (providerId: string, updates: Partial<DeliveryProvider>) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, ...updates } : p
    ));
  };

  const handleTestConnection = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider?.apiKey) {
      toast.error("Please configure API credentials first");
      return;
    }
    toast.success(`Testing connection to ${provider.name}...`);
    // Simulate API test
    setTimeout(() => {
      toast.success(`Connection to ${provider.name} successful!`);
    }, 2000);
  };

  const activeProviderData = providers.find(p => p.id === activeProvider);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Services Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Configure third-party delivery providers to automate order fulfillment and tracking.
          </p>
          
          <Tabs value={activeProvider} onValueChange={setActiveProvider} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="gig-logistics" className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Local Carriers
              </TabsTrigger>
              <TabsTrigger value="dhl" className="flex items-center gap-2">
                <Globe className="h-3 w-3" />
                International
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <Settings className="h-3 w-3" />
                Custom API
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Automation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gig-logistics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.filter(p => p.type === 'local').map(provider => (
                  <Card key={provider.id} className={provider.enabled ? 'border-green-200' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{provider.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {provider.enabled && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                          <Switch 
                            checked={provider.enabled}
                            onCheckedChange={(enabled) => handleProviderToggle(provider.id, enabled)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    {provider.enabled && (
                      <CardContent className="space-y-3">
                        <div>
                          <Label htmlFor={`${provider.id}-api-key`}>API Key</Label>
                          <Input 
                            id={`${provider.id}-api-key`}
                            type="password"
                            placeholder="Enter API key"
                            value={provider.apiKey || ''}
                            onChange={(e) => handleProviderUpdate(provider.id, { apiKey: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${provider.id}-merchant-id`}>Merchant ID</Label>
                          <Input 
                            id={`${provider.id}-merchant-id`}
                            placeholder="Enter merchant ID"
                            value={provider.merchantId || ''}
                            onChange={(e) => handleProviderUpdate(provider.id, { merchantId: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${provider.id}-service`}>Default Service</Label>
                          <Select 
                            value={provider.defaultService}
                            onValueChange={(value) => handleProviderUpdate(provider.id, { defaultService: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard Delivery</SelectItem>
                              <SelectItem value="express">Express Delivery</SelectItem>
                              <SelectItem value="next-day">Next Day Delivery</SelectItem>
                              <SelectItem value="same-day">Same Day Delivery</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Auto-assign Orders</Label>
                            <p className="text-xs text-gray-500">Automatically submit new orders</p>
                          </div>
                          <Switch 
                            checked={provider.autoAssign}
                            onCheckedChange={(autoAssign) => handleProviderUpdate(provider.id, { autoAssign })}
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleTestConnection(provider.id)}
                          className="w-full"
                        >
                          Test Connection
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dhl" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.filter(p => p.type === 'international').map(provider => (
                  <Card key={provider.id} className={provider.enabled ? 'border-blue-200' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{provider.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {provider.enabled && <Badge className="bg-blue-100 text-blue-800">Active</Badge>}
                          <Switch 
                            checked={provider.enabled}
                            onCheckedChange={(enabled) => handleProviderToggle(provider.id, enabled)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    {provider.enabled && (
                      <CardContent className="space-y-3">
                        <div>
                          <Label htmlFor={`${provider.id}-api-key`}>API Key</Label>
                          <Input 
                            id={`${provider.id}-api-key`}
                            type="password"
                            placeholder="Enter API key"
                            value={provider.apiKey || ''}
                            onChange={(e) => handleProviderUpdate(provider.id, { apiKey: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${provider.id}-secret`}>Secret Key</Label>
                          <Input 
                            id={`${provider.id}-secret`}
                            type="password"
                            placeholder="Enter secret key"
                            value={provider.secretKey || ''}
                            onChange={(e) => handleProviderUpdate(provider.id, { secretKey: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${provider.id}-account`}>Account Number</Label>
                          <Input 
                            id={`${provider.id}-account`}
                            placeholder="Enter account number"
                            value={provider.merchantId || ''}
                            onChange={(e) => handleProviderUpdate(provider.id, { merchantId: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${provider.id}-service`}>Default Service</Label>
                          <Select 
                            value={provider.defaultService}
                            onValueChange={(value) => handleProviderUpdate(provider.id, { defaultService: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="international-express">International Express</SelectItem>
                              <SelectItem value="international-priority">International Priority</SelectItem>
                              <SelectItem value="worldwide-express">Worldwide Express</SelectItem>
                              <SelectItem value="economy-select">Economy Select</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleTestConnection(provider.id)}
                          className="w-full"
                        >
                          Test Connection
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Delivery Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="custom-name">Provider Name</Label>
                      <Input id="custom-name" placeholder="Enter provider name" />
                    </div>
                    <div>
                      <Label htmlFor="custom-type">Provider Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local Carrier</SelectItem>
                          <SelectItem value="international">International Carrier</SelectItem>
                          <SelectItem value="specialty">Specialty Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">API Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="custom-base-url">Base URL</Label>
                        <Input id="custom-base-url" placeholder="https://api.provider.com" />
                      </div>
                      <div>
                        <Label htmlFor="custom-api-key">API Key</Label>
                        <Input id="custom-api-key" type="password" placeholder="Enter API key" />
                      </div>
                      <div>
                        <Label htmlFor="custom-webhook">Webhook URL</Label>
                        <Input id="custom-webhook" placeholder="https://yourstore.com/webhook" />
                      </div>
                      <div>
                        <Label htmlFor="custom-auth">Authentication Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select auth type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="api-key">API Key</SelectItem>
                            <SelectItem value="bearer">Bearer Token</SelectItem>
                            <SelectItem value="basic">Basic Auth</SelectItem>
                            <SelectItem value="oauth">OAuth 2.0</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="font-bold bg-blue-600 hover:bg-blue-700 text-white">
                    Add Custom Provider
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Automation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-submit Orders</Label>
                      <p className="text-sm text-gray-500">Automatically submit new orders to delivery providers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Real-time Status Updates</Label>
                      <p className="text-sm text-gray-500">Enable webhook updates from delivery providers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rate Comparison</Label>
                      <p className="text-sm text-gray-500">Compare rates across providers before assignment</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="sync-interval">Status Sync Interval</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="60">Every 1 hour</SelectItem>
                          <SelectItem value="240">Every 4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fallback-provider">Fallback Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fallback" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gig-logistics">GIG Logistics</SelectItem>
                          <SelectItem value="red-star">Red Star Express</SelectItem>
                          <SelectItem value="manual">Manual Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Smart Provider Selection</Label>
                      <p className="text-sm text-gray-500">Automatically choose the best provider based on cost and delivery time</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cost-weight">Cost Weight (%)</Label>
                      <Input id="cost-weight" type="number" defaultValue="60" min="0" max="100" />
                    </div>
                    <div>
                      <Label htmlFor="speed-weight">Speed Weight (%)</Label>
                      <Input id="speed-weight" type="number" defaultValue="40" min="0" max="100" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="max-cost">Maximum Cost per Delivery (₦)</Label>
                    <Input id="max-cost" type="number" placeholder="5000" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
