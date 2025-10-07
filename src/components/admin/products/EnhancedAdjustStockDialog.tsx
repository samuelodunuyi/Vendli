
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WorkflowGuide } from "@/components/WorkflowGuide";
import { inventoryAdjustmentSteps } from "@/data/workflows";
import { Product } from "@/types";
import { TrendingUp, AlertTriangle, FileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface EnhancedAdjustStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const mockLocations = [
  { code: "", name: "(Unspecified Location)", currentInventory: 8, newInventory: 8, qtyToAdjust: 0, baseUnit: "PCS" },
  { code: "MAIN", name: "Main Store", currentInventory: 0, newInventory: 0, qtyToAdjust: 0, baseUnit: "PCS" },
  { code: "ABJ", name: "Abuja Depot", currentInventory: 0, newInventory: 0, qtyToAdjust: 0, baseUnit: "PCS" },
  { code: "PH", name: "Port Harcourt Depot", currentInventory: 0, newInventory: 0, qtyToAdjust: 0, baseUnit: "PCS" },
];

export function EnhancedAdjustStockDialog({ open, onOpenChange, product }: EnhancedAdjustStockDialogProps) {
  const [locations, setLocations] = useState(mockLocations);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [approverName, setApproverName] = useState("");

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
    
    if (!adjustmentReason.trim()) {
      toast.error("Please provide a reason for the adjustment");
      return;
    }
    
    if (Math.abs(totalAdjustment) > 10 && !approverName.trim()) {
      toast.error("Manager approval required for adjustments over 10 units");
      return;
    }

    if (totalAdjustment !== 0) {
      toast.success(`Stock adjusted by ${totalAdjustment} units for ${product.name}`);
    }
    onOpenChange(false);
  };

  const totalAdjustment = locations.reduce((sum, loc) => sum + loc.qtyToAdjust, 0);
  const requiresApproval = Math.abs(totalAdjustment) > 10;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Adjust Inventory - {product.barcode} - {product.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Inventory Adjustment Guidelines</span>
              </div>
              <p className="text-sm text-orange-700 mb-2">
                Inventory adjustments must be properly documented and approved. Follow the guided workflow for compliance.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowWorkflow(true)}
              >
                Start Guided Adjustment Process
              </Button>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Adjustment Reason *</label>
                <Textarea
                  placeholder="Explain why this adjustment is necessary..."
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  rows={3}
                />
              </div>
              
              {requiresApproval && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Manager Approval Required *</label>
                  <Input
                    placeholder="Manager name for approval"
                    value={approverName}
                    onChange={(e) => setApproverName(e.target.value)}
                  />
                  <p className="text-xs text-orange-600">
                    Adjustments over 10 units require manager approval
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                Total Adjustment: <span className={`font-medium ${
                  totalAdjustment > 0 ? 'text-green-600' : 
                  totalAdjustment < 0 ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {totalAdjustment > 0 ? '+' : ''}{totalAdjustment} units
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-700">
                  Submit Adjustment
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <WorkflowGuide
        title="Inventory Adjustment Workflow"
        description="Follow these steps to properly document and process inventory adjustments."
        steps={inventoryAdjustmentSteps}
        isVisible={showWorkflow}
        onClose={() => setShowWorkflow(false)}
      >
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Adjustment Summary</h4>
            <p className="text-sm text-blue-700">
              Product: {product.name} | Total Adjustment: {totalAdjustment > 0 ? '+' : ''}{totalAdjustment} units
            </p>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Documentation Checklist</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>✓ Physical count completed</div>
              <div>✓ Discrepancy identified</div>
              <div>✓ Photos taken (if applicable)</div>
              <div>✓ Reason documented</div>
            </div>
          </div>
        </div>
      </WorkflowGuide>
    </>
  );
}
