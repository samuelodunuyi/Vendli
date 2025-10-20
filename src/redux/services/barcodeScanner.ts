
export interface BarcodeScanner {
  isSupported: boolean;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  onScan: (callback: (barcode: string) => void) => void;
}

class WebBarcodeScanner implements BarcodeScanner {
  private scanCallback?: (barcode: string) => void;
  private isScanning = false;

  get isSupported(): boolean {
    return 'BarcodeDetector' in window || navigator.mediaDevices?.getUserMedia !== undefined;
  }

  async startScanning(): Promise<void> {
    if (this.isScanning) return;
    
    try {
      // Try to use native BarcodeDetector API if available
      if ('BarcodeDetector' in window) {
        await this.startNativeScanning();
      } else {
        // Fallback to camera-based scanning
        await this.startCameraScanning();
      }
      this.isScanning = true;
    } catch (error) {
      console.error('Failed to start barcode scanning:', error);
      throw new Error('Barcode scanning not available');
    }
  }

  stopScanning(): void {
    this.isScanning = false;
    // Stop any active scanning processes
  }

  onScan(callback: (barcode: string) => void): void {
    this.scanCallback = callback;
  }

  private async startNativeScanning(): Promise<void> {
    // Implementation for native BarcodeDetector
    console.log('Starting native barcode scanning...');
  }

  private async startCameraScanning(): Promise<void> {
    // Implementation for camera-based scanning
    console.log('Starting camera-based barcode scanning...');
  }

  // Simulate barcode scan for demo purposes
  simulateScan(barcode: string): void {
    if (this.scanCallback) {
      this.scanCallback(barcode);
    }
  }
}

export const barcodeScanner = new WebBarcodeScanner();
