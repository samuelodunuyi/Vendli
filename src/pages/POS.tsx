
import { POSHeader } from "@/components/pos/POSHeader";
import { ProductSearchBar } from "@/components/pos/ProductSearchBar";
import { CategorySelector } from "@/components/pos/CategorySelector";
import { SmartDeliverySelector } from "@/components/pos/SmartDeliverySelector";
import { ProductsGrid } from "@/components/pos/ProductsGrid";
import { POSCartPanel } from "@/components/pos/POSCartPanel";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { usePOSLogic } from "@/hooks/usePOSLogic";
import { useCart } from "@/context/CartContext";

const POS = () => {
  const { itemCount } = useCart();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    barcodeInput,
    setBarcodeInput,
    showBarcodeScanner,
    setShowBarcodeScanner,
    isOffline,
    currentTime,
    selectedDeliveryProvider,
    setSelectedDeliveryProvider,
    useSmartProviderSelection,
    setUseSmartProviderSelection,
    deliveryRates,
    filteredProducts,
    categories,
    handleBarcodeSubmit,
    handleBarcodeFound
  } = usePOSLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <POSHeader currentTime={currentTime} isOffline={isOffline} />
      
      <main className="max-w-full mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Left Side - Product Search & List (3 columns) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            {/* Search Bar */}
            <ProductSearchBar
              searchQuery={searchQuery}
              barcodeInput={barcodeInput}
              onSearchChange={setSearchQuery}
              onBarcodeInputChange={setBarcodeInput}
              onBarcodeSubmit={handleBarcodeSubmit}
              onScannerOpen={() => setShowBarcodeScanner(true)}
            />

            {/* Category Selector */}
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              productCount={filteredProducts.length}
            />

            {/* Delivery Services */}
            <SmartDeliverySelector
              selectedProvider={selectedDeliveryProvider}
              useSmartSelection={useSmartProviderSelection}
              deliveryRates={deliveryRates}
              onProviderChange={setSelectedDeliveryProvider}
              onSmartSelectionToggle={setUseSmartProviderSelection}
            />
            
            {/* Products Grid */}
            <ProductsGrid products={filteredProducts} />
          </div>
          
          {/* Right Side - Cart (1 column) */}
          <div className="lg:col-span-1">
            <POSCartPanel totalItems={itemCount} />
          </div>
        </div>
      </main>

      {/* Barcode Scanner Dialog */}
      <BarcodeScanner
        open={showBarcodeScanner}
        onOpenChange={setShowBarcodeScanner}
        onScan={handleBarcodeFound}
      />
    </div>
  );
};

export default POS;
