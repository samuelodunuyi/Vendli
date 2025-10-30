
import { products } from "@/data/products";
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
import { useGetProductsQuery, useCreateProductMutation, useGetCategoriesQuery, useDeleteProductMutation, useUpdateProductMutation} from "@/redux/services/products.services";
import { toast } from "sonner";

export function ProductsManagement() {
    const { data, isLoading, isError } = useGetProductsQuery({});
    const { data: categoryData } = useGetCategoriesQuery({});
      const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
      const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const productOperations = useProductOperations(data);

  const {
    searchQuery,
    setSearchQuery,
    filters,
    filteredProducts,
    lowStockProducts,
    categories,
    handleApplyFilters,
    handleClearFilters
  } = useProductFilters(productOperations.productList);

    const handleAddProduct = async () => {
    try {
      const productPayload = {
        productName: productOperations.newProduct.productName,
        description: productOperations.newProduct.description,
        sku: productOperations.newProduct.barcode,
        barcode: productOperations.newProduct.barcode,
        categoryId: 1, 
        storeId: 1, 
        basePrice: productOperations.newProduct.basePrice,
        costPrice: productOperations.newProduct.costPrice || 0,
        currentStock: productOperations.newProduct.currentStock,
        minimumStockLevel: productOperations.newProduct.minimumStockLevel || 5,
        maximumStockLevel: productOperations.newProduct.maximumStockLevel || 5,
        unitOfMeasure: "pcs",
        imageUrl: "",
        additionalImages: [],
        showInWeb: true,
        showInPOS: true,
        isActive: productOperations.newProduct.isActive,
      };

      await createProduct(productPayload).unwrap();
      toast.success("Product added successfully!");
      productOperations.setIsAddProductOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

const handleUpdateProduct = async () => {
  if (!productOperations.editingProduct) return;

  const p = productOperations.editingProduct;

  // Build the payload explicitly like in create
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
    maximumStockLevel: 0,
    unitOfMeasure: p.unitOfMeasure,
    imageUrl: p.imageUrl || "",
    additionalImages: p.additionalImages || [],
    showInWeb: Boolean(p.showInWeb),
    showInPOS: Boolean(p.showInPOS),
    isActive: Boolean(p.isActive),
  };

  try {
    await updateProduct({
      id: p.productId,
      body: updatePayload,
    }).unwrap();

    toast.success("Product updated successfully!");
    productOperations.setEditingProduct(null);
  } catch (error) {
    console.error(error);
    toast.error("Failed to update product");
  }
};

  return (
    <div className="space-y-6">
      <ProductsSummaryCards 
        productList={data}
        lowStockProducts={lowStockProducts}
        categories={categoryData}
      />

      {/* Combined Actions Bar */}
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
            categories={categoryData}
            onApplyFilters={handleApplyFilters}
            activeFilters={filters}
            onClearFilters={handleClearFilters}
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
        categories={categoryData}
        isCreating = {isCreating}
        onAddProduct={handleAddProduct}
        onCancel={() => productOperations.setIsAddProductOpen(false)}
      />

      <ProductsLowStockAlert lowStockProducts={lowStockProducts} />

      <ProductsTable 
        filteredProducts={data}
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
        categories={categoryData}
        isUpdating ={isUpdating}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  );
}
