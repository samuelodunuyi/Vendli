
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessCentralIntegration } from "./BusinessCentralIntegration";
import { DeliveryServicesSettings } from "./DeliveryServicesSettings";
import { OrganizationInfoCard } from "./settings/OrganizationInfoCard";
import { PaymentSettingsCard } from "./settings/PaymentSettingsCard";
import { PrinterSettingsCard } from "./settings/PrinterSettingsCard";
import { NotificationSettingsCard } from "./settings/NotificationSettingsCard";
import { SecuritySettingsCard } from "./settings/SecuritySettingsCard";
import { BackupExportCard } from "./settings/BackupExportCard";

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Services</TabsTrigger>
          <TabsTrigger value="integrations">ERP Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <OrganizationInfoCard />
          <PaymentSettingsCard />
          <PrinterSettingsCard />
          <NotificationSettingsCard />
          <SecuritySettingsCard />
          <BackupExportCard />
        </TabsContent>
        
        <TabsContent value="delivery">
          <DeliveryServicesSettings />
        </TabsContent>
        
        <TabsContent value="integrations">
          <BusinessCentralIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
