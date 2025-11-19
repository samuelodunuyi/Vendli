import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/redux/services/products.services";

export interface NewProductForm {
  productName: string;
  description: string;
  sku: string;
  barcode: string;
  categoryId: number | null;
  basePrice: number;
  costPrice: number;
  basestock: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  unitOfMeasure: string;
  isActive: boolean;
}

export function useProductOperations(initialProducts: Product[]) {
  const [productList, setProductList] = useState(initialProducts);

  // Dialog states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<Product | null>(null);
  const [stockByStoreProduct, setStockByStoreProduct] = useState<Product | null>(null);
  const [adjustStockProduct, setAdjustStockProduct] = useState<Product | null>(null);
  const [transactionHistoryProduct, setTransactionHistoryProduct] = useState<Product | null>(null);
  const [recentOrdersProduct, setRecentOrdersProduct] = useState<Product | null>(null);

  const productsWithTransactions = ["1", "2", "4"];

  const [newProduct, setNewProduct] = useState<Product>({
    productName: "",
    description: "",
    sku: "",
    barcode: "",
    categoryId: null,
    basePrice: null,
    costPrice: null,
    minimumStockLevel: null,
    maximumStockLevel: null,
    unitOfMeasure: "pcs",
    isActive: true,
    additionalImages: [],
    basestock: null,
    imageUrl: "",
    productId: null,
    showInPOS: true,
    showInWeb: true,
    storeId: null
  });

  // Generate random SKU/barcode
  const generateBarcode = () => {
    setNewProduct(prev => ({
      ...prev,
      barcode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      sku: Math.random().toString(36).substring(2, 10).toUpperCase()
    }));
  };

  // Add product
  const handleAddProduct = () => {
    if (!newProduct.productName || !newProduct.basePrice || !newProduct.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const product: Product = {
      productId: Date.now(),
      productName: newProduct.productName,
      description: newProduct.description,
      sku: newProduct.sku,
      barcode: newProduct.barcode || newProduct.sku,
      categoryId: newProduct.categoryId,
      storeId: 1,
      basePrice: Number(newProduct.basePrice),
      costPrice: newProduct.costPrice ? Number(newProduct.costPrice) : Number(newProduct.basePrice),
      basestock: 0,
      minimumStockLevel: Number(newProduct.minimumStockLevel),
      maximumStockLevel: Number(newProduct.maximumStockLevel),
      unitOfMeasure: newProduct.unitOfMeasure,
      imageUrl: "/placeholder.svg",
      additionalImages: [],
      showInWeb: true,
      showInPOS: true,
      isActive: newProduct.isActive
    };

    setProductList([...productList, product]);
    setNewProduct({
      productName: "",
      description: "",
      sku: "",
      barcode: "",
      categoryId: null,
      basePrice: null,
      costPrice: null,
      minimumStockLevel: null,
      maximumStockLevel: null,
      unitOfMeasure: "pcs",
      isActive: true,
      additionalImages: [],
      basestock: null,
      imageUrl: "",
      productId: null,
      showInPOS: true,
      showInWeb: true,
      storeId: null
    });
    setIsAddProductOpen(false);
    toast.success("Product added successfully");
  };

  // Edit product
  const handleEditProduct = (product: Product) => setEditingProduct(product);

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    setProductList(productList.map(p => p.productId === editingProduct.productId ? editingProduct : p));
    setEditingProduct(null);
    toast.success("Product updated successfully");
  };

  // Delete product
  const handleDeleteProduct = (productId: number) => {
    if (productsWithTransactions.includes(String(productId))) {
      toast.error("Cannot delete product with inventory transaction records");
      return;
    }
    setProductList(productList.filter(p => p.productId !== productId));
    toast.success("Product deleted successfully");
  };

  // Export CSV
  const handleExportData = (filteredProducts: Product[]) => {
    const csvContent = [
      ["Product Name", "Category ID", "Price", "Stock", "Status", "Barcode"],
      ...filteredProducts.map(p => [
        p.productName,
        p.categoryId,
        p.basePrice.toString(),
        p.basestock.toString(),
        p.isActive ? "Active" : "Inactive",
        p.barcode || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Product data exported successfully");
  };

  // Dialog handlers
  const handleViewStockByStore = (product: Product) => setStockByStoreProduct(product);
  const handleAdjustStock = (product: Product) => setAdjustStockProduct(product);
  const handleViewTransactionHistory = (product: Product) => setTransactionHistoryProduct(product);
  const handleViewRecentOrders = (product: Product) => setRecentOrdersProduct(product);
  const handleOpenRestock = (product: Product) => setRestockingProduct(product);

  const handleRestockProduct = (productId: number, quantity: number) => {
    setProductList(productList.map(p => {
      if (p.productId === productId) return { ...p, basestock: (p.basestock || 0) + quantity };
      return p;
    }));
    setRestockingProduct(null);
    toast.success("Product restocked successfully");
  };

  return {
    productList,
    isAddProductOpen,
    setIsAddProductOpen,
    editingProduct,
    setEditingProduct,
    restockingProduct,
    setRestockingProduct,
    stockByStoreProduct,
    setStockByStoreProduct,
    adjustStockProduct,
    setAdjustStockProduct,
    transactionHistoryProduct,
    setTransactionHistoryProduct,
    recentOrdersProduct,
    setRecentOrdersProduct,
    newProduct,
    setNewProduct,
    productsWithTransactions,
    generateBarcode,
    handleAddProduct,
    handleEditProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleExportData,
    handleViewStockByStore,
    handleAdjustStock,
    handleRestockProduct,
    handleViewTransactionHistory,
    handleViewRecentOrders,
    handleOpenRestock
  };
}
