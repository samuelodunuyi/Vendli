
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store } from "@/types/store";
import { Package, DollarSign, Users, Calendar } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface BulkOperationsProps {
  stores: Store[];
}

export function BulkOperations({ stores }: BulkOperationsProps) {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [bulkInventory, setBulkInventory] = useState({ productId: "", quantity: 0, operation: "add" });
  const [bulkPricing, setBulkPricing] = useState({ productId: "", price: 0, discount: 0 });
  const [bulkPromotion, setBulkPromotion] = useState({ name: "", startDate: "", endDate: "", discount: 0 });

  const handleStoreSelection = (storeId: string, checked: boolean) => {
    if (checked) {
      setSelectedStores([...selectedStores, storeId]);
    } else {
      setSelectedStores(selectedStores.filter(id => id !== storeId));
    }
  };

  const handleBulkInventoryUpdate = () => {
    if (selectedStores.length === 0) {
      toast.error("Please select at least one store");
      return;
    }
    toast.success(`Inventory ${bulkInventory.operation} operation applied to ${selectedStores.length} stores`);
  };

  const handleBulkPriceUpdate = () => {
    if (selectedStores.length === 0) {
      toast.error("Please select at least one store");
      return;
    }
    toast.success(`Price updates applied to ${selectedStores.length} stores`);
  };

  const handleBulkPromotionDeploy = () => {
    if (selectedStores.length === 0) {
      toast.error("Please select at least one store");
      return;
    }
    toast.success(`Promotion "${bulkPromotion.name}" deployed to ${selectedStores.length} stores`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Bulk Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Store Selection */}
        <div>
          <Label className="text-base font-medium">Select Stores</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {stores.map((store) => (
              <div key={store.id} className="flex items-center space-x-2">
                <Checkbox
                  id={store.id}
                  checked={selectedStores.includes(store.id)}
                  onCheckedChange={(checked) => handleStoreSelection(store.id, checked as boolean)}
                />
                <Label htmlFor={store.id} className="text-sm font-normal">
                  {store.name}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {selectedStores.length} store(s) selected
          </p>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="product">Product ID</Label>
                <Input
                  id="product"
                  value={bulkInventory.productId}
                  onChange={(e) => setBulkInventory({...bulkInventory, productId: e.target.value})}
                  placeholder="Enter product ID"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={bulkInventory.quantity}
                  onChange={(e) => setBulkInventory({...bulkInventory, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="operation">Operation</Label>
                <Select
                  value={bulkInventory.operation}
                  onValueChange={(value) => setBulkInventory({...bulkInventory, operation: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="remove">Remove Stock</SelectItem>
                    <SelectItem value="set">Set Stock Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleBulkInventoryUpdate} className="w-full">
              Apply Inventory Changes
            </Button>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priceProduct">Product ID</Label>
                <Input
                  id="priceProduct"
                  value={bulkPricing.productId}
                  onChange={(e) => setBulkPricing({...bulkPricing, productId: e.target.value})}
                  placeholder="Enter product ID"
                />
              </div>
              <div>
                <Label htmlFor="price">New Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  value={bulkPricing.price}
                  onChange={(e) => setBulkPricing({...bulkPricing, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={bulkPricing.discount}
                  onChange={(e) => setBulkPricing({...bulkPricing, discount: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <Button onClick={handleBulkPriceUpdate} className="w-full">
              <DollarSign className="h-4 w-4 mr-2" />
              Apply Price Changes
            </Button>
          </TabsContent>

          <TabsContent value="promotions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="promoName">Promotion Name</Label>
                <Input
                  id="promoName"
                  value={bulkPromotion.name}
                  onChange={(e) => setBulkPromotion({...bulkPromotion, name: e.target.value})}
                  placeholder="Enter promotion name"
                />
              </div>
              <div>
                <Label htmlFor="promoDiscount">Discount (%)</Label>
                <Input
                  id="promoDiscount"
                  type="number"
                  value={bulkPromotion.discount}
                  onChange={(e) => setBulkPromotion({...bulkPromotion, discount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={bulkPromotion.startDate}
                  onChange={(e) => setBulkPromotion({...bulkPromotion, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={bulkPromotion.endDate}
                  onChange={(e) => setBulkPromotion({...bulkPromotion, endDate: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleBulkPromotionDeploy} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Deploy Promotion
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
