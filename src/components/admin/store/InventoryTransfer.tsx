
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { StoreTransfer } from "@/hooks/useStoreManagement";
import { toast } from "@/components/ui/sonner";

interface InventoryTransferProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfers: StoreTransfer[];
  onInitiateTransfer: (transfer: Omit<StoreTransfer, 'id' | 'status' | 'requestDate'>) => void;
}

const stores = [
  { id: "store1", name: "Victoria Island Store" },
  { id: "store2", name: "Ikeja Store" },
  { id: "store3", name: "Lekki Store" },
  { id: "store4", name: "Ajah Store" },
  { id: "store5", name: "Egbeda Store" }
];

const mockProducts = [
  { id: "1", name: "Dell XPS 13 Laptop", stock: 8 },
  { id: "2", name: "Samsung Galaxy S23", stock: 15 },
  { id: "3", name: "iPhone 15 Pro", stock: 12 },
  { id: "4", name: "MacBook Air M2", stock: 6 }
];

export function InventoryTransfer({ open, onOpenChange, transfers, onInitiateTransfer }: InventoryTransferProps) {
  const [newTransfer, setNewTransfer] = useState({
    fromStore: "",
    toStore: "",
    productId: "",
    productName: "",
    quantity: "",
    requestedBy: "Current User"
  });

  const handleSubmit = () => {
    if (!newTransfer.fromStore || !newTransfer.toStore || !newTransfer.productId || !newTransfer.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newTransfer.fromStore === newTransfer.toStore) {
      toast.error("Source and destination stores must be different");
      return;
    }

    const selectedProduct = mockProducts.find(p => p.id === newTransfer.productId);
    if (!selectedProduct) {
      toast.error("Please select a valid product");
      return;
    }

    const quantity = parseInt(newTransfer.quantity);
    if (quantity <= 0 || quantity > selectedProduct.stock) {
      toast.error(`Quantity must be between 1 and ${selectedProduct.stock}`);
      return;
    }

    onInitiateTransfer({
      fromStore: stores.find(s => s.id === newTransfer.fromStore)?.name || "",
      toStore: stores.find(s => s.id === newTransfer.toStore)?.name || "",
      productId: newTransfer.productId,
      productName: selectedProduct.name,
      quantity,
      requestedBy: newTransfer.requestedBy
    });

    setNewTransfer({
      fromStore: "",
      toStore: "",
      productId: "",
      productName: "",
      quantity: "",
      requestedBy: "Current User"
    });
  };

  const getStatusIcon = (status: StoreTransfer['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-transit':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: StoreTransfer['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Inventory Transfer Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Transfer Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Initiate New Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromStore">From Store</Label>
                  <Select value={newTransfer.fromStore} onValueChange={(value) => setNewTransfer(prev => ({ ...prev, fromStore: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="toStore">To Store</Label>
                  <Select value={newTransfer.toStore} onValueChange={(value) => setNewTransfer(prev => ({ ...prev, toStore: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id} disabled={store.id === newTransfer.fromStore}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="product">Product</Label>
                <Select value={newTransfer.productId} onValueChange={(value) => {
                  const product = mockProducts.find(p => p.id === value);
                  setNewTransfer(prev => ({ 
                    ...prev, 
                    productId: value,
                    productName: product?.name || ""
                  }));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} (Stock: {product.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={newTransfer.productId ? mockProducts.find(p => p.id === newTransfer.productId)?.stock : undefined}
                  value={newTransfer.quantity}
                  onChange={(e) => setNewTransfer(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Initiate Transfer
              </Button>
            </CardContent>
          </Card>

          {/* Transfer History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transfer.status)}
                        <Badge className={getStatusColor(transfer.status)}>
                          {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{transfer.requestDate}</span>
                    </div>
                    
                    <div className="font-medium">{transfer.productName}</div>
                    <div className="text-sm text-gray-600">
                      Quantity: {transfer.quantity} units
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{transfer.fromStore}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="font-medium">{transfer.toStore}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Requested by: {transfer.requestedBy}
                    </div>
                  </div>
                ))}
                
                {transfers.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No transfers found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
