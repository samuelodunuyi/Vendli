
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, TrendingUp, Star, AlertCircle } from "lucide-react";
import { CustomerOverview } from "./customer/CustomerOverview";
import { CustomerList } from "./customer/CustomerList";
import { CustomerAnalytics } from "./customer/CustomerAnalytics";
import { ComplaintsManagement } from "./customer/ComplaintsManagement";
import { AddCustomerDialog } from "./customer/AddCustomerDialog";
import { toast } from "@/components/ui/sonner";

export function CustomerManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleCustomerAdded = () => {
    toast.success("Customer list updated");
    // Switch to customers tab to show the updated list
    setActiveTab("customers");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Customer
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Customer List
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Complaints
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CustomerOverview />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerList />
        </TabsContent>

        <TabsContent value="analytics">
          <CustomerAnalytics />
        </TabsContent>

        <TabsContent value="complaints">
          <ComplaintsManagement />
        </TabsContent>
      </Tabs>

      <AddCustomerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  );
}
