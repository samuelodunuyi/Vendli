import { ProductsSummaryCards } from "./products/ProductsSummaryCards";
import { ProductsAdvancedFilters } from "./products/ProductsAdvancedFilters";
import { ProductsLowStockAlert } from "./products/ProductsLowStockAlert";
import { ProductsTable } from "./products/ProductsTable";
import { AddProductDialog } from "./products/AddProductDialog";
import { EditProductDialog } from "./products/EditProductDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Plus } from "lucide-react";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useProductOperations } from "@/hooks/useProductOperations";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "@/redux/services/products.services";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function ProductsManagement() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery({
    page,
    itemsPerPage,
    categoryId: selectedCategoryId,
  });

  const { data: categoriesData } = useGetCategoriesQuery({});

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const productOperations = useProductOperations(productsData?.products || []);
  const {
    searchQuery,
    setSearchQuery,
    filters,
    filteredProducts,
    lowStockProducts,
    handleApplyFilters,
    handleClearFilters,
  } = useProductFilters(productOperations.productList);

  const handleAddProduct = async () => {
    try {
      const p = productOperations.newProduct;
      const productPayload = {
        productName: p.productName,
        description: p.description,
        sku: p.barcode,
        barcode: p.barcode,
        categoryId: Number(p.categoryId),
        storeId: 1,
        basePrice: Number(p.basePrice),
        costPrice: Number(p.costPrice || 0),
        currentStock: Number(p.currentStock),
        minimumStockLevel: Number(p.minimumStockLevel || 5),
        maximumStockLevel: Number(p.maximumStockLevel || 5),
        unitOfMeasure: "pcs",
        imageUrl: "",
        additionalImages: [],
        showInWeb: true,
        showInPOS: true,
        isActive: Boolean(p.isActive),
      };

      await createProduct(productPayload).unwrap();
      toast.success("Product added successfully!");
      productOperations.setIsAddProductOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  // ✅ Handle update product
  const handleUpdateProduct = async () => {
    if (!productOperations.editingProduct) return;
    const p = productOperations.editingProduct;

    const updatePayload = {
      productName: p.productName,
      description: p.description,
      sku: p.sku,
      barcode: p.barcode,
      categoryId: Number(p.categoryId),
      storeId: Number(p.storeId),
      basePrice: Number(p.basePrice),
      costPrice: Number(p.costPrice),
      currentStock: Number(p.currentStock),
      minimumStockLevel: Number(p.minimumStockLevel),
      maximumStockLevel: Number(p.maximumStockLevel || 0),
      unitOfMeasure: p.unitOfMeasure,
      imageUrl: p.imageUrl || "",
      additionalImages: p.additionalImages || [],
      showInWeb: Boolean(p.showInWeb),
      showInPOS: Boolean(p.showInPOS),
      isActive: Boolean(p.isActive),
    };

    try {
      await updateProduct({ id: p.productId, body: updatePayload }).unwrap();
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
        productList={productsData?.products || []}
        lowStockProducts={lowStockProducts}
        categories={categoriesData?.categories}
      />

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <ProductsAdvancedFilters
            categories={categoriesData?.categories}
            onApplyFilters={(filters) => {
              if (filters.categoryId) setSelectedCategoryId(filters.categoryId);
              handleApplyFilters(filters);
            }}
            activeFilters={filters}
            onClearFilters={() => {
              setSelectedCategoryId(undefined);
              handleClearFilters();
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
            className="font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <AddProductDialog
        open={productOperations.isAddProductOpen}
        onOpenChange={productOperations.setIsAddProductOpen}
        newProduct={productOperations.newProduct}
        setNewProduct={productOperations.setNewProduct}
        categories={categoriesData?.categories}
        isCreating={isCreating}
        onAddProduct={handleAddProduct}
        onCancel={() => productOperations.setIsAddProductOpen(false)}
      />

      <ProductsLowStockAlert lowStockProducts={lowStockProducts} />

      <ProductsTable
        filteredProducts={productsData?.products || []}
        productsWithTransactions={productOperations.productsWithTransactions}
        onEditProduct={productOperations.handleEditProduct}
        onDeleteProduct={productOperations.handleDeleteProduct}
        onViewStockByStore={productOperations.handleViewStockByStore}
        onAdjustStock={productOperations.handleAdjustStock}
        onViewTransactionHistory={productOperations.handleViewTransactionHistory}
        onViewRecentOrders={productOperations.handleViewRecentOrders}
      />

      <EditProductDialog
        editingProduct={productOperations.editingProduct}
        setEditingProduct={productOperations.setEditingProduct}
        categories={categoriesData?.categories}
        isUpdating={isUpdating}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  );
}
