import { useState } from "react";
import { AlertCircle, BarChart3, LayoutGrid, Plus, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CustomerOverview } from "./customer/CustomerOverview";
import { CustomerList } from "./customer/CustomerList";
import { CustomerAnalytics } from "./customer/CustomerAnalytics";
import { ComplaintsManagement } from "./customer/ComplaintsManagement";
import { CustomerFormDialog } from "./customer/CustomerFormDialog";

export function CustomerManagement() {
  const [tab, setTab] = useState("overview");
  const [adding, setAdding] = useState(false);

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="overview" className="gap-2"><LayoutGrid className="h-4 w-4" />Overview</TabsTrigger>
          <TabsTrigger value="customers" className="gap-2"><Users className="h-4 w-4" />Customers</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
          <TabsTrigger value="complaints" className="gap-2"><AlertCircle className="h-4 w-4" />Complaints</TabsTrigger>
        </TabsList>
        <Button onClick={() => setAdding(true)}><Plus className="mr-2 h-4 w-4" />Add customer</Button>
      </div>

      <TabsContent value="overview"><CustomerOverview /></TabsContent>
      <TabsContent value="customers"><CustomerList /></TabsContent>
      <TabsContent value="analytics"><CustomerAnalytics /></TabsContent>
      <TabsContent value="complaints"><ComplaintsManagement /></TabsContent>

      <CustomerFormDialog open={adding} onOpenChange={setAdding} onCustomerAdded={() => setTab("customers")} />
    </Tabs>
  );
}
