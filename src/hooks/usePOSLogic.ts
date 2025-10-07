
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { toast } from "@/components/ui/sonner";

interface DeliveryProvider {
  id: string;
  name: string;
  type: 'local' | 'international';
  enabled: boolean;
  baseRate: number;
}

interface DeliveryRate extends DeliveryProvider {
  estimatedCost: number;
  estimatedTime: string;
  score: number;
}

export function usePOSLogic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [selectedDeliveryProvider, setSelectedDeliveryProvider] = useState("");
  const [useSmartProviderSelection, setUseSmartProviderSelection] = useState(true);
  const [deliveryRates, setDeliveryRates] = useState<DeliveryRate[]>([]);
  
  const { addToCart, items, setDeliveryProvider } = useCart();

  // Mock delivery providers
  const deliveryProviders: DeliveryProvider[] = [
    { id: 'gig-logistics', name: 'GIG Logistics', type: 'local', enabled: true, baseRate: 1500 },
    { id: 'red-star', name: 'Red Star Express', type: 'local', enabled: true, baseRate: 2000 },
    { id: 'jumia-logistics', name: 'Jumia Logistics', type: 'local', enabled: true, baseRate: 1800 },
    { id: 'dhl', name: 'DHL Express', type: 'international', enabled: true, baseRate: 8500 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Back online - syncing data...");
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.warning("Working offline - data will sync when connection returns");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Simulate fetching delivery rates when cart changes
    if (items.length > 0) {
      const cartTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const cartWeight = items.reduce((sum, item) => sum + (item.quantity * 0.5), 0); // Assume 0.5kg per item
      
      const rates = deliveryProviders
        .filter(p => p.enabled)
        .map(provider => ({
          ...provider,
          estimatedCost: provider.baseRate + (cartWeight * 200),
          estimatedTime: provider.type === 'local' ? '1-3 days' : '5-7 days',
          score: calculateProviderScore(provider, cartTotal, cartWeight)
        }))
        .sort((a, b) => b.score - a.score);
      
      setDeliveryRates(rates);
      
      if (useSmartProviderSelection && rates.length > 0) {
        setSelectedDeliveryProvider(rates[0].id);
        // Update cart context with selected provider
        setDeliveryProvider(rates[0]);
      }
    } else {
      setDeliveryRates([]);
      setDeliveryProvider(null);
    }
  }, [items, useSmartProviderSelection, setDeliveryProvider]);

  useEffect(() => {
    const selectedProvider = deliveryRates.find(rate => rate.id === selectedDeliveryProvider);
    setDeliveryProvider(selectedProvider || null);
  }, [selectedDeliveryProvider, deliveryRates, setDeliveryProvider]);

  const calculateProviderScore = (provider: DeliveryProvider, cartTotal: number, cartWeight: number) => {
    const costWeight = 0.6; // 60% weight to cost
    const speedWeight = 0.4; // 40% weight to speed
    
    const normalizedCost = 1 - (provider.baseRate / 10000); // Normalize cost (lower is better)
    const normalizedSpeed = provider.type === 'local' ? 1 : 0.7; // Local is faster
    
    return (normalizedCost * costWeight) + (normalizedSpeed * speedWeight);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      handleBarcodeFound(barcodeInput.trim());
      setBarcodeInput("");
    }
  };

  const handleBarcodeFound = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product, 1);
      toast.success(`Added ${product.name} to cart`);
    } else {
      toast.error(`Product not found for barcode: ${barcode}`);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery);
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  return {
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
  };
}
