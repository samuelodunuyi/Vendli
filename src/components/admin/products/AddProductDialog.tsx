
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newProduct: {
    name: string;
    description: string;
    price: string;
    category: string;
    barcode: string;
    discountPrice: string;
    lowStockAlert: string;
    status: string;
  };
  setNewProduct: (product: any) => void;
  categories: string[];
  onAddProduct: () => void;
  onCancel: () => void;
}

export function AddProductDialog({ 
  open,
  onOpenChange,
  newProduct, 
  setNewProduct, 
  categories, 
  onAddProduct, 
  onCancel 
}: AddProductDialogProps) {
  const generateCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 15).toUpperCase();
    setNewProduct({...newProduct, barcode: randomCode});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add Product</DialogTitle>
          <Button variant="outline" size="sm" className="bg-red-500 hover:bg-red-600 text-white">
            Publish
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - General Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">General Information</h3>
              
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input 
                  id="name" 
                  placeholder="Type here"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Type here"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={4}
                />
              </div>
            </div>

            {/* Price and Quantity */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Price and Quantity</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Product Price *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="Type here"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="discount-price">Add Discount Price %</Label>
                  <Input 
                    id="discount-price" 
                    type="number" 
                    placeholder="Type here"
                    value={newProduct.discountPrice}
                    onChange={(e) => setNewProduct({...newProduct, discountPrice: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="low-stock">Low Stock Alert</Label>
                <Input 
                  id="low-stock" 
                  type="number" 
                  placeholder="Type here"
                  value={newProduct.lowStockAlert}
                  onChange={(e) => setNewProduct({...newProduct, lowStockAlert: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="barcode">SKU</Label>
                  <Input 
                    id="barcode" 
                    placeholder="Type here"
                    value={newProduct.barcode}
                    onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Barcode</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type here"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={generateCode}
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      Generate Code
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Image</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Click to upload</p>
                <p className="text-sm text-gray-500">PNG or JPG (max. 5 MB)</p>
              </div>
            </div>
          </div>

          {/* Right Column - Category and Status */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Category</h3>
              
              <div>
                <Label htmlFor="category">Product Category *</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger>
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

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status</h3>
              
              <div>
                <Label htmlFor="status">Product Status</Label>
                <Select value={newProduct.status} onValueChange={(value) => setNewProduct({...newProduct, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {newProduct.status && (
                  <Badge variant={newProduct.status === 'Active' ? 'default' : 'secondary'} className="mt-2">
                    {newProduct.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onAddProduct} className="font-bold bg-blue-600 hover:bg-blue-700 text-white">
            Add Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
