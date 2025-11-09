import React, { createContext, useContext, useState } from "react";
import { CartItem, Tax, Transaction, Discount } from "@/types";
import { mockTransactions } from "@/data/mockTransactions";
import { Product } from "@/redux/services/products.services";

enum PaymentMethod {
  PAYMENT_CASH = 0,
  PAYMENT_CARD = 1,
  PAYMENT_BANK_TRANSFER = 2,
}

interface DeliveryProvider {
  id: string;
  name: string;
  estimatedCost: number;
  estimatedTime: string;
}

interface CartContextProps {
  items: CartItem[];
  transactions: Transaction[];
  itemCount: number;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  deliveryCost: number;
  total: number;
  selectedDeliveryProvider: DeliveryProvider | null;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (productId: number, discount: Discount) => void;
  setDeliveryProvider: (provider: DeliveryProvider | null) => void;
  completeTransaction: (
    paymentMethod: PaymentMethod,
    customerName?: string,
    customerPhone?: string
  ) => Transaction;
  voidTransaction: (transactionId: string, reason: string, approver: string) => void;
  returnTransaction: (transactionId: string, reason: string, approver: string) => void;
}

const CartContext = createContext<CartContextProps>({} as CartContextProps);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedDeliveryProvider, setSelectedDeliveryProvider] = useState<DeliveryProvider | null>(null);

  const [taxes] = useState<Tax[]>([
    { id: "vat", name: "VAT", rate: 0.075, description: "Value Added Tax (7.5%)" },
  ]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);
  const totalDiscount = items.reduce(
    (sum, item) => sum + ((item.product.basePrice * item.quantity) * (item.discount?.value || 0) / 100),
    0
  );
  const totalTax = subtotal * taxes[0].rate;
  const deliveryCost = selectedDeliveryProvider?.estimatedCost || 0;
  const total = subtotal - totalDiscount + totalTax + deliveryCost;

  const addToCart = (product: Product, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.productId === product.productId);
      if (existing) {
        return prev.map(item =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(item => item.product.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.product.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const applyDiscount = (productId: number, discount: Discount) => {
    setItems(prev =>
      prev.map(item =>
        item.product.productId === productId ? { ...item, discount } : item
      )
    );
  };

  const setDeliveryProvider = (provider: DeliveryProvider | null) => setSelectedDeliveryProvider(provider);

  const completeTransaction = (
    paymentMethod: PaymentMethod,
    customerName = "",
    customerPhone = ""
  ): Transaction => {
    const newTransaction: Transaction = {
      id: `TXN-${Date.now()}`,
      items: [...items],
      subtotal,
      totalDiscount,
      totalTax,
      total,
      paymentMethod,
      customerName,
      customerPhone,
      cashierName: "Current User",
      timestamp: new Date().toISOString(),
      status: "completed",
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setItems([]);
    setSelectedDeliveryProvider(null);

    return newTransaction;
  };

  const voidTransaction = (transactionId: string, reason: string, approver: string) => {
    setTransactions(prev =>
      prev.map(txn =>
        txn.id === transactionId ? { ...txn, status: "voided", voidReason: reason, approvedBy: approver } : txn
      )
    );
  };

  const returnTransaction = (transactionId: string, reason: string, approver: string) => {
    setTransactions(prev =>
      prev.map(txn =>
        txn.id === transactionId ? { ...txn, status: "returned", returnReason: reason, approvedBy: approver } : txn
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        transactions,
        itemCount,
        subtotal,
        totalDiscount,
        totalTax,
        deliveryCost,
        total,
        selectedDeliveryProvider,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyDiscount,
        setDeliveryProvider,
        completeTransaction,
        voidTransaction,
        returnTransaction,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
