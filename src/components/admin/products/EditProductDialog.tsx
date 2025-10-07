
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, X } from "lucide-react";
import { Product } from "@/types";

interface EditProductDialogProps {
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  categories: string[];
  onUpdateProduct: () => void;
}

export function EditProductDialog({ 
  editingProduct, 
  setEditingProduct, 
  categories, 
  onUpdateProduct 
}: EditProductDialogProps) {
  if (!editingProduct) return null;

  const generateCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 15).toUpperCase();
    setEditingProduct({...editingProduct, barcode: randomCode});
  };

  return (
    <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-xl font-semibold">Edit Product</DialogTitle>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            Save
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - General Information and Price */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">General Information</h3>
              
              <div>
                <Label htmlFor="edit-name" className="text-sm font-medium">Product Name</Label>
                <Input 
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
                <Textarea 
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Price and Quantity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Price and Quantity</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price" className="text-sm font-medium">Product Price</Label>
                  <Input 
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-discount-price" className="text-sm font-medium">Add Discount Price %</Label>
                  <Input 
                    id="edit-discount-price"
                    type="number"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, discountPrice: parseFloat(e.target.value)})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-stock" className="text-sm font-medium">Quantity in Stock</Label>
                  <Input 
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-low-stock" className="text-sm font-medium">Low Stock Alert</Label>
                  <Input 
                    id="edit-low-stock"
                    type="number"
                    value={editingProduct.lowStockAlert || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, lowStockAlert: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-sku" className="text-sm font-medium">SKU</Label>
                  <Input 
                    id="edit-sku"
                    value={editingProduct.barcode || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, barcode: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Barcode</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      placeholder="Type here"
                      value={editingProduct.barcode || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, barcode: e.target.value})}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={generateCode}
                      className="text-red-500 border-red-500 hover:bg-red-50 whitespace-nowrap"
                    >
                      Generate Code
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Image</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2 font-medium">Click to upload</p>
                <p className="text-sm text-gray-500">PNG or JPG (max. 5 MB)</p>
              </div>
            </div>
          </div>

          {/* Right Column - Category, Status, and Inventory Activity */}
          <div className="space-y-8">
            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Category</h3>
              
              <div>
                <Label htmlFor="edit-category" className="text-sm font-medium">Product Category</Label>
                <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status</h3>
              
              <div>
                <Label htmlFor="edit-status" className="text-sm font-medium">Product Status</Label>
                <Select value={editingProduct.status} onValueChange={(value) => setEditingProduct({...editingProduct, status: value as 'Active' | 'Inactive'})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Badge 
                    className={editingProduct.status === 'Active' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                      : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }
                  >
                    {editingProduct.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Inventory Activity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Inventory Activity</h3>
              
              <div>
                <Label className="text-sm font-medium">Period</Label>
                <Select defaultValue="all-time">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quantity Stocked</span>
                  <span className="font-semibold text-gray-900">{editingProduct.stock + 45}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quantity Sold</span>
                  <span className="font-semibold text-red-600">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quantity Remaining</span>
                  <span className="font-semibold text-orange-600">{editingProduct.stock}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-6 border-t mt-8">
          <Button variant="outline" onClick={() => setEditingProduct(null)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={onUpdateProduct} className="font-bold bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="mr-2 h-4 w-4" />
            Update Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
