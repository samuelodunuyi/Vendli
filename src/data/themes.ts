
export interface ThemeConfig {
  id: string;
  name: string;
  industry: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  features: {
    offline: boolean;
    cloud: boolean;
    onlineOrders: boolean;
  };
  customFields: string[];
  defaultCategories: string[];
  paymentMethods: string[];
  receiptTemplate: string;
}

export const themes: ThemeConfig[] = [
  {
    id: "cafe-restaurant",
    name: "Cafe & Restaurant",
    industry: "Food & Beverage",
    colors: {
      primary: "hsl(25, 95%, 53%)", // Warm orange
      secondary: "hsl(20, 25%, 15%)", // Dark brown
      accent: "hsl(45, 100%, 85%)", // Cream
      background: "hsl(35, 40%, 95%)", // Light cream
      surface: "hsl(0, 0%, 100%)", // White
    },
    features: {
      offline: true,
      cloud: true,
      onlineOrders: true,
    },
    customFields: ["Table Number", "Special Instructions", "Allergen Info"],
    defaultCategories: ["Hot Drinks", "Cold Drinks", "Main Courses", "Desserts", "Appetizers"],
    paymentMethods: ["Cash", "Card", "Mobile Payment", "Split Bill"],
    receiptTemplate: "restaurant"
  },
  {
    id: "fashion-clothing",
    name: "Fashion & Clothing",
    industry: "Fashion",
    colors: {
      primary: "hsl(320, 85%, 45%)", // Fashion pink
      secondary: "hsl(0, 0%, 10%)", // Black
      accent: "hsl(45, 100%, 95%)", // Light gold
      background: "hsl(340, 15%, 97%)", // Light pink
      surface: "hsl(0, 0%, 100%)", // White
    },
    features: {
      offline: true,
      cloud: true,
      onlineOrders: true,
    },
    customFields: ["Size", "Color", "Material", "Brand"],
    defaultCategories: ["Dresses", "Tops", "Bottoms", "Shoes", "Accessories"],
    paymentMethods: ["Cash", "Card", "Buy Now Pay Later", "Store Credit"],
    receiptTemplate: "fashion"
  },
  {
    id: "electronics",
    name: "Electrical & Electronics",
    industry: "Technology",
    colors: {
      primary: "hsl(210, 100%, 45%)", // Tech blue
      secondary: "hsl(215, 25%, 25%)", // Dark blue gray
      accent: "hsl(45, 100%, 50%)", // Electric yellow
      background: "hsl(220, 15%, 97%)", // Light blue gray
      surface: "hsl(0, 0%, 100%)", // White
    },
    features: {
      offline: true,
      cloud: true,
      onlineOrders: true,
    },
    customFields: ["Warranty Period", "Serial Number", "Model", "Specifications"],
    defaultCategories: ["Mobile Phones", "Laptops", "Accessories", "Audio", "Gaming"],
    paymentMethods: ["Cash", "Card", "Installments", "Corporate Account"],
    receiptTemplate: "electronics"
  },
  {
    id: "grocery-bakery",
    name: "Grocery & Bakery",
    industry: "Food & Grocery",
    colors: {
      primary: "hsl(120, 60%, 35%)", // Fresh green
      secondary: "hsl(35, 80%, 45%)", // Warm brown
      accent: "hsl(50, 100%, 85%)", // Light yellow
      background: "hsl(120, 20%, 97%)", // Very light green
      surface: "hsl(0, 0%, 100%)", // White
    },
    features: {
      offline: true,
      cloud: true,
      onlineOrders: true,
    },
    customFields: ["Expiry Date", "Weight", "Origin", "Organic"],
    defaultCategories: ["Fresh Produce", "Bakery", "Dairy", "Beverages", "Household"],
    paymentMethods: ["Cash", "Card", "Food Stamps", "Loyalty Points"],
    receiptTemplate: "grocery"
  },
  {
    id: "general-retail",
    name: "General Retail",
    industry: "Retail",
    colors: {
      primary: "hsl(220, 50%, 40%)", // Professional blue
      secondary: "hsl(0, 0%, 20%)", // Dark gray
      accent: "hsl(200, 100%, 85%)", // Light blue
      background: "hsl(0, 0%, 98%)", // Off white
      surface: "hsl(0, 0%, 100%)", // White
    },
    features: {
      offline: true,
      cloud: true,
      onlineOrders: true,
    },
    customFields: ["SKU", "Supplier", "Location", "Notes"],
    defaultCategories: ["Electronics", "Home & Garden", "Sports", "Books", "Toys"],
    paymentMethods: ["Cash", "Card", "Digital Wallet", "Gift Card"],
    receiptTemplate: "general"
  }
];
