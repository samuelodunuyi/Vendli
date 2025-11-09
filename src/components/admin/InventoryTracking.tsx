
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Plus, Minus, Package, Truck, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { InventoryStoreFilter } from "./inventory/InventoryStoreFilter";
import { TransactionStatsCards } from "./inventory/TransactionStatsCards";
import { TransactionFilters } from "./inventory/TransactionFilters";

interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: "in" | "out" | "adjustment" | "transfer";
  quantity: number;
  reason: string;
  reference: string;
  date: string;
  user: string;
  storeId: string;
  storeName: string;
  fromStore?: string;
  toStore?: string;
}

export function InventoryTracking() {
  const [selectedStoreId, setSelectedStoreId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  
  const [newTransaction, setNewTransaction] = useState({
    productId: "",
    type: "in" as "in" | "out" | "adjustment" | "transfer",
    quantity: "",
    reason: "",
    reference: "",
    storeId: selectedStoreId === "all" ? "store1" : selectedStoreId,
    fromStore: "",
    toStore: ""
  });

  // Enhanced mock inventory transactions with multi-store data
  const [transactions] = useState<InventoryTransaction[]>([
    {
      id: "TXN001",
      productId: "1",
      productName: "Samsung Galaxy S23",
      type: "in",
      quantity: 10,
      reason: "New Stock Received from Supplier",
      reference: "PO-2024-001",
      date: "2024-01-15T10:00:00",
      user: "Adebayo Ogundimu",
      storeId: "store1",
      storeName: "Victoria Island Store"
    },
    {
      id: "TXN002",
      productId: "2",
      productName: "Nike Air Max",
      type: "out",
      quantity: 5,
      reason: "Customer Sales",
      reference: "ORD-2024-001",
      date: "2024-01-15T14:30:00",
      user: "Fatima Ahmed",
      storeId: "store2",
      storeName: "Ikeja Store"
    },
    {
      id: "TXN003",
      productId: "3",
      productName: "Dell XPS 13 Laptop",
      type: "adjustment",
      quantity: -2,
      reason: "Damaged items - Water damage during transport",
      reference: "ADJ-2024-001",
      date: "2024-01-14T16:20:00",
      user: "Chidi Okwu",
      storeId: "store3",
      storeName: "Lekki Store"
    },
    {
      id: "TXN004",
      productId: "1",
      productName: "Samsung Galaxy S23",
      type: "transfer",
      quantity: 5,
      reason: "Inter-store transfer to meet demand",
      reference: "TRF-2024-001",
      date: "2024-01-14T09:15:00",
      user: "Blessing Nwosu",
      storeId: "store4",
      storeName: "Ajah Store",
      fromStore: "Victoria Island Store",
      toStore: "Ajah Store"
    },
    {
      id: "TXN005",
      productId: "4",
      productName: "Sony WH-1000XM4 Headphones",
      type: "in",
      quantity: 15,
      reason: "Bulk purchase for promotion",
      reference: "PO-2024-002",
      date: "2024-01-13T11:45:00",
      user: "Ibrahim Lawal",
      storeId: "store5",
      storeName: "Egbeda Store"
    }
  ]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesStore = selectedStoreId === "all" || transaction.storeId === selectedStoreId;
    const matchesSearch = transaction.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesUser = userFilter === "all" || 
                       (userFilter === "admin" && transaction.user.includes("Admin")) ||
                       (userFilter === "manager" && (transaction.user.includes("Manager") || transaction.user.includes("Adebayo") || transaction.user.includes("Fatima"))) ||
                       (userFilter === "staff" && !transaction.user.includes("Admin") && !transaction.user.includes("Manager"));
    
    let matchesDate = true;
    if (dateRange.from || dateRange.to) {
      const transactionDate = new Date(transaction.date);
      if (dateRange.from && dateRange.to) {
        matchesDate = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      } else if (dateRange.from) {
        matchesDate = transactionDate >= dateRange.from;
      } else if (dateRange.to) {
        matchesDate = transactionDate <= dateRange.to;
      }
    }

    return matchesStore && matchesSearch && matchesType && matchesUser && matchesDate;
  });

  const inventoryStats = {
    totalTransactions: filteredTransactions.length,
    stockIn: filteredTransactions.filter(t => t.type === "in").reduce((sum, t) => sum + t.quantity, 0),
    stockOut: filteredTransactions.filter(t => t.type === "out").reduce((sum, t) => sum + t.quantity, 0),
    adjustments: filteredTransactions.filter(t => t.type === "adjustment").length,
    totalValue: filteredTransactions.reduce((sum, t) => sum + (t.quantity * 50000), 0), // Mock calculation
    lowStockItems: 8 // Mock data
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "in": return <Plus className="h-4 w-4 text-green-600" />;
      case "out": return <Minus className="h-4 w-4 text-red-600" />;
      case "adjustment": return <Package className="h-4 w-4 text-blue-600" />;
      case "transfer": return <Truck className="h-4 w-4 text-purple-600" />;
      default: return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "in": return "default";
      case "out": return "secondary";
      case "adjustment": return "outline";
      case "transfer": return "default";
      default: return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB") + " " + 
           new Date(dateString).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
  };

  const handleAddTransaction = () => {
    if (!newTransaction.productId || !newTransaction.quantity || !newTransaction.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newTransaction.type === "transfer" && (!newTransaction.fromStore || !newTransaction.toStore)) {
      toast.error("Please select both source and destination stores for transfers");
      return;
    }

    toast.success("Inventory transaction recorded successfully");
    setIsAddTransactionOpen(false);
    setNewTransaction({
      productId: "",
      type: "in",
      quantity: "",
      reason: "",
      reference: "",
      storeId: selectedStoreId === "all" ? "store1" : selectedStoreId,
      fromStore: "",
      toStore: ""
    });
  };

  const exportData = () => {
    const csvContent = [
      ["Transaction ID", "Store", "Product", "Type", "Quantity", "Reason", "Reference", "Date", "User"],
      ...filteredTransactions.map(t => [
        t.id,
        t.storeName,
        t.productName,
        t.type,
        t.quantity.toString(),
        t.reason,
        t.reference,
        formatDate(t.date),
        t.user
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory_transactions_${selectedStoreId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Transaction data exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Multi-Store Inventory Tracking</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Store Selection */}
      <InventoryStoreFilter
        selectedStoreId={selectedStoreId}
        onStoreChange={setSelectedStoreId}
      />

      {/* Enhanced Statistics */}
      <TransactionStatsCards
        inventoryStats={inventoryStats}
        selectedStoreId={selectedStoreId}
      />

      {/* Enhanced Filters */}
      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        userFilter={userFilter}
        onUserFilterChange={setUserFilter}
      />

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length} transactions
          {selectedStoreId !== "all" && ` for selected store`}
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Inventory Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product">Product *</Label>
                  <Select value={newTransaction.productId} onValueChange={(value) => setNewTransaction({...newTransaction, productId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Samsung Galaxy S23</SelectItem>
                      <SelectItem value="2">Nike Air Max</SelectItem>
                      <SelectItem value="3">Dell XPS 13 Laptop</SelectItem>
                      <SelectItem value="4">Sony WH-1000XM4 Headphones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="store">Store *</Label>
                  <Select value={newTransaction.storeId} onValueChange={(value) => setNewTransaction({...newTransaction, storeId: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="store1">Victoria Island Store</SelectItem>
                      <SelectItem value="store2">Ikeja Store</SelectItem>
                      <SelectItem value="store3">Lekki Store</SelectItem>
                      <SelectItem value="store4">Ajah Store</SelectItem>
                      <SelectItem value="store5">Egbeda Store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Transaction Type *</Label>
                  <Select value={newTransaction.type} onValueChange={(value: "in" | "out" | "adjustment" | "transfer") => setNewTransaction({...newTransaction, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Stock In</SelectItem>
                      <SelectItem value="out">Stock Out</SelectItem>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newTransaction.type === "transfer" && (
                  <>
                    <div>
                      <Label htmlFor="fromStore">From Store *</Label>
                      <Select value={newTransaction.fromStore} onValueChange={(value) => setNewTransaction({...newTransaction, fromStore: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source store" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Victoria Island Store">Victoria Island Store</SelectItem>
                          <SelectItem value="Ikeja Store">Ikeja Store</SelectItem>
                          <SelectItem value="Lekki Store">Lekki Store</SelectItem>
                          <SelectItem value="Ajah Store">Ajah Store</SelectItem>
                          <SelectItem value="Egbeda Store">Egbeda Store</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="toStore">To Store *</Label>
                      <Select value={newTransaction.toStore} onValueChange={(value) => setNewTransaction({...newTransaction, toStore: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination store" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Victoria Island Store">Victoria Island Store</SelectItem>
                          <SelectItem value="Ikeja Store">Ikeja Store</SelectItem>
                          <SelectItem value="Lekki Store">Lekki Store</SelectItem>
                          <SelectItem value="Ajah Store">Ajah Store</SelectItem>
                          <SelectItem value="Egbeda Store">Egbeda Store</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="Enter quantity"
                    value={newTransaction.quantity}
                    onChange={(e) => setNewTransaction({...newTransaction, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="reference">Reference</Label>
                  <Input 
                    id="reference" 
                    placeholder="PO number, order ID, etc."
                    value={newTransaction.reference}
                    onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea 
                    id="reason" 
                    placeholder="Reason for transaction"
                    value={newTransaction.reason}
                    onChange={(e) => setNewTransaction({...newTransaction, reason: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddTransactionOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTransaction} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Transaction ID</th>
                  <th className="text-left p-3">Store</th>
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Quantity</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">User</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{transaction.id}</td>
                    <td className="p-3">
                      <div className="font-medium">{transaction.storeName}</div>
                      {transaction.type === "transfer" && transaction.fromStore && transaction.toStore && (
                        <div className="text-xs text-gray-500">
                          {transaction.fromStore} → {transaction.toStore}
                        </div>
                      )}
                    </td>
                    <td className="p-3">{transaction.productName}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <Badge variant={getTransactionColor(transaction.type)}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3 font-medium">
                      <span className={
                        transaction.type === "in" ? "text-green-600" :
                        transaction.type === "out" ? "text-red-600" :
                        transaction.type === "transfer" ? "text-purple-600" :
                        "text-blue-600"
                      }>
                        {transaction.type === "out" || transaction.type === "adjustment" && transaction.quantity < 0 ? "-" : "+"}
                        {Math.abs(transaction.quantity)}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{formatDate(transaction.date)}</td>
                    <td className="p-3">{transaction.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No transactions found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
