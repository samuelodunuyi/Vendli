import { POSHeader } from "@/components/pos/POSHeader";
import { ProductSearchBar } from "@/components/pos/ProductSearchBar";
import { CategorySelector } from "@/components/pos/CategorySelector";
import { SmartDeliverySelector } from "@/components/pos/SmartDeliverySelector";
import { ProductsGrid } from "@/components/pos/ProductsGrid";
import { POSCartPanel } from "@/components/pos/POSCartPanel";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { useCart } from "@/context/CartContext";
import { useState, useMemo } from "react";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/redux/services/products.services";
import { useAppSelector } from "@/redux/store";

const POS = () => {
  const { itemCount, addToCart } = useCart();
  const storeId = useAppSelector((state) => state.auth.user?.storeId);

  const { data: products, isLoading: productsLoading } = useGetProductsQuery(
    { storeId },
    { skip: !storeId }
  );

  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery(
    { storeId },
    { skip: !storeId }
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [selectedDeliveryProvider, setSelectedDeliveryProvider] = useState<string | null>(null);
  const [useSmartProviderSelection, setUseSmartProviderSelection] = useState(true);
  const currentTime = new Date().toLocaleTimeString();

  const filteredProducts = useMemo(() => {
    return products?.products?.filter((p) => {
      const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  
const handleBarcodeSubmit = (code: string) => {
  const product = products?.products?.find((p) => p.barcode === code);
  if (product) {
    addToCart(product, 1);
    console.log("Product added to cart via barcode:", product);
  } else {
    console.log("Barcode not found:", code);
  }
};

  const handleBarcodeFound = (code: string) => {
    handleBarcodeSubmit(code);
    setShowBarcodeScanner(false);
  };

  if (!storeId) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading store information...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <POSHeader currentTime={currentTime} isOffline={false} />

      <main className="max-w-full mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-140px)]">
          {/* Left Side */}
          <div className="lg:col-span-3 flex flex-col space-y-4 overflow-y-auto">
            <ProductSearchBar
              searchQuery={searchQuery}
              barcodeInput={barcodeInput}
              onSearchChange={setSearchQuery}
              onBarcodeInputChange={setBarcodeInput}
              onBarcodeSubmit={handleBarcodeSubmit}
              onScannerOpen={() => setShowBarcodeScanner(true)}
              loading={productsLoading}
            />

            <CategorySelector
              categories={categories?.categories || []}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              productCount={filteredProducts?.length}
              loading={categoriesLoading}
            />

            <SmartDeliverySelector
              selectedProvider={selectedDeliveryProvider}
              useSmartSelection={useSmartProviderSelection}
              deliveryRates={[]}  
              onProviderChange={setSelectedDeliveryProvider}
              onSmartSelectionToggle={setUseSmartProviderSelection}
            />

            <div className="flex-1 overflow-y-auto">
              <ProductsGrid products={filteredProducts} />
            </div>
          </div>

          {/* Right Side - Cart */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <POSCartPanel totalItems={itemCount} className="flex-1 overflow-y-auto" />
          </div>
        </div>
      </main>

      {/* Barcode Scanner */}
      <BarcodeScanner
        open={showBarcodeScanner}
        onOpenChange={setShowBarcodeScanner}
        onScan={handleBarcodeFound}
      />
    </div>
  );
};

export default POS;