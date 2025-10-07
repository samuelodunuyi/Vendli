import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  GitCompare, 
  Truck,
  BarChart3,
  Bell,
  Users,
  TrendingUp,
  Package
} from "lucide-react";
import { Store } from "@/types/store";
import { useStoreManagement } from "@/hooks/useStoreManagement";
import { StoreComparison } from "./store/StoreComparison";
import { InventoryTransfer } from "./store/InventoryTransfer";
import { StoreAlerts } from "./store/StoreAlerts";
import { AddStoreDialog } from "./store/AddStoreDialog";
import { EditStoreDialog } from "./store/EditStoreDialog";
import { ManageStaffDialog } from "./store/ManageStaffDialog";
import { StoreAnalyticsDialog } from "./store/StoreAnalyticsDialog";
import { StoreOverviewTab } from "./store/StoreOverviewTab";
import { StoreNetworkStats } from "./store/StoreNetworkStats";
import { StoreTransfersTab } from "./store/StoreTransfersTab";
import { BulkOperations } from "./store/BulkOperations";
import { AdvancedReporting } from "./store/AdvancedReporting";
import { RealTimeNotifications } from "./store/RealTimeNotifications";
import { CustomerAnalytics } from "./store/CustomerAnalytics";
import { EnhancedStaffManagement } from "./store/EnhancedStaffManagement";
import { WorkflowGuide } from "@/components/WorkflowGuide";
import { inventoryAdjustmentSteps } from "@/data/workflows";

const mockStores: Store[] = [
  {
    id: "store1",
    name: "Victoria Island Store",
    location: "1004 Victoria Island, Lagos",
    manager: "Adebayo Ogundimu",
    phone: "+234 901 234 5678",
    email: "vi.store@company.com",
    status: "active",
    openingDate: "2020-01-15",
    totalSales: 45000000,
    monthlyRevenue: 3750000,
  },
  {
    id: "store2",
    name: "Ikeja Store",
    location: "Allen Avenue, Ikeja, Lagos",
    manager: "Fatima Ahmed",
    phone: "+234 902 345 6789",
    email: "ikeja.store@company.com",
    status: "active",
    openingDate: "2021-03-20",
    totalSales: 32000000,
    monthlyRevenue: 2800000,
  },
  {
    id: "store3",
    name: "Lekki Store",
    location: "Phase 1, Lekki, Lagos",
    manager: "Chidi Okwu",
    phone: "+234 903 456 7890",
    email: "lekki.store@company.com",
    status: "active",
    openingDate: "2022-06-10",
    totalSales: 28000000,
    monthlyRevenue: 2400000,
  },
  {
    id: "store4",
    name: "Ajah Store",
    location: "Ajah, Lagos",
    manager: "Blessing Nwosu",
    phone: "+234 904 567 8901",
    email: "ajah.store@company.com",
    status: "active",
    openingDate: "2022-08-15",
    totalSales: 25000000,
    monthlyRevenue: 2100000,
  },
  {
    id: "store5",
    name: "Egbeda Store",
    location: "Egbeda, Lagos",
    manager: "Ibrahim Lawal",
    phone: "+234 905 678 9012",
    email: "egbeda.store@company.com",
    status: "active",
    openingDate: "2023-01-10",
    totalSales: 18000000,
    monthlyRevenue: 1500000,
  }
];

export function EnhancedStoreManagement() {
  const {
    activeStoreId,
    compareMode,
    selectedStoresForComparison,
    showTransferDialog,
    setShowTransferDialog,
    showStaffDialog,
    setShowStaffDialog,
    showAddStoreDialog,
    setShowAddStoreDialog,
    showEditStoreDialog,
    setShowEditStoreDialog,
    showAnalyticsDialog,
    setShowAnalyticsDialog,
    selectedStoreForEdit,
    mockTransfers,
    mockAlerts,
    handleStoreSwitch,
    toggleCompareMode,
    handleStoreSelect,
    initiateTransfer,
    handleEditStore,
    handleViewAnalytics,
    getStoreName
  } = useStoreManagement();

  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  const activeStore = mockStores.find(store => store.id === activeStoreId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advanced Multi-Store Management</h2>
        <div className="flex gap-2">
          <Button 
            variant={compareMode ? "default" : "outline"} 
            onClick={toggleCompareMode}
            className="flex items-center gap-2"
          >
            <GitCompare className="h-4 w-4" />
            {compareMode ? "Exit Compare" : "Compare Stores"}
          </Button>
          <Button 
            onClick={() => setShowTransferDialog(true)}
            className="flex items-center gap-2"
          >
            <Truck className="h-4 w-4" />
            Manage Transfers
          </Button>
          <Button 
            onClick={() => setShowWorkflowGuide(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Workflow Guide
          </Button>
          <Button 
            onClick={() => setShowAddStoreDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Store
          </Button>
        </div>
      </div>

      {compareMode && (
        <StoreComparison 
          selectedStores={selectedStoresForComparison}
          onClose={() => toggleCompareMode()}
        />
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts 
            {mockAlerts.filter(a => !a.resolved).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {mockAlerts.filter(a => !a.resolved).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="bulk">Bulk Ops</TabsTrigger>
          <TabsTrigger value="reporting">Reports</TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-1" />
            Live
          </TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StoreOverviewTab
            stores={mockStores}
            activeStore={activeStore}
            activeStoreId={activeStoreId}
            compareMode={compareMode}
            selectedStoresForComparison={selectedStoresForComparison}
            onStoreSwitch={handleStoreSwitch}
            onStoreSelect={handleStoreSelect}
            onEditStore={handleEditStore}
            onViewAnalytics={handleViewAnalytics}
            onManageStaff={() => setShowStaffDialog(true)}
          />
        </TabsContent>

        <TabsContent value="alerts">
          <StoreAlerts alerts={mockAlerts} />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkOperations stores={mockStores} />
        </TabsContent>

        <TabsContent value="reporting">
          <AdvancedReporting stores={mockStores} />
        </TabsContent>

        <TabsContent value="notifications">
          <RealTimeNotifications />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerAnalytics stores={mockStores} />
        </TabsContent>

        <TabsContent value="staff">
          <EnhancedStaffManagement stores={mockStores} />
        </TabsContent>

        <TabsContent value="analytics">
          <StoreNetworkStats stores={mockStores} />
        </TabsContent>
      </Tabs>

      {/* All Dialog Components */}
      <AddStoreDialog
        open={showAddStoreDialog}
        onOpenChange={setShowAddStoreDialog}
      />

      <EditStoreDialog
        open={showEditStoreDialog}
        onOpenChange={setShowEditStoreDialog}
        storeId={selectedStoreForEdit}
      />

      <ManageStaffDialog
        open={showStaffDialog}
        onOpenChange={setShowStaffDialog}
        storeId={activeStoreId}
        storeName={getStoreName(activeStoreId)}
      />

      <StoreAnalyticsDialog
        open={showAnalyticsDialog}
        onOpenChange={setShowAnalyticsDialog}
        storeId={activeStoreId}
        storeName={getStoreName(activeStoreId)}
      />

      <InventoryTransfer
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
        transfers={mockTransfers}
        onInitiateTransfer={initiateTransfer}
      />

      <WorkflowGuide
        title="Store Management Workflow"
        description="Follow these steps for proper multi-store operations management"
        steps={inventoryAdjustmentSteps}
        isVisible={showWorkflowGuide}
        onClose={() => setShowWorkflowGuide(false)}
      />
    </div>
  );
}
