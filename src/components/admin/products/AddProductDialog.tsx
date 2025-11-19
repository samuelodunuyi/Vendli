import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import type { Category, Product } from "@/redux/services/products.services";

interface AddProductDialogProps {
  open: boolean;
  isCreating: boolean;
  onOpenChange: (open: boolean) => void;
  newProduct: Product;
  setNewProduct: (product: Product) => void;
  categories: Category[];
  onAddProduct: () => void;
  onCancel: () => void;
}

export function AddProductDialog({
  open,
  onOpenChange,
  newProduct,
  setNewProduct,
  categories,
  isCreating,
  onAddProduct,
  onCancel
}: AddProductDialogProps) {

  const generateCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setNewProduct({ ...newProduct, barcode: randomCode, sku: randomCode });
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

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">General Information</h3>

              <div>
                <Label>Product Name *</Label>
                <Input
                  placeholder="Type here"
                  value={newProduct.productName}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, productName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Type here"
                  rows={4}
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Price and Quantity</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Base Price *</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newProduct.basePrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <Label>Cost Price</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newProduct.costPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Stock Level</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={newProduct.minimumStockLevel}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        minimumStockLevel: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Stock Count</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={newProduct.basestock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        basestock: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* SKU + Barcode + UOM */}
              <div className="grid grid-cols-3 gap-4">

                {/* SKU */}
                <div>
                  <Label>SKU</Label>
                  <Input
                    placeholder="Enter SKU"
                    value={newProduct.sku}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sku: e.target.value })
                    }
                  />
                </div>

                {/* Barcode */}
                <div>
                  <Label>Barcode</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Generate or enter"
                      value={newProduct.barcode}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, barcode: e.target.value })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateCode}
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                {/* UOM */}
                <div>
                  <Label>Unit of Measurement (UoM)</Label>
                  <Select
                    value={newProduct.unitOfMeasure || ""}
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, unitOfMeasure: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="g">Gram (g)</SelectItem>
                      <SelectItem value="litre">Litre (L)</SelectItem>
                      <SelectItem value="ml">Millilitre (ml)</SelectItem>
                      <SelectItem value="pack">Pack</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                    </SelectContent>
                  </Select>
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

          {/* Right Column */}
          <div className="space-y-6">

            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Category</h3>
              <Label>Product Category *</Label>
              <Select
                value={String(newProduct.categoryId)}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, categoryId: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.categoryId} value={String(cat.categoryId)}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status</h3>
              <Label>Status</Label>
              <Select
                value={newProduct.isActive ? "Active" : "Inactive"}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, isActive: value === "Active" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Badge
                variant={newProduct.isActive ? "default" : "secondary"}
                className="mt-2"
              >
                {newProduct.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onAddProduct}
            disabled={isCreating}
            className="font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isCreating ? "Adding..." : "Add Product"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
