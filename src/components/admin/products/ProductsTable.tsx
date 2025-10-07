
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, TrendingUp, History, ShoppingCart } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Product } from "@/types";
import { StockByStoreDialog } from "./StockByStoreDialog";
import { AdjustStockDialog } from "./AdjustStockDialog";
import { TransactionHistoryDialog } from "./TransactionHistoryDialog";
import { RecentOrdersDialog } from "./RecentOrdersDialog";
import { useProductDialogs } from "@/hooks/useProductDialogs";

interface ProductsTableProps {
  filteredProducts: Product[];
  productsWithTransactions: string[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onViewStockByStore: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
  onViewTransactionHistory: (product: Product) => void;
  onViewRecentOrders: (product: Product) => void;
}

export function ProductsTable({ 
  filteredProducts, 
  productsWithTransactions,
  onEditProduct,
  onDeleteProduct,
  onViewStockByStore,
  onAdjustStock,
  onViewTransactionHistory,
  onViewRecentOrders
}: ProductsTableProps) {
  const {
    stockByStoreProduct,
    setStockByStoreProduct,
    adjustStockProduct,
    setAdjustStockProduct,
    transactionHistoryProduct,
    setTransactionHistoryProduct,
    recentOrdersProduct,
    setRecentOrdersProduct
  } = useProductDialogs();

  const canDelete = (productId: string) => !productsWithTransactions.includes(productId);

  const getStockColor = (stock: number, lowStockAlert: number = 10) => {
    return stock <= lowStockAlert ? "text-red-600 font-semibold" : "text-green-600 font-semibold";
  };

  const handleViewStockByStore = (product: Product) => {
    setStockByStoreProduct(product);
    onViewStockByStore(product);
  };

  const handleAdjustStock = (product: Product) => {
    setAdjustStockProduct(product);
    onAdjustStock(product);
  };

  const handleViewTransactionHistory = (product: Product) => {
    setTransactionHistoryProduct(product);
    onViewTransactionHistory(product);
  };

  const handleViewRecentOrders = (product: Product) => {
    setRecentOrdersProduct(product);
    onViewRecentOrders(product);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.barcode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">₦{product.price.toLocaleString()}</td>
                    <td className="p-2">
                      <span className={getStockColor(product.stock, product.lowStockAlert)}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        className={`h-6 px-3 text-xs font-medium ${
                          product.status === 'Active' 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        {product.status}
                      </Button>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1 flex-wrap">
                        <Button variant="outline" size="sm" onClick={() => onEditProduct(product)} title="Edit Product">
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={() => handleViewStockByStore(product)} title="View Stock by Store">
                          <MapPin className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={() => handleAdjustStock(product)} title="Adjust Stock Balance">
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={() => handleViewTransactionHistory(product)} title="View Transaction History">
                          <History className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={() => handleViewRecentOrders(product)} title="View Recent Orders">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                        
                        {canDelete(product.id) ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" title="Delete Product">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteProduct(product.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button variant="outline" size="sm" disabled title="Cannot delete product with transaction history">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Components */}
      <StockByStoreDialog
        open={!!stockByStoreProduct}
        onOpenChange={(open) => !open && setStockByStoreProduct(null)}
        product={stockByStoreProduct}
      />

      <AdjustStockDialog
        open={!!adjustStockProduct}
        onOpenChange={(open) => !open && setAdjustStockProduct(null)}
        product={adjustStockProduct}
      />

      <TransactionHistoryDialog
        open={!!transactionHistoryProduct}
        onOpenChange={(open) => !open && setTransactionHistoryProduct(null)}
        product={transactionHistoryProduct}
      />

      <RecentOrdersDialog
        open={!!recentOrdersProduct}
        onOpenChange={(open) => !open && setRecentOrdersProduct(null)}
        product={recentOrdersProduct}
      />
    </>
  );
}
