import React, { createContext, useContext, useState } from "react";
import { CartItem, Product, Tax, PaymentMethod, Transaction, Discount } from "@/types";
import { mockTransactions } from "@/data/mockTransactions";

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
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (productId: string, discount: Discount) => void;
  setDeliveryProvider: (provider: DeliveryProvider | null) => void;
  completeTransaction: (paymentMethod: PaymentMethod, customerName?: string, customerPhone?: string) => Transaction;
  voidTransaction: (transactionId: string, reason: string, approver: string) => void;
  returnTransaction: (transactionId: string, reason: string, approver: string) => void;
}

const CartContext = createContext<CartContextProps>({
  items: [],
  transactions: [],
  itemCount: 0,
  subtotal: 0,
  totalDiscount: 0,
  totalTax: 0,
  deliveryCost: 0,
  total: 0,
  selectedDeliveryProvider: null,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  applyDiscount: () => {},
  setDeliveryProvider: () => {},
  completeTransaction: () => ({} as Transaction),
  voidTransaction: () => {},
  returnTransaction: () => {},
});

const useCart = () => useContext(CartContext);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedDeliveryProvider, setSelectedDeliveryProvider] = useState<DeliveryProvider | null>(null);
  const [taxes, setTaxes] = useState<Tax[]>([
    { id: "vat", name: "VAT", rate: 0.075, description: "Value Added Tax (7.5%)" }
  ]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalDiscount = items.reduce((sum, item) => sum + ((item.product.price * item.quantity) * (item.discount?.value || 0) / 100), 0);
  const totalTax = subtotal * taxes[0].rate;
  const deliveryCost = selectedDeliveryProvider?.estimatedCost || 0;
  const total = subtotal - totalDiscount + totalTax + deliveryCost;

  const setDeliveryProvider = (provider: DeliveryProvider | null) => {
    setSelectedDeliveryProvider(provider);
  };

  const addToCart = (product: Product, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyDiscount = (productId: string, discount: Discount) => {
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, discount } : item
      )
    );
  };

  const completeTransaction = (paymentMethod: PaymentMethod, customerName: string = "", customerPhone: string = ""): Transaction => {
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
      cashierName: "Current User", // In a real app, this would come from auth
      timestamp: new Date().toISOString(),
      status: "completed"
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setItems([]);
    setSelectedDeliveryProvider(null); // Clear delivery provider after transaction
    return newTransaction;
  };

  const voidTransaction = (transactionId: string, reason: string, approver: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === transactionId ? { ...transaction, status: "voided", voidReason: reason, approvedBy: approver } : transaction
      )
    );
  };

  const returnTransaction = (transactionId: string, reason: string, approver: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === transactionId ? { ...transaction, status: "returned", returnReason: reason, approvedBy: approver } : transaction
      )
    );
  };

  const value: CartContextProps = {
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
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, useCart };
