import { useState } from "react";
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
  storeId: number;
  type: 'low-stock' | 'high-sales' | 'staff-shortage' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  date: string;
  resolved: boolean;
}

export function useStoreManagement() {
  const [activeStoreId, setActiveStoreId] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedStoresForComparison, setSelectedStoresForComparison] = useState<number[]>([]);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [showAddStoreDialog, setShowAddStoreDialog] = useState(false);
  const [showEditStoreDialog, setShowEditStoreDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [selectedStoreForEdit, setSelectedStoreForEdit] = useState<number | null>(null);

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
      storeId: 3,
      type: "low-stock",
      severity: "high",
      message: "iPhone 15 Pro stock below 5 units",
      date: "2024-01-15",
      resolved: false
    },
    {
      id: "a2",
      storeId: 2,
      type: "high-sales",
      severity: "medium",
      message: "Samsung Galaxy S23 selling 50% above average",
      date: "2024-01-15",
      resolved: false
    }
  ];

const handleStoreSwitch = (storeId: number, storeName?: string) => {
  setActiveStoreId(storeId);
  console.log(storeName)
  toast.success(`Switched to ${storeName}`);
};

  const toggleCompareMode = () => {
    setCompareMode((prev) => !prev);
    if (compareMode) {
      setSelectedStoresForComparison([]);
    }
  };

  const handleStoreSelect = (storeId: number) => {
    setSelectedStoresForComparison((prev) => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId);
      }
      if (prev.length >= 3) {
        toast.error("You can compare up to 3 stores at once");
        return prev;
      }
      return [...prev, storeId];
    });
  };

  const initiateTransfer = (
    transfer: Omit<StoreTransfer, "id" | "status" | "requestDate">
  ) => {
    const newTransfer: StoreTransfer = {
      ...transfer,
      id: Date.now().toString(),
      status: "pending",
      requestDate: new Date().toISOString().split("T")[0],
    };
    toast.success(`Transfer initiated: ${transfer.quantity} units of ${transfer.productName}`);
    return newTransfer;
  };

  const handleEditStore = (storeId: number) => {
    setSelectedStoreForEdit(storeId);
    setShowEditStoreDialog(true);
  };

  const handleViewAnalytics = (storeId: number) => {
    setActiveStoreId(storeId);
    setShowAnalyticsDialog(true);
  };

  const getStoreName = (storeId: number): string => {
    const storeNames: Record<number, string> = {
      1: "Victoria Island Store",
      2: "Ikeja Store",
      3: "Lekki Store",
      4: "Ajah Store",
      5: "Egbeda Store"
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
