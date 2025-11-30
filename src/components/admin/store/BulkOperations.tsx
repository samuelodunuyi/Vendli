import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Calendar } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Store } from "@/redux/services/stores.services";

import { useGetProductsQuery } from "@/redux/services/products.services";
import { useCreateTransactionsMutation } from "@/redux/services/inventory.services";
import { useCreatePromotionMutation } from "@/redux/services/promotions.services";

interface BulkOperationsProps {
  stores: Store[];
}

export function BulkOperations({ stores }: BulkOperationsProps) {
  const [selectedStores, setSelectedStores] = useState<number[]>([]);

  // ---------------- Inventory state ----------------
  const [bulkInventory, setBulkInventory] = useState({
    productId: "",
    quantity: 0,
    transactionType: 0,
  });

  // ---------------- Pricing state (unused placeholder) ----------------
  const [bulkPricing, setBulkPricing] = useState({
    productId: "",
    price: 0,
    discount: 0,
  });

  // ---------------- Promotions state ----------------
  const [bulkPromotion, setBulkPromotion] = useState({
    title: "",
    description: "",
    discountValue: 0,
    startDate: "",
    endDate: "",
  });

  const { data: products, refetch } = useGetProductsQuery({
    page: 1,
    itemsPerPage: 1000,
  });

  const [createTransaction, { isLoading }] = useCreateTransactionsMutation();
  const [createPromotion, { isLoading: promoLoading }] =
    useCreatePromotionMutation();

  const handleStoreSelection = (storeId: number, checked: boolean) => {
    setSelectedStores((prev) =>
      checked ? [...prev, storeId] : prev.filter((id) => id !== storeId)
    );
  };

  const selectedProduct = products?.products?.find(
    (p) => p.productId.toString() === bulkInventory.productId
  );
  const basestock = selectedProduct?.basestock ?? 0;

  // ---------------- HANDLE BULK INVENTORY ----------------
  const handleBulkInventoryUpdate = async () => {
    if (selectedStores.length === 0)
      return toast.error("Please select at least one store");
    if (!bulkInventory.productId)
      return toast.error("Please select a product");
    if (bulkInventory.quantity === 0)
      return toast.error("Quantity must be non-zero");

    if (
      bulkInventory.transactionType === 1 &&
      bulkInventory.quantity > basestock
    ) {
      return toast.error(
        `Cannot remove more than available basestock (${basestock})`
      );
    }

    try {
      for (const storeId of selectedStores) {
        await createTransaction({
          transactionType: bulkInventory.transactionType,
          productId: Number(bulkInventory.productId),
          storeId,
          quantity: bulkInventory.quantity,
          reference: `INV-${new Date().getFullYear()}-${storeId}`,
          reason: "Bulk inventory operation",
        }).unwrap();
      }

      refetch();
      toast.success(`Inventory updated for ${selectedStores.length} store(s)`);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create transaction");
    }
  };

  // ---------------- HANDLE BULK PROMOTION CREATION ----------------
  const handleBulkPromotionDeploy = async () => {
    if (selectedStores.length === 0)
      return toast.error("Please select at least one store");

    if (!bulkPromotion.title)
      return toast.error("Please enter a promotion title");

    if (!bulkPromotion.startDate || !bulkPromotion.endDate)
      return toast.error("Please select a date range");

    if (bulkPromotion.discountValue <= 0)
      return toast.error("Discount must be greater than 0");

    try {
      for (const storeId of selectedStores) {
        await createPromotion({
          title: bulkPromotion.title,
          description: bulkPromotion.description,
          discountType: 1,
          discountValue: bulkPromotion.discountValue,
          startDate: new Date(bulkPromotion.startDate).toISOString(),
          endDate: new Date(bulkPromotion.endDate).toISOString(),
          appliesToAllProducts: true,
          appliesToAllStores: false,
          applicableStoreIds: [storeId],
        }).unwrap();
      }

      toast.success(
        `Created ${selectedStores.length} promotion(s) successfully`
      );

      setBulkPromotion({
        title: "",
        description: "",
        discountValue: 0,
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create promotions");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" /> Bulk Operations
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ---------------- STORE SELECTION ---------------- */}
        <div>
          <Label className="text-base font-medium">Select Stores</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {stores.map((store) => (
              <div key={store.storeId} className="flex items-center space-x-2">
                <Checkbox
                  id={`store-${store.storeId}`}
                  checked={selectedStores.includes(store.storeId)}
                  onCheckedChange={(checked) =>
                    handleStoreSelection(store.storeId, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`store-${store.storeId}`}
                  className="text-sm font-normal"
                >
                  {store.storeName}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {selectedStores.length} store(s) selected
          </p>
        </div>

        {/* ---------------- TABS ---------------- */}
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>

          {/* ---------------- INVENTORY TAB ---------------- */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select
                  value={bulkInventory.productId}
                  onValueChange={(v) =>
                    setBulkInventory({ ...bulkInventory, productId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.products?.map((p) => (
                      <SelectItem
                        key={p.productId}
                        value={p.productId.toString()}
                      >
                        {p.productName} (Stock: {p.basestock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">
                  Quantity{" "}
                  {bulkInventory.transactionType === 1 && selectedProduct
                    ? `(Max: ${basestock})`
                    : ""}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={bulkInventory.quantity}
                  onChange={(e) =>
                    setBulkInventory({
                      ...bulkInventory,
                      quantity: Number(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="transactionType">Transaction Type</Label>
                <Select
                  value={bulkInventory.transactionType.toString()}
                  onValueChange={(v) =>
                    setBulkInventory({
                      ...bulkInventory,
                      transactionType: Number(v),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">In</SelectItem>
                    <SelectItem value="1">Out</SelectItem>
                    <SelectItem value="2">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleBulkInventoryUpdate} className="w-full">
              Apply Inventory Changes
            </Button>
          </TabsContent>

          {/* ---------------- PROMOTIONS TAB ---------------- */}
          <TabsContent value="promotions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Promotion Title</Label>
                <Input
                  value={bulkPromotion.title}
                  onChange={(e) =>
                    setBulkPromotion({
                      ...bulkPromotion,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., Black Friday"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={bulkPromotion.description}
                  onChange={(e) =>
                    setBulkPromotion({
                      ...bulkPromotion,
                      description: e.target.value,
                    })
                  }
                  placeholder="Optional description"
                />
              </div>

              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={bulkPromotion.discountValue}
                  onChange={(e) =>
                    setBulkPromotion({
                      ...bulkPromotion,
                      discountValue: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={bulkPromotion.startDate}
                  onChange={(e) =>
                    setBulkPromotion({
                      ...bulkPromotion,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={bulkPromotion.endDate}
                  onChange={(e) =>
                    setBulkPromotion({
                      ...bulkPromotion,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleBulkPromotionDeploy}
              disabled={promoLoading}
              className="w-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Deploy Promotion to Selected Stores
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
