
import { useState } from "react";
import { Product } from "@/types";
import { toast } from "@/components/ui/sonner";

export function useProductOperations(initialProducts: Product[]) {
  const [productList, setProductList] = useState(initialProducts);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Mock data for products with transaction history
  const productsWithTransactions = ["1", "2", "4"];
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    barcode: "",
    discountPrice: "",
    lowStockAlert: "",
    status: "Active"
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: 0,
      barcode: newProduct.barcode || Date.now().toString(),
      imageUrl: "/placeholder.svg",
      status: newProduct.status as 'Active' | 'Inactive',
      createdAt: new Date().toISOString().split('T')[0],
      discountPrice: newProduct.discountPrice ? parseFloat(newProduct.discountPrice) : undefined,
      lowStockAlert: newProduct.lowStockAlert ? parseInt(newProduct.lowStockAlert) : 10
    };

    setProductList([...productList, product]);
    setNewProduct({ 
      name: "", 
      description: "", 
      price: "", 
      category: "", 
      barcode: "", 
      discountPrice: "", 
      lowStockAlert: "", 
      status: "Active" 
    });
    setIsAddProductOpen(false);
    toast.success("Product added successfully");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setProductList(productList.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    setEditingProduct(null);
    toast.success("Product updated successfully");
  };

  const handleDeleteProduct = (productId: string) => {
    if (productsWithTransactions.includes(productId)) {
      toast.error("Cannot delete product with inventory transaction records");
      return;
    }

    setProductList(productList.filter(p => p.id !== productId));
    toast.success("Product deleted successfully");
  };

  const handleExportData = (filteredProducts: Product[]) => {
    const csvContent = [
      ["Product Name", "Category", "Price", "Stock", "Status", "Barcode"],
      ...filteredProducts.map(p => [
        p.name,
        p.category,
        p.price.toString(),
        p.stock.toString(),
        p.status,
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
    toast.info(`Viewing stock availability for ${product.name} across all stores`);
  };

  const handleAdjustStock = (product: Product) => {
    toast.info(`Opening stock adjustment for ${product.name}`);
  };

  const handleViewTransactionHistory = (product: Product) => {
    toast.info(`Viewing transaction history for ${product.name}`);
  };

  const handleViewRecentOrders = (product: Product) => {
    toast.info(`Viewing recent orders for ${product.name}`);
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
