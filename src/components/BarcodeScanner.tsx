
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Scan, Camera, Keyboard } from "lucide-react";
import { barcodeScanner } from "@/redux/services/barcodeScanner";
import { toast } from "@/components/ui/sonner";

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ open, onOpenChange, onScan }: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    barcodeScanner.onScan((barcode) => {
      onScan(barcode);
      onOpenChange(false);
      setIsScanning(false);
    });
  }, [onScan, onOpenChange]);

  const handleStartScanning = async () => {
    try {
      setIsScanning(true);
      await barcodeScanner.startScanning();
      toast.success("Barcode scanner activated");
    } catch (error) {
      setIsScanning(false);
      toast.error("Failed to start barcode scanner");
    }
  };

  const handleStopScanning = () => {
    barcodeScanner.stopScanning();
    setIsScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode("");
      onOpenChange(false);
    }
  };

  const handleTestScan = () => {
    // Simulate scanning a test barcode
    barcodeScanner.simulateScan("1234567890123");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Barcode Scanner</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {barcodeScanner.isSupported ? (
            <div className="space-y-3">
              <div className="text-center">
                {isScanning ? (
                  <div className="space-y-3">
                    <div className="animate-pulse">
                      <Camera className="h-16 w-16 mx-auto text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600">Scanner active - point camera at barcode</p>
                    <Button onClick={handleStopScanning} variant="outline">
                      Stop Scanning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button onClick={handleStartScanning} className="w-full">
                      <Scan className="mr-2 h-4 w-4" />
                      Start Camera Scanner
                    </Button>
                    <Button onClick={handleTestScan} variant="outline" className="w-full">
                      Test Scan (Demo)
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Camera className="h-16 w-16 mx-auto mb-2 opacity-50" />
              <p>Camera scanner not supported on this device</p>
            </div>
          )}

          <div className="border-t pt-4">
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Manual Entry</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode manually"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!manualBarcode.trim()}>
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
