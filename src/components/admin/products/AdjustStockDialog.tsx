import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Product,
  useGetInventoryProductsQuery,
  useBulkProductStockAdjustmentMutation,
} from "@/redux/services/products.services";

interface AdjustStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

interface StoreInventory {
  storeId: number;
  storeName: string;
  currentStock: number;   
  newlyAssigned: string;  
  qtyToAdjust: number;
}

export function AdjustStockDialog({ open, onOpenChange, product }: AdjustStockDialogProps) {
  const { data, isLoading, isError } = useGetInventoryProductsQuery(
    { productId: product?.productId ?? 0, page: 1, itemsPerPage: 100 },
    { skip: !product }
  );

  const [adjustStock] = useBulkProductStockAdjustmentMutation();
  const [stores, setStores] = useState<StoreInventory[]>([]);

  useEffect(() => {
    if (!data) return;
    const mapped: StoreInventory[] = data.items.map((item) => ({
      storeId: item.store.id,
      storeName: item.store.name,
      currentStock: item.quantity,
      newlyAssigned: "0",
      qtyToAdjust: 0,
    }));
    setStores(mapped);
  }, [data]);

  if (!product) return null;

  const assignedCurrent = stores.reduce((s, it) => s + (it.currentStock || 0), 0);
  const newlyAssignedTotal = stores.reduce((s, it) => s + (parseInt(it.newlyAssigned || "0") || 0), 0);
  const totalAfter = assignedCurrent + newlyAssignedTotal;

  const remaining = product.basestock - totalAfter;

  const handleNewAssignChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const numericValue = parseInt(value || "0");

    const hypotheticalNewlyAssignedTotal = stores.reduce((sum, s, i) => {
      return sum + (i === index ? numericValue : parseInt(s.newlyAssigned || "0") || 0);
    }, 0);

    const hypotheticalTotalAfter = assignedCurrent + hypotheticalNewlyAssignedTotal;

    if (hypotheticalTotalAfter > product.basestock) {
      toast.warning(`Cannot assign more than basestock (${product.basestock}). Remaining: ${Math.max(0, product.basestock - (assignedCurrent + newlyAssignedTotal))}`);
      return;
    }

    const updated = [...stores];
    updated[index] = {
      ...updated[index],
      newlyAssigned: value,
      qtyToAdjust: numericValue,
    };
    setStores(updated);
  };

  const handleSubmit = async () => {
    const adjustments = stores
      .filter((s) => (parseInt(s.newlyAssigned || "0") || 0) !== 0)
      .map((s) => ({
        storeId: s.storeId,
        newQuantity: (s.currentStock || 0) + (parseInt(s.newlyAssigned || "0") || 0),
        reason: "Manual Distribution",
        reference: `DISTR-${Date.now()}`,
      }));

    if (adjustments.length === 0) {
      toast.info("No new assignments to submit");
      return;
    }

    if (assignedCurrent + newlyAssignedTotal > product.basestock) {
      toast.error("Total assigned exceeds basestock; please adjust inputs");
      return;
    }

    try {
      await adjustStock({ productId: product.productId, adjustments }).unwrap();
      toast.success(`Stock distributed for ${product.productName}`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to distribute stock");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Adjust / Distribute Inventory — {product.productName}
          </DialogTitle>
        </DialogHeader>

        {isLoading && <div className="p-4 text-center text-gray-600">Loading inventory...</div>}
        {isError && <div className="p-4 text-center text-red-600">Failed to load inventory</div>}

        {!isLoading && !isError && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg text-sm">
              <div>
                <div className="text-gray-600">Assigned (Current)</div>
                <div className="font-medium">{assignedCurrent} units</div>
              </div>
              <div>
                <div className="text-gray-600">Newly Assigned</div>
                <div className="font-medium">{newlyAssignedTotal} units</div>
              </div>
              <div>
                <div className="text-gray-600">Total (Current + New)</div>
                <div className={`font-medium ${totalAfter > product.basestock ? "text-red-600" : ""}`}>{totalAfter} units</div>
              </div>
              <div>
                <div className="text-gray-600">Base Stock</div>
                <div className="font-medium">{remaining} {product.unitOfMeasure}</div>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Store</TableHead>
                  <TableHead className="text-center">Assigned (Current)</TableHead>
                  <TableHead className="text-center">Newly Assigned</TableHead>
                  <TableHead className="text-center">Total After</TableHead>
                  <TableHead className="text-center">Qty Adjust</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {stores.map((s, i) => {
                  const cur = s.currentStock || 0;
                  const newly = parseInt(s.newlyAssigned || "0") || 0;
                  const totalAfterPerStore = cur + newly;
                  return (
                    <TableRow key={s.storeId}>
                      <TableCell className="font-medium">{s.storeName}</TableCell>
                      <TableCell className="text-center">{cur}</TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="text"
                          value={s.newlyAssigned}
                          className="mx-auto text-center w-20"
                          onChange={(e) => handleNewAssignChange(i, e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-center font-medium">{totalAfterPerStore}</TableCell>
                      <TableCell className={`text-center font-medium ${newly > 0 ? "text-green-600" : "text-gray-600"}`}>
                        {newly > 0 ? `+${newly}` : "0"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                className={totalAfter > product.basestock ? "bg-red-600 hover:bg-red-700" : "bg-teal-600 hover:bg-teal-700"}
              >
                Confirm Distribution
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
