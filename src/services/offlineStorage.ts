
import { Transaction, Product, CartItem } from "@/types";

export interface OfflineData {
  cart: CartItem[];
  transactions: Transaction[];
  products: Product[];
  lastSync: string;
}

class OfflineStorageService {
  private readonly STORAGE_KEY = 'easyshop_offline_data';

  get isSupported(): boolean {
    return typeof localStorage !== 'undefined';
  }

  saveData(data: Partial<OfflineData>): void {
    if (!this.isSupported) return;

    try {
      const existingData = this.loadData();
      const updatedData = { ...existingData, ...data, lastSync: new Date().toISOString() };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  loadData(): OfflineData {
    if (!this.isSupported) {
      return this.getDefaultData();
    }

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }

    return this.getDefaultData();
  }

  clearData(): void {
    if (!this.isSupported) return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  saveTransaction(transaction: Transaction): void {
    const data = this.loadData();
    data.transactions = [transaction, ...data.transactions];
    this.saveData(data);
  }

  saveCart(cart: CartItem[]): void {
    this.saveData({ cart });
  }

  private getDefaultData(): OfflineData {
    return {
      cart: [],
      transactions: [],
      products: [],
      lastSync: new Date().toISOString()
    };
  }
}

export const offlineStorage = new OfflineStorageService();
