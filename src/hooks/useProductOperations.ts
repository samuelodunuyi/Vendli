import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/redux/services/products.services";

// Form type for new product
export interface NewProductForm {
  productName: string;
  description: string;
  sku: string;
  barcode: string;
  categoryId: number | null;
  basePrice: number;
  costPrice: number;
  currentStock: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  unitOfMeasure: string;
  isActive: boolean;
}

export function useProductOperations(initialProducts: Product[]) {
  const [productList, setProductList] = useState(initialProducts);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock data for products with transaction history
  const productsWithTransactions = ["1", "2", "4"];

  // Form state for new product
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
    currentStock: null,
    imageUrl: "",
    productId: null,
    showInPOS: true,
    showInWeb: true,
    storeId: null
  });

  const generateBarcode = () => {
    setNewProduct(prev => ({
      ...prev,
      barcode: Math.random().toString(36).substring(2, 10).toUpperCase()
    }));
  };

  const handleAddProduct = () => {
    if (!newProduct.productName || !newProduct.basePrice || !newProduct.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const product: Product = {
      productId: Date.now(), // placeholder ID
      productName: newProduct.productName,
      description: newProduct.description,
      sku: newProduct.sku,
      barcode: newProduct.barcode || newProduct.sku,
      categoryId: newProduct.categoryId,
      storeId: 1, // default store
      basePrice: Number(newProduct.basePrice),
      costPrice: newProduct.costPrice ? Number(newProduct.costPrice) : Number(newProduct.basePrice),
      currentStock: 0,
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

    // Reset form
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
    currentStock: null,
    imageUrl: "",
    productId: null,
    showInPOS: true,
    showInWeb: true,
    storeId: null
    });

    setIsAddProductOpen(false);
    toast.success("Product added successfully");
  };

  const handleEditProduct = (product: Product) => setEditingProduct(product);

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setProductList(productList?.map(p => p.productId === editingProduct.productId ? editingProduct : p));
    setEditingProduct(null);
    toast.success("Product updated successfully");
  };

  const handleDeleteProduct = (productId: number) => {
    if (productsWithTransactions.includes(String(productId))) {
      toast.error("Cannot delete product with inventory transaction records");
      return;
    }
    setProductList(productList?.filter(p => p.productId !== productId));
    toast.success("Product deleted successfully");
  };

  const handleExportData = (filteredProducts: Product[]) => {
    const csvContent = [
      ["Product Name", "Category ID", "Price", "Stock", "Status", "Barcode"],
      ...filteredProducts.map(p => [
        p.productName,
        p.categoryId,
        p.basePrice.toString(),
        p.currentStock.toString(),
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

  const handleViewStockByStore = (product: Product) => {
    toast.info(`Viewing stock availability for ${product.productName} across all stores`);
  };

  const handleAdjustStock = (product: Product) => {
    toast.info(`Opening stock adjustment for ${product.productName}`);
  };

  const handleViewTransactionHistory = (product: Product) => {
    toast.info(`Viewing transaction history for ${product.productName}`);
  };

  const handleViewRecentOrders = (product: Product) => {
    toast.info(`Viewing recent orders for ${product.productName}`);
  };

  return {
    productList,
    isAddProductOpen,
    setIsAddProductOpen,
    editingProduct,
    setEditingProduct,
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
    handleViewTransactionHistory,
    handleViewRecentOrders
  };
}
