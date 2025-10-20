
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, Settings, Database } from "lucide-react";
import { BusinessCentralConfig, SyncStatus, SyncSettings } from "@/types/businessCentral";
import { businessCentralService } from "@/redux/services/businessCentralService";
import { toast } from "@/components/ui/sonner";

export function BusinessCentralIntegration() {
  const [config, setConfig] = useState<BusinessCentralConfig>({
    tenantId: "",
    clientId: "",
    clientSecret: "",
    baseUrl: "https://api.businesscentral.dynamics.com/v2.0",
    companyId: "",
    environment: "sandbox"
  });

  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    autoSync: false,
    syncInterval: 30,
    syncInventory: true,
    syncSalesOrders: true,
    syncInvoices: true,
    syncReceipts: true,
    syncBankDeposits: true
  });

  const [syncStatus, setSyncStatus] = useState<Record<string, SyncStatus>>({
    inventory: { lastSync: "Never", status: "never" },
    salesOrders: { lastSync: "Never", status: "never" },
    invoices: { lastSync: "Never", status: "never" },
    receipts: { lastSync: "Never", status: "never" },
    bankDeposits: { lastSync: "Never", status: "never" }
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      businessCentralService.setConfig(config);
      const authenticated = await businessCentralService.authenticate();
      
      if (authenticated) {
        const connectionTest = await businessCentralService.testConnection();
        if (connectionTest) {
          setIsConnected(true);
          toast.success("Successfully connected to Business Central");
        } else {
          toast.error("Failed to connect to Business Central");
        }
      } else {
        toast.error("Authentication failed");
      }
    } catch (error) {
      toast.error("Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async (syncType: string) => {
    setIsSyncing(prev => ({ ...prev, [syncType]: true }));
    
    try {
      let result: SyncStatus;
      
      switch (syncType) {
        case 'inventory':
          result = await businessCentralService.syncInventory();
          break;
        case 'salesOrders':
          result = await businessCentralService.syncSalesOrders([]);
          break;
        case 'invoices':
          result = await businessCentralService.syncInvoices();
          break;
        case 'receipts':
          result = await businessCentralService.syncReceipts();
          break;
        case 'bankDeposits':
          result = await businessCentralService.syncBankDeposits();
          break;
        default:
          throw new Error("Unknown sync type");
      }

      setSyncStatus(prev => ({ ...prev, [syncType]: result }));
      
      if (result.status === 'success') {
        toast.success(`${syncType} synced successfully (${result.recordsAffected} records)`);
      } else {
        toast.error(`${syncType} sync failed: ${result.message}`);
      }
    } catch (error) {
      toast.error(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSyncing(prev => ({ ...prev, [syncType]: false }));
    }
  };

  const handleSyncAll = async () => {
    const syncTypes = ['inventory', 'salesOrders', 'invoices', 'receipts', 'bankDeposits'];
    
    for (const syncType of syncTypes) {
      if (syncSettings[`sync${syncType.charAt(0).toUpperCase() + syncType.slice(1)}` as keyof SyncSettings]) {
        await handleSync(syncType);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Connection Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Business Central Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Connection Status</p>
              <p className="text-sm text-gray-500">
                {isConnected ? "Connected to Business Central" : "Not connected"}
              </p>
            </div>
            {getStatusBadge(isConnected ? 'success' : 'error')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenant-id">Tenant ID</Label>
              <Input
                id="tenant-id"
                value={config.tenantId}
                onChange={(e) => setConfig(prev => ({ ...prev, tenantId: e.target.value }))}
                placeholder="Enter your Azure AD tenant ID"
              />
            </div>
            <div>
              <Label htmlFor="client-id">Client ID</Label>
              <Input
                id="client-id"
                value={config.clientId}
                onChange={(e) => setConfig(prev => ({ ...prev, clientId: e.target.value }))}
                placeholder="Enter your app registration client ID"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="client-secret">Client Secret</Label>
            <Input
              id="client-secret"
              type="password"
              value={config.clientSecret}
              onChange={(e) => setConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
              placeholder="Enter your app registration client secret"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-id">Company ID</Label>
              <Input
                id="company-id"
                value={config.companyId}
                onChange={(e) => setConfig(prev => ({ ...prev, companyId: e.target.value }))}
                placeholder="Enter your Business Central company ID"
              />
            </div>
            <div>
              <Label htmlFor="environment">Environment</Label>
              <Select
                value={config.environment}
                onValueChange={(value: 'sandbox' | 'production') => 
                  setConfig(prev => ({ ...prev, environment: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleConnect}
            disabled={isConnecting || !config.tenantId || !config.clientId}
            className="font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isConnecting ? "Connecting..." : isConnected ? "Reconnect" : "Connect to Business Central"}
          </Button>
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sync Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Sync</Label>
              <p className="text-sm text-gray-500">Automatically sync data at regular intervals</p>
            </div>
            <Switch
              checked={syncSettings.autoSync}
              onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, autoSync: checked }))}
            />
          </div>

          {syncSettings.autoSync && (
            <div>
              <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
              <Select
                value={syncSettings.syncInterval.toString()}
                onValueChange={(value) => setSyncSettings(prev => ({ ...prev, syncInterval: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Data Types to Sync</h4>
            
            {[
              { key: 'syncInventory', label: 'Inventory/Items', description: 'Product catalog and stock levels' },
              { key: 'syncSalesOrders', label: 'Sales Orders', description: 'POS transactions as sales orders' },
              { key: 'syncInvoices', label: 'Invoices', description: 'Customer invoices and billing' },
              { key: 'syncReceipts', label: 'Receipts', description: 'Payment receipts and transactions' },
              { key: 'syncBankDeposits', label: 'Bank Deposits', description: 'Daily cash deposits' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <Label>{item.label}</Label>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <Switch
                  checked={syncSettings[item.key as keyof SyncSettings] as boolean}
                  onCheckedChange={(checked) => 
                    setSyncSettings(prev => ({ ...prev, [item.key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Status & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Synchronization Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={handleSyncAll}
              disabled={!isConnected || Object.values(isSyncing).some(Boolean)}
              className="font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync All
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { key: 'inventory', label: 'Inventory' },
              { key: 'salesOrders', label: 'Sales Orders' },
              { key: 'invoices', label: 'Invoices' },
              { key: 'receipts', label: 'Receipts' },
              { key: 'bankDeposits', label: 'Bank Deposits' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(syncStatus[item.key]?.status || 'never')}
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-500">
                      Last sync: {
                        syncStatus[item.key]?.lastSync === 'Never' 
                          ? 'Never' 
                          : new Date(syncStatus[item.key]?.lastSync || '').toLocaleString()
                      }
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSync(item.key)}
                  disabled={!isConnected || isSyncing[item.key]}
                  className="font-bold border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  {isSyncing[item.key] ? "Syncing..." : "Sync Now"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
