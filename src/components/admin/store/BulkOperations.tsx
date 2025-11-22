import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Calendar } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Store } from "@/redux/services/stores.services";
import { useGetProductsQuery } from "@/redux/services/products.services";
import { useCreateTransactionsMutation } from "@/redux/services/inventory.services";

interface BulkOperationsProps {
  stores: Store[];
}

export function BulkOperations({ stores }: BulkOperationsProps) {
  const [selectedStores, setSelectedStores] = useState<number[]>([]);
  const [bulkInventory, setBulkInventory] = useState({ productId: "", quantity: 0, transactionType: 0 }); // 0 = In
  const [bulkPricing, setBulkPricing] = useState({ productId: "", price: 0, discount: 0 });
  const [bulkPromotion, setBulkPromotion] = useState({ name: "", startDate: "", endDate: "", discount: 0 });

  const { data: products, refetch } = useGetProductsQuery({ page: 1, itemsPerPage: 1000 });
  const [createTransaction, { isLoading }] = useCreateTransactionsMutation();

  const handleStoreSelection = (storeId: number, checked: boolean) => {
    setSelectedStores(prev => checked ? [...prev, storeId] : prev.filter(id => id !== storeId));
  };

  const selectedProduct = products?.products?.find(p => p.productId.toString() === bulkInventory.productId);
  const basestock = selectedProduct?.basestock ?? 0;

  const handleBulkInventoryUpdate = async () => {
    if (selectedStores.length === 0) return toast.error("Please select at least one store");
    if (!bulkInventory.productId) return toast.error("Please select a product");
    if (bulkInventory.quantity === 0) return toast.error("Quantity must be non-zero");
    if (bulkInventory.transactionType === 1 && bulkInventory.quantity > basestock) {
      return toast.error(`Cannot remove more than available basestock (${basestock})`);
    }

    try {
      for (const storeId of selectedStores) {
        await createTransaction({
          transactionType: bulkInventory.transactionType,
          productId: Number(bulkInventory.productId),
          storeId,
          quantity: bulkInventory.quantity,
          reference: `INV-${new Date().getFullYear()}-${storeId}`,
          reason: "Bulk inventory operation"
        }).unwrap();
      }
      refetch();
      toast.success(`Inventory updated for ${selectedStores.length} store(s)`);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create transaction");
    }
  };

  const handleBulkPricingUpdate = () => {
    if (selectedStores.length === 0) return toast.error("Please select at least one store");
    if (!bulkPricing.productId) return toast.error("Please select a product");
    toast.success(`Price updates applied to ${selectedStores.length} store(s)`);
  };

  const handleBulkPromotionDeploy = () => {
    if (selectedStores.length === 0) return toast.error("Please select at least one store");
    if (!bulkPromotion.name) return toast.error("Please enter a promotion name");
    toast.success(`Promotion "${bulkPromotion.name}" deployed to ${selectedStores.length} store(s)`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" /> Bulk Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Store Selection */}
        <div>
          <Label className="text-base font-medium">Select Stores</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {stores.map(store => (
              <div key={store.storeId} className="flex items-center space-x-2">
                <Checkbox
                  id={`store-${store.storeId}`}
                  checked={selectedStores.includes(store.storeId)}
                  onCheckedChange={(checked) => handleStoreSelection(store.storeId, checked as boolean)}
                />
                <Label htmlFor={`store-${store.storeId}`} className="text-sm font-normal">{store.storeName}</Label>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">{selectedStores.length} store(s) selected</p>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select
                  value={bulkInventory.productId}
                  onValueChange={(v) => setBulkInventory({...bulkInventory, productId: v})}
                >
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products?.products?.map(p => (
                      <SelectItem key={p.productId} value={p.productId.toString()}>
                        {p.productName} (Stock: {p.basestock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity {bulkInventory.transactionType === 1 && selectedProduct ? `(Max: ${basestock})` : ""}</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={bulkInventory.quantity}
                  onChange={(e) => setBulkInventory({...bulkInventory, quantity: Number(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="transactionType">Transaction Type</Label>
                <Select
                  value={bulkInventory.transactionType.toString()}
                  onValueChange={(v) => setBulkInventory({...bulkInventory, transactionType: Number(v)})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">In</SelectItem>
                    <SelectItem value="1">Out</SelectItem>
                    <SelectItem value="2">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleBulkInventoryUpdate} className="w-full" disabled={isLoading}>
              Apply Inventory Changes
            </Button>
          </TabsContent>

          {/* Promotions Tab */}
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
                  onChange={(e) => setBulkPromotion({...bulkPromotion, discount: Number(e.target.value) || 0})}
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
              <Calendar className="h-4 w-4 mr-2" /> Deploy Promotion
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
