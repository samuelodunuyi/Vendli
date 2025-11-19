import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  RefreshCw,
  Plus,
  Minus,
  Package,
  Truck,
  BarChart3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { InventoryStoreFilter } from "./inventory/InventoryStoreFilter";
import { TransactionStatsCards } from "./inventory/TransactionStatsCards";
import { TransactionFilters } from "./inventory/TransactionFilters";
import {
  useCreateTransactionsMutation,
  useGetInventoriesQuery,
  useGetTransactionsQuery,
} from "@/redux/services/inventory.services";

const transactionTypeMap: Record<
  number,
  "in" | "out" | "adjustment" | "transfer"
> = {
  0: "in",
  1: "out",
  2: "adjustment",
  3: "transfer",
};

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
    productId: 0,
    type: 0,
    quantity: 0,
    reason: "",
    reference: "",
    storeId: selectedStoreId === "all" ? 0 : Number(selectedStoreId),
    fromStore: 0,
    toStore: 0,
  });

  const [createTransaction] = useCreateTransactionsMutation();
  const queryParams: any = {};

  if (selectedStoreId !== "all") queryParams.storeId = Number(selectedStoreId);
  if (typeFilter !== "all") queryParams.type = typeFilter;
  if (userFilter !== "all") queryParams.createdBy = userFilter;
  if (dateRange.from) queryParams.startDate = dateRange.from.toISOString();
  if (dateRange.to) queryParams.endDate = dateRange.to.toISOString();

  const {
    data: txData,
    isLoading,
    isError,
  } = useGetTransactionsQuery(queryParams);

  const transactions: InventoryTransaction[] =
    txData?.transactions?.map((tx) => ({
      id: String(tx.id),
      productId: String(tx.product?.id ?? ""),
      productName: tx.product?.name ?? "",
      type: transactionTypeMap[tx.type],
      quantity: tx.quantity,
      reason: tx.reason ?? "",
      reference: tx.reference ?? "",
      date: tx.createdOn,
      user: tx.createdBy?.firstName + " " + tx.createdBy?.lastName,
      storeId: String(tx.store.id),
      storeName: tx.store.name,
    })) ?? [];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStore =
      selectedStoreId === "all" || transaction.storeId === selectedStoreId;
    const matchesSearch =
      transaction.productName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesUser =
      userFilter === "all" ||
      (userFilter === "admin" && transaction.user.includes("Admin")) ||
      (userFilter === "manager" &&
        (transaction.user.includes("Manager") ||
          transaction.user.includes("Adebayo") ||
          transaction.user.includes("Fatima"))) ||
      (userFilter === "staff" &&
        !transaction.user.includes("Admin") &&
        !transaction.user.includes("Manager"));

    let matchesDate = true;
    if (dateRange.from || dateRange.to) {
      const transactionDate = new Date(transaction.date);
      if (dateRange.from && dateRange.to) {
        matchesDate =
          transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      } else if (dateRange.from) {
        matchesDate = transactionDate >= dateRange.from;
      } else if (dateRange.to) {
        matchesDate = transactionDate <= dateRange.to;
      }
    }

    return (
      matchesStore && matchesSearch && matchesType && matchesUser && matchesDate
    );
  });

  const inventoryStats = {
    totalTransactions: filteredTransactions.length,
    stockIn: filteredTransactions
      .filter((t) => t.type === "in")
      .reduce((sum, t) => sum + t.quantity, 0),
    stockOut: filteredTransactions
      .filter((t) => t.type === "out")
      .reduce((sum, t) => sum + t.quantity, 0),
    adjustments: filteredTransactions.filter((t) => t.type === "adjustment")
      .length,
    totalValue: filteredTransactions.reduce(
      (sum, t) => sum + t.quantity * 50000,
      0
    ), // Mock calculation
    lowStockItems: 8, // Mock data
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "in":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "out":
        return <Minus className="h-4 w-4 text-red-600" />;
      case "adjustment":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "transfer":
        return <Truck className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "in":
        return "default";
      case "out":
        return "secondary";
      case "adjustment":
        return "outline";
      case "transfer":
        return "default";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return (
      new Date(dateString).toLocaleDateString("en-GB") +
      " " +
      new Date(dateString).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const handleAddTransaction = async () => {
    if (
      !newTransaction.productId ||
      !newTransaction.quantity ||
      !newTransaction.reason
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      newTransaction.type === 3 &&
      (!newTransaction.fromStore || !newTransaction.toStore)
    ) {
      toast.error(
        "Please select both source and destination stores for transfers"
      );
      return;
    }

    try {
      await createTransaction({
        transactionType: newTransaction.type,
        productId: newTransaction.productId,
        storeId: newTransaction.storeId,
        quantity: newTransaction.quantity,
        reference: newTransaction.reference ?? undefined,
        reason: newTransaction.reason,
        fromStore: newTransaction.fromStore ?? undefined,
        toStore: newTransaction.toStore ?? undefined,
      }).unwrap();

      toast.success("Inventory transaction recorded successfully");
      setIsAddTransactionOpen(false);
    } catch (err) {
      toast.error("Failed to add transaction");
    }
  };

  const exportData = () => {
    const csvContent = [
      [
        "Transaction ID",
        "Store",
        "Product",
        "Type",
        "Quantity",
        "Reason",
        "Reference",
        "Date",
        "User",
      ],
      ...filteredTransactions.map((t) => [
        t.id,
        t.storeName,
        t.productName,
        t.type,
        t.quantity.toString(),
        t.reason,
        t.reference,
        formatDate(t.date),
        t.user,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

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
          Showing {filteredTransactions.length} of {transactions.length}{" "}
          transactions
          {selectedStoreId !== "all" && ` for selected store`}
        </div>

        <div className="flex gap-2">
          <Dialog
            open={isAddTransactionOpen}
            onOpenChange={setIsAddTransactionOpen}
          >
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
                  <Select
                    value={String(newTransaction.productId)}
                    onValueChange={(value) =>
                      setNewTransaction({
                        ...newTransaction,
                        productId: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Samsung Galaxy S23</SelectItem>
                      <SelectItem value="2">Nike Air Max</SelectItem>
                      <SelectItem value="3">Dell XPS 13 Laptop</SelectItem>
                      <SelectItem value="4">
                        Sony WH-1000XM4 Headphones
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="store">Store *</Label>
                  <Select
                    value={String(newTransaction.storeId)}
                    onValueChange={(value) =>
                      setNewTransaction({
                        ...newTransaction,
                        storeId: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Victoria Island Store</SelectItem>
                      <SelectItem value="2">Ikeja Store</SelectItem>
                      <SelectItem value="3">Lekki Store</SelectItem>
                      <SelectItem value="4">Ajah Store</SelectItem>
                      <SelectItem value="5">Egbeda Store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Transaction Type *</Label>
                  <Select
                    value={String(newTransaction.type)}
                    onValueChange={(value) =>
                      setNewTransaction({
                        ...newTransaction,
                        type: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Stock In</SelectItem>
                      <SelectItem value="1">Stock Out</SelectItem>
                      <SelectItem value="2">Adjustment</SelectItem>
                      <SelectItem value="3">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newTransaction.type === 3 && (
                  <>
                    <div>
                      <Label htmlFor="fromStore">From Store *</Label>
                      <Select
                        value={String(newTransaction.fromStore)}
                        onValueChange={(value) =>
                          setNewTransaction({
                            ...newTransaction,
                            fromStore: Number(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source store" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Victoria Island Store">
                            Victoria Island Store
                          </SelectItem>
                          <SelectItem value="Ikeja Store">
                            Ikeja Store
                          </SelectItem>
                          <SelectItem value="Lekki Store">
                            Lekki Store
                          </SelectItem>
                          <SelectItem value="Ajah Store">Ajah Store</SelectItem>
                          <SelectItem value="Egbeda Store">
                            Egbeda Store
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="toStore">To Store *</Label>
                      <Select
                        value={String(newTransaction.toStore)}
                        onValueChange={(value) =>
                          setNewTransaction({
                            ...newTransaction,
                            toStore: Number(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination store" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Victoria Island Store">
                            Victoria Island Store
                          </SelectItem>
                          <SelectItem value="Ikeja Store">
                            Ikeja Store
                          </SelectItem>
                          <SelectItem value="Lekki Store">
                            Lekki Store
                          </SelectItem>
                          <SelectItem value="Ajah Store">Ajah Store</SelectItem>
                          <SelectItem value="Egbeda Store">
                            Egbeda Store
                          </SelectItem>
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
                    value={String(newTransaction.quantity)}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    placeholder="PO number, order ID, etc."
                    value={newTransaction.reference}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        reference: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Reason for transaction"
                    value={newTransaction.reason}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        reason: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsAddTransactionOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTransaction}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
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
                {isError && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-red-500">
                      Failed to load transactions
                    </td>
                  </tr>
                )}
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">{transaction.id}</td>
                    <td className="p-3">
                      <div className="font-medium">{transaction.storeName}</div>
                      {transaction.type === "transfer" &&
                        transaction.fromStore &&
                        transaction.toStore && (
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
                          {/* {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)} */}
                          {transaction.type?.charAt?.(0)?.toUpperCase() ?? ""}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3 font-medium">
                      <span
                        className={
                          transaction.type === "in"
                            ? "text-green-600"
                            : transaction.type === "out"
                            ? "text-red-600"
                            : transaction.type === "transfer"
                            ? "text-purple-600"
                            : "text-blue-600"
                        }
                      >
                        {transaction.type === "out" ||
                        (transaction.type === "adjustment" &&
                          transaction.quantity < 0)
                          ? "-"
                          : "+"}
                        {Math.abs(transaction.quantity)}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      {formatDate(transaction.date)}
                    </td>
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
