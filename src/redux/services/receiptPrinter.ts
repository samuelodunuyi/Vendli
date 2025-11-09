
import { Transaction } from "@/types";

export interface ReceiptPrinter {
  isAvailable: boolean;
  print: (transaction: Transaction) => Promise<void>;
  printTest: () => Promise<void>;
}

class BrowserReceiptPrinter implements ReceiptPrinter {
  get isAvailable(): boolean {
    return typeof window !== 'undefined' && 'print' in window;
  }

  async print(transaction: Transaction): Promise<void> {
    const receiptHTML = this.generateReceiptHTML(transaction);
    await this.printHTML(receiptHTML);
  }

  async printTest(): Promise<void> {
    const testHTML = this.generateTestReceiptHTML();
    await this.printHTML(testHTML);
  }

  private generateReceiptHTML(transaction: Transaction): string {
    const formatCurrency = (amount: number) => 
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0
      }).format(amount);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @media print {
              body { 
                margin: 0; 
                font-family: 'Courier New', monospace; 
                font-size: 12px; 
                width: 80mm;
              }
              .receipt { 
                width: 100%; 
                text-align: center; 
              }
              .line-item { 
                display: flex; 
                justify-content: space-between; 
                margin: 2px 0; 
              }
              .separator { 
                border-top: 1px dashed #000; 
                margin: 5px 0; 
              }
              .total { 
                font-weight: bold; 
                font-size: 14px; 
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h2>CW Retail POS</h2>
            <p>Receipt #: ${transaction.id}</p>
            <p>Date: ${new Date(transaction.timestamp).toLocaleString()}</p>
            <p>Cashier: ${transaction.cashierName}</p>
            ${transaction.customerName ? `<p>Customer: ${transaction.customerName}</p>` : ''}
            
            <div class="separator"></div>
            
            ${transaction.items.map(item => `
              <div class="line-item">
                <span>${item.product.name} x${item.quantity}</span>
                <span>${formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            `).join('')}
            
            <div class="separator"></div>
            
            <div class="line-item">
              <span>Subtotal:</span>
              <span>${formatCurrency(transaction.subtotal)}</span>
            </div>
            
            ${transaction.totalDiscount > 0 ? `
              <div class="line-item">
                <span>Discount:</span>
                <span>-${formatCurrency(transaction.totalDiscount)}</span>
              </div>
            ` : ''}
            
            <div class="line-item">
              <span>Tax:</span>
              <span>${formatCurrency(transaction.totalTax)}</span>
            </div>
            
            <div class="line-item total">
              <span>TOTAL:</span>
              <span>${formatCurrency(transaction.total)}</span>
            </div>
            
            <div class="separator"></div>
            
            <p>Payment: ${transaction.paymentMethod.name}</p>
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateTestReceiptHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Receipt</title>
          <style>
            @media print {
              body { 
                margin: 0; 
                font-family: 'Courier New', monospace; 
                font-size: 12px; 
                width: 80mm;
              }
            }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <h2>CW Retail POS</h2>
            <p>Printer Test</p>
            <p>Date: ${new Date().toLocaleString()}</p>
            <p>If you can read this, the printer is working!</p>
          </div>
        </body>
      </html>
    `;
  }

  private async printHTML(html: string): Promise<void> {
    const printWindow = window.open('', '_blank', 'width=300,height=400');
    if (!printWindow) {
      throw new Error('Could not open print window');
    }

    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load
    await new Promise(resolve => {
      printWindow.onload = resolve;
      setTimeout(resolve, 1000); // Fallback
    });
    
    printWindow.print();
    
    // Close window after printing
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  }
}

export const receiptPrinter = new BrowserReceiptPrinter();
