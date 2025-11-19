// ProductsManagement.tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Plus } from "lucide-react";

import { ProductsSummaryCards } from "./products/ProductsSummaryCards";
import { ProductsAdvancedFilters } from "./products/ProductsAdvancedFilters";
import { ProductsLowStockAlert } from "./products/ProductsLowStockAlert";
import { ProductsTable } from "./products/ProductsTable";
import { AddProductDialog } from "./products/AddProductDialog";
import { EditProductDialog } from "./products/EditProductDialog";
import { RestockDialog } from "./products/RestockDialog";

import { useProductFilters } from "@/hooks/useProductFilters";
import { useProductOperations } from "@/hooks/useProductOperations";

import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useRestockProductMutation,
  useUnstockProductMutation,
  Product,
} from "@/redux/services/products.services";

export function ProductsManagement() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stockByStoreProduct, setStockByStoreProduct] = useState<Product | null>(null);
  const [adjustStockProduct, setAdjustStockProduct] = useState<Product | null>(null);
  const [transactionHistoryProduct, setTransactionHistoryProduct] = useState<Product | null>(null);
  const [recentOrdersProduct, setRecentOrdersProduct] = useState<Product | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<Product | null>(null);

  const { data: categoriesData } = useGetCategoriesQuery({});

  const {
    searchQuery,
    setSearchQuery,
    filters,
    filteredProducts,
    handleApplyFilters,
    handleClearFilters,
  } = useProductFilters([]);

  const { data: productsData, refetch } = useGetProductsQuery({
    page,
    search: searchQuery,
    itemsPerPage,
    categoryId: selectedCategoryId ?? undefined,
  });

  const productList = productsData?.products || [];
  const productOperations = useProductOperations(productList);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [restockProductMutation, { isLoading: isRestocking }] = useRestockProductMutation();
  const [unstockProductMutation, { isLoading: isUnstocking }] = useUnstockProductMutation();

  const handleOpenRestockDialog = (product: Product) => {
    productOperations.setRestockingProduct(product);
  };

  const lowStockProducts = productList.filter(
    (p) => p.basestock <= (p.minimumStockLevel || 5)
  );

  const handleRestockSubmit = async (data: {
    productId: number;
    quantity: number;
    reference: string;
    reason: string;
    type?: "restock" | "unstock";
  }) => {
    try {
      let result;
      if (data.type === "unstock") {
        result = await unstockProductMutation(data).unwrap();
      } else {
        result = await restockProductMutation(data).unwrap();
      }
      toast.success(`${result.message} — New stock: ${result.basestock}`);
      productOperations.setRestockingProduct(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update stock");
    }
  };

  const handleAddProduct = async () => {
    try {
      const p = productOperations.newProduct;
      const payload = {
        productName: p.productName,
        description: p.description,
        sku: p.barcode,
        barcode: p.barcode,
        categoryId: Number(p.categoryId),
        basePrice: Number(p.basePrice),
        costPrice: Number(p.costPrice || 0),
        basestock: Number(p.basestock || 0),
        minimumStockLevel: Number(p.minimumStockLevel || 5),
        maximumStockLevel: Number(p.maximumStockLevel || 5),
        unitOfMeasure: p.unitOfMeasure,
        imageUrl: "",
        additionalImages: [],
        showInWeb: true,
        showInPOS: true,
        isActive: Boolean(p.isActive),
      };
      await createProduct(payload).unwrap();
      toast.success("Product added successfully!");
      productOperations.setIsAddProductOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  const handleUpdateProduct = async () => {
    if (!productOperations.editingProduct) return;
    const p = productOperations.editingProduct;
    const payload = {
      productName: p.productName,
      description: p.description,
      sku: p.sku,
      barcode: p.barcode,
      categoryId: Number(p.categoryId),
      storeId: Number(p.storeId),
      basePrice: Number(p.basePrice),
      costPrice: Number(p.costPrice),
      basestock: Number(p.basestock),
      minimumStockLevel: Number(p.minimumStockLevel || 0),
      maximumStockLevel: Number(p.maximumStockLevel || 0),
      unitOfMeasure: p.unitOfMeasure,
      imageUrl: p.imageUrl || "",
      additionalImages: p.additionalImages || [],
      showInWeb: Boolean(p.showInWeb),
      showInPOS: Boolean(p.showInPOS),
      isActive: Boolean(p.isActive),
    };
    try {
      await updateProduct({ id: p.productId, body: payload }).unwrap();
      toast.success("Product updated successfully!");
      productOperations.setEditingProduct(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  useEffect(() => {
    refetch();
  }, [page, itemsPerPage, selectedCategoryId]);

  return (
    <div className="space-y-6">
      <ProductsSummaryCards
        productList={productList}
        lowStockProducts={lowStockProducts}
        categories={categoriesData?.categories}
      />

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search products..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 items-center">
          <ProductsAdvancedFilters
            categories={categoriesData?.categories ?? []}
            activeFilters={filters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onApplyFilters={(filters) => {
              setSelectedCategoryId(filters.categoryId);
              handleApplyFilters(filters);
              refetch();
            }}
            onClearFilters={() => {
              setSelectedCategoryId(null);
              handleClearFilters();
              refetch();
            }}
          />

          <Button
            variant="outline"
            onClick={() => productOperations.handleExportData(filteredProducts)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Button
            onClick={() => productOperations.setIsAddProductOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <AddProductDialog
        open={productOperations.isAddProductOpen}
        onOpenChange={productOperations.setIsAddProductOpen}
        newProduct={productOperations.newProduct}
        setNewProduct={productOperations.setNewProduct}
        categories={categoriesData?.categories}
        onAddProduct={handleAddProduct}
        isCreating={isCreating}
        onCancel={() => productOperations.setIsAddProductOpen(false)}
      />

      <EditProductDialog
        editingProduct={productOperations.editingProduct}
        setEditingProduct={productOperations.setEditingProduct}
        categories={categoriesData?.categories}
        onUpdateProduct={handleUpdateProduct}
        isUpdating={isUpdating}
      />

      <ProductsLowStockAlert lowStockProducts={lowStockProducts} />

      <ProductsTable
        filteredProducts={productList}
        productsWithTransactions={productOperations.productsWithTransactions}
        onEditProduct={productOperations.handleEditProduct}
        onDeleteProduct={productOperations.handleDeleteProduct}
        onViewStockByStore={productOperations.handleViewStockByStore}
        onAdjustStock={productOperations.handleAdjustStock}
        onOpenRestock={handleOpenRestockDialog}
        onViewTransactionHistory={productOperations.handleViewTransactionHistory}
        onViewRecentOrders={productOperations.handleViewRecentOrders}
        stockByStoreProduct={stockByStoreProduct}
        setStockByStoreProduct={setStockByStoreProduct}
        adjustStockProduct={adjustStockProduct}
        setAdjustStockProduct={setAdjustStockProduct}
        transactionHistoryProduct={transactionHistoryProduct}
        setTransactionHistoryProduct={setTransactionHistoryProduct}
        recentOrdersProduct={recentOrdersProduct}
        setRecentOrdersProduct={setRecentOrdersProduct}
        restockingProduct={restockingProduct}
        setRestockingProduct={setRestockingProduct}
      />

      <RestockDialog
        open={!!productOperations.restockingProduct}
        onOpenChange={(open) => !open && productOperations.setRestockingProduct(null)}
        product={productOperations.restockingProduct}
        onSubmitRestock={handleRestockSubmit}
      />
    </div>
  );
}
