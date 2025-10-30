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
} from "lucide-react";
import { useStoreManagement } from "@/hooks/useStoreManagement";
import { StoreComparison } from "./store/StoreComparison";
import { InventoryTransfer } from "./store/InventoryTransfer";
import { StoreAlerts } from "./store/StoreAlerts";
import { AddStoreDialog } from "./store/AddStoreDialog";
import { EditStoreDialog } from "./store/EditStoreDialog";
import { ManageStaffDialog } from "./store/ManageStaffDialog";
import { StoreAnalyticsDialog } from "./store/StoreAnalyticsDialog";
import { StoreOverviewTab } from "./store/StoreOverviewTab";
import { BulkOperations } from "./store/BulkOperations";
import { AdvancedReporting } from "./store/AdvancedReporting";
import { RealTimeNotifications } from "./store/RealTimeNotifications";
import { CustomerAnalytics } from "./store/CustomerAnalytics";
import { EnhancedStaffManagement } from "./store/EnhancedStaffManagement";
import { WorkflowGuide } from "@/components/WorkflowGuide";
import { inventoryAdjustmentSteps } from "@/data/workflows";
import { useGetStoresQuery, useCreateStoreMutation, useUpdateStoreMutation, Store, StoreCreateRequest, StoreEditRequest} from "@/redux/services/stores.services";
import { useGetUsersQuery, User} from "@/redux/services/user.services";
import { toast } from "sonner";

export function EnhancedStoreManagement() {
      const { data, isLoading, isError } = useGetStoresQuery();
      const { data: getUserData } = useGetUsersQuery({});
      const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();
      const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();
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
    handleViewAnalytics,
    handleEditStore,
    getStoreName
  } = useStoreManagement();

  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  const activeStore = data?.find(store => store.storeId === activeStoreId);


const handleAddStore = async (formData: StoreCreateRequest) => {
  try {
    // Find selected user based on selected manager ID
    const selectedUser = getUserData?.find((u: User) => u.id === Number(formData.userId));

    const storePayload = {
      storeName: formData.storeName,
      storePhoneNumber: formData.storePhoneNumber,
      storeEmailAddress: formData.storeEmailAddress,
      storeAddress: formData.storeAddress,
      storeAdmin: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "",
      userId: selectedUser ? selectedUser.id : 0,
      storeType: "Retail",
    };

    await createStore(storePayload).unwrap();
    toast.success("Store added successfully!");
    setShowAddStoreDialog(false);
  } catch (err) {
    console.error(err);
    toast.error("Failed to add store");
  }
};

const handleUpdateStore = async (updatedData: StoreEditRequest) => {
  console.log(updatedData)
  try {
    const storePayload = {
      storeId: updatedData.storeId,
      storeName: updatedData.storeName,
      storePhoneNumber: updatedData.storePhoneNumber,
      storeEmailAddress: updatedData.storeEmailAddress,
      storeAddress: updatedData.storeAddress,
      storeAdmin: updatedData.storeAdmin, 
      userId: updatedData.userId,
      storeType: "Retail",
      isActive: updatedData.isActive,
    };

    await updateStore(storePayload).unwrap();
    toast.success("Store updated successfully!");
    setShowEditStoreDialog(false);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update store");
  }
};

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
            stores={data}
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
          <BulkOperations stores={data} />
        </TabsContent>

        <TabsContent value="reporting">
          <AdvancedReporting stores={data} />
        </TabsContent>

        <TabsContent value="notifications">
          <RealTimeNotifications />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerAnalytics stores={data} />
        </TabsContent>

        <TabsContent value="staff">
          <EnhancedStaffManagement stores={data} />
        </TabsContent>

      </Tabs>

      {/* All Dialog Components */}
      <AddStoreDialog
        open={showAddStoreDialog}
        isCreating= {isCreating}
        onOpenChange={setShowAddStoreDialog}
        onAddStore={handleAddStore}
        getUserData= {getUserData}
      />

      <EditStoreDialog
        open={showEditStoreDialog}
        onOpenChange={setShowEditStoreDialog}
        store={activeStore}
        onEditStore={handleUpdateStore}
        getUserData= {getUserData}
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
