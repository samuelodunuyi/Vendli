import type { Order } from "./orders.services";
import { PAYMENT_OPTION, orderTotal } from "@/lib/enums";
import { formatCurrency, formatDateTime, fullName } from "@/lib/format";
import { VAT_RATE } from "@/lib/pricing";

// Everything interpolated into the receipt is user-controlled data, so escape it.
const esc = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const page = (title: string, body: string) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>
  body { margin: 0; padding: 8px; font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; }
  h2 { margin: 0 0 4px; text-align: center; }
  p { margin: 2px 0; }
  .c { text-align: center; }
  .row { display: flex; justify-content: space-between; gap: 8px; margin: 2px 0; }
  .sep { border-top: 1px dashed #000; margin: 6px 0; }
  .total { font-weight: bold; font-size: 14px; }
</style></head><body>${body}</body></html>`;

function print(html: string) {
  const w = window.open("", "_blank", "width=340,height=600");
  if (!w) throw new Error("Allow pop-ups to print receipts");
  w.document.write(html);
  w.document.close();
  w.focus();
  w.onafterprint = () => w.close();
  setTimeout(() => w.print(), 250);
}

export const receiptPrinter = {
  printOrder(order: Order, storeName: string) {
    const total = orderTotal(order);
    const vat = Math.round(total * VAT_RATE);
    const lines = order.orderItems
      .map((i) => `<div class="row"><span>${esc(i.productName)} x${i.quantity}</span><span>${esc(formatCurrency(i.priceAtOrder * i.quantity))}</span></div>`)
      .join("");
    print(
      page(
        `Receipt #${order.id}`,
        `<h2>Vendli</h2>
         <p class="c">${esc(storeName)}</p>
         <div class="sep"></div>
         <p>Receipt: #${order.id}</p>
         <p>Date: ${esc(formatDateTime(order.orderDate))}</p>
         <p>Cashier: ${esc(order.createdBy)}</p>
         ${order.customer.id ? `<p>Customer: ${esc(fullName(order.customer))}</p>` : ""}
         <div class="sep"></div>${lines}<div class="sep"></div>
         <div class="row"><span>Subtotal</span><span>${esc(formatCurrency(total))}</span></div>
         <div class="row"><span>VAT (${VAT_RATE * 100}%)</span><span>${esc(formatCurrency(vat))}</span></div>
         <div class="row total"><span>TOTAL</span><span>${esc(formatCurrency(total + vat))}</span></div>
         <div class="sep"></div>
         <p>Paid by ${esc(PAYMENT_OPTION[order.paymentOption])}</p>
         <p class="c">Thank you for shopping with us!</p>`
      )
    );
  },

  printTest() {
    print(page("Printer test", `<h2>Vendli POS</h2><p class="c">Printer test · ${esc(new Date().toLocaleString())}</p>`));
  },
};
