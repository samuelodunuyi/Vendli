
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {Product} from "@/redux/services/products.services"

interface AdjustStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

// Mock location data similar to the screenshot
const mockLocations = [
  { code: "", name: "(Unspecified Location)", currentInventory: 8, newInventory: 8, qtyToAdjust: 0, baseUnit: "PCS" },
  { code: "MAIN", name: "Main Store", currentInventory: 0, newInventory: 0, qtyToAdjust: 0, baseUnit: "PCS" },
  { code: "ABJ", name: "Abuja Depot", currentInventory: 0, newInventory: 0, qtyToAdjust: 0, baseUnit: "PCS" },
  { code: "PH", name: "Port Harcourt Depot", currentInventory: 0, newInventory: 0, qtyToAdjust: 0, baseUnit: "PCS" },
  { code: "KAN", name: "Kano Depot", currentInventory: 0, newInventory: 0, qtyToAdjust: 0, baseUnit: "PCS" },
  { code: "IBD", name: "Ibadan Depot", currentInventory: 0, newInventory: 0, qtyToAdjust: 0, baseUnit: "PCS" }
];

export function AdjustStockDialog({ open, onOpenChange, product }: AdjustStockDialogProps) {
  const [locations, setLocations] = useState(mockLocations);

  if (!product) return null;

  const handleNewInventoryChange = (index: number, value: string) => {
    const newValue = parseInt(value) || 0;
    const updatedLocations = [...locations];
    updatedLocations[index].newInventory = newValue;
    updatedLocations[index].qtyToAdjust = newValue - updatedLocations[index].currentInventory;
    setLocations(updatedLocations);
  };

  const handleSubmit = () => {
    const totalAdjustment = locations.reduce((sum, loc) => sum + loc.qtyToAdjust, 0);
    if (totalAdjustment !== 0) {
      toast.success(`Stock adjusted by ${totalAdjustment} units for ${product.productName}`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Adjust Inventory - {product.barcode} - {product.productName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Current Inventory</TableHead>
                <TableHead className="text-right">New Inventory</TableHead>
                <TableHead className="text-right">Qty. to Adjust</TableHead>
                <TableHead className="text-right">Base Unit of Measure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location, index) => (
                <TableRow key={location.code || index}>
                  <TableCell>
                    {index === 0 && (
                      <div className="w-4 h-4 border border-gray-300 bg-white rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{location.code}</TableCell>
                  <TableCell>{location.name}</TableCell>
                  <TableCell className="text-right">{location.currentInventory}</TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={location.newInventory}
                      onChange={(e) => handleNewInventoryChange(index, e.target.value)}
                      className="w-20 text-right"
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${
                      location.qtyToAdjust > 0 ? 'text-green-600' :
                      location.qtyToAdjust < 0 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {location.qtyToAdjust > 0 ? '+' : ''}{location.qtyToAdjust}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{location.baseUnit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-700">
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
