
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

export function ProductsManagement() {
  const productOperations = useProductOperations(products);
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

  return (
    <div className="space-y-6">
      <ProductsSummaryCards 
        productList={productOperations.productList}
        lowStockProducts={lowStockProducts}
        categories={categories}
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
            categories={categories}
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
        categories={categories}
        onAddProduct={productOperations.handleAddProduct}
        onCancel={() => productOperations.setIsAddProductOpen(false)}
      />

      <ProductsLowStockAlert lowStockProducts={lowStockProducts} />

      <ProductsTable 
        filteredProducts={filteredProducts}
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
        categories={categories}
        onUpdateProduct={productOperations.handleUpdateProduct}
      />
    </div>
  );
}
