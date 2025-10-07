import { useState } from "react";
import { Store } from "@/types/store";
import { toast } from "@/components/ui/sonner";

export interface StoreTransfer {
  id: string;
  fromStore: string;
  toStore: string;
  productId: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  requestedBy: string;
  requestDate: string;
  completedDate?: string;
}

export interface StoreAlert {
  id: string;
  storeId: string;
  type: 'low-stock' | 'high-sales' | 'staff-shortage' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  date: string;
  resolved: boolean;
}

export function useStoreManagement() {
  const [activeStoreId, setActiveStoreId] = useState<string>("store1");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedStoresForComparison, setSelectedStoresForComparison] = useState<string[]>([]);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [showAddStoreDialog, setShowAddStoreDialog] = useState(false);
  const [showEditStoreDialog, setShowEditStoreDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [selectedStoreForEdit, setSelectedStoreForEdit] = useState<string | undefined>();

  const mockTransfers: StoreTransfer[] = [
    {
      id: "t1",
      fromStore: "Victoria Island Store",
      toStore: "Ikeja Store",
      productId: "1",
      productName: "Dell XPS 13 Laptop",
      quantity: 5,
      status: "pending",
      requestedBy: "Adebayo Ogundimu",
      requestDate: "2024-01-15"
    },
    {
      id: "t2",
      fromStore: "Lekki Store",
      toStore: "Ajah Store",
      productId: "2",
      productName: "Samsung Galaxy S23",
      quantity: 10,
      status: "in-transit",
      requestedBy: "Chidi Okwu",
      requestDate: "2024-01-14",
    }
  ];

  const mockAlerts: StoreAlert[] = [
    {
      id: "a1",
      storeId: "store3",
      type: "low-stock",
      severity: "high",
      message: "iPhone 15 Pro stock below 5 units",
      date: "2024-01-15",
      resolved: false
    },
    {
      id: "a2",
      storeId: "store2",
      type: "high-sales",
      severity: "medium",
      message: "Samsung Galaxy S23 selling 50% above average",
      date: "2024-01-15",
      resolved: false
    }
  ];

  const handleStoreSwitch = (storeId: string) => {
    setActiveStoreId(storeId);
    toast.success(`Switched to ${getStoreName(storeId)}`);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setSelectedStoresForComparison([]);
    }
  };

  const handleStoreSelect = (storeId: string) => {
    if (selectedStoresForComparison.includes(storeId)) {
      setSelectedStoresForComparison(prev => prev.filter(id => id !== storeId));
    } else if (selectedStoresForComparison.length < 3) {
      setSelectedStoresForComparison(prev => [...prev, storeId]);
    } else {
      toast.error("You can compare up to 3 stores at once");
    }
  };

  const initiateTransfer = (transfer: Omit<StoreTransfer, 'id' | 'status' | 'requestDate'>) => {
    const newTransfer: StoreTransfer = {
      ...transfer,
      id: Date.now().toString(),
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    toast.success(`Transfer request initiated: ${transfer.quantity} units of ${transfer.productName}`);
    return newTransfer;
  };

  const handleEditStore = (storeId: string) => {
    setSelectedStoreForEdit(storeId);
    setShowEditStoreDialog(true);
  };

  const handleViewAnalytics = (storeId: string) => {
    setActiveStoreId(storeId);
    setShowAnalyticsDialog(true);
  };

  const getStoreName = (storeId: string): string => {
    const storeNames: Record<string, string> = {
      "store1": "Victoria Island Store",
      "store2": "Ikeja Store",
      "store3": "Lekki Store",
      "store4": "Ajah Store",
      "store5": "Egbeda Store"
    };
    return storeNames[storeId] || "Unknown Store";
  };

  return {
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
  };
}
