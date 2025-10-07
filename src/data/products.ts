import { Product } from "@/types";

export const products: Product[] = [
  // Electronics
  {
    id: "1",
    name: "Samsung Galaxy S23",
    description: "Latest Samsung flagship smartphone with advanced camera features",
    price: 450000,
    imageUrl: "/placeholder.svg",
    barcode: "8901234567890",
    category: "Electronics",
    stock: 15,
    status: "Active",
    createdAt: "2023-06-15",
    lowStockAlert: 5
  },
  {
    id: "2",
    name: "Dell XPS 13 Laptop",
    description: "Powerful laptop with 11th Gen Intel processor",
    price: 750000,
    imageUrl: "/placeholder.svg",
    barcode: "5678901234567",
    category: "Electronics",
    stock: 8,
    status: "Active",
    createdAt: "2023-07-02"
  },
  {
    id: "3",
    name: "Sony WH-1000XM4 Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 180000,
    imageUrl: "/placeholder.svg",
    barcode: "4567890123456",
    category: "Electronics",
    stock: 12,
    status: "Active",
    createdAt: "2023-08-10",
    lowStockAlert: 8
  },

  // Footwear
  {
    id: "4",
    name: "Nike Air Max",
    description: "Comfortable running shoes with air cushioning",
    price: 65000,
    imageUrl: "/placeholder.svg",
    barcode: "6789012345678",
    category: "Footwear",
    stock: 23,
    status: "Active",
    createdAt: "2023-05-12",
    lowStockAlert: 10
  },

  // Clothing
  {
    id: "5",
    name: "Adidas Tracksuit",
    description: "Comfortable tracksuit for sports and casual wear",
    price: 35000,
    imageUrl: "/placeholder.svg",
    barcode: "3456789012345",
    category: "Clothing",
    stock: 30,
    status: "Active",
    createdAt: "2023-06-25",
    lowStockAlert: 15
  },

  // Audio (keeping existing inactive product)
  {
    id: "6",
    name: "Oraimo FreePods 4",
    description: "Wireless earbuds with active noise cancellation",
    price: 28000,
    imageUrl: "/placeholder.svg",
    barcode: "2345678901234",
    category: "Audio",
    stock: 25,
    status: "Inactive",
    createdAt: "2023-09-05",
    lowStockAlert: 10
  },

  // Restaurant - Raw Ingredients
  {
    id: "7",
    name: "Premium Beef (1kg)",
    description: "Fresh premium quality beef for grilling and cooking",
    price: 8500,
    imageUrl: "/placeholder.svg",
    barcode: "7890123456789",
    category: "Raw Ingredients",
    stock: 45,
    status: "Active",
    createdAt: "2024-01-15",
    lowStockAlert: 10
  },
  {
    id: "8",
    name: "Fresh Chicken Breast (1kg)",
    description: "Boneless chicken breast, locally sourced",
    price: 4200,
    imageUrl: "/placeholder.svg",
    barcode: "8901234567891",
    category: "Raw Ingredients",
    stock: 60,
    status: "Active",
    createdAt: "2024-01-15",
    lowStockAlert: 15
  },
  {
    id: "9",
    name: "Fresh Tomatoes (1kg)",
    description: "Fresh red tomatoes for salads and cooking",
    price: 800,
    imageUrl: "/placeholder.svg",
    barcode: "9012345678902",
    category: "Raw Ingredients",
    stock: 80,
    status: "Active",
    createdAt: "2024-01-16",
    lowStockAlert: 20
  },
  {
    id: "10",
    name: "Onions (1kg)",
    description: "Fresh yellow onions for cooking and garnishing",
    price: 600,
    imageUrl: "/placeholder.svg",
    barcode: "0123456789013",
    category: "Raw Ingredients",
    stock: 100,
    status: "Active",
    createdAt: "2024-01-16",
    lowStockAlert: 25
  },
  {
    id: "11",
    name: "Rice (5kg bag)",
    description: "Premium long grain rice, perfect for jollof and fried rice",
    price: 3500,
    imageUrl: "/placeholder.svg",
    barcode: "1234567890124",
    category: "Raw Ingredients",
    stock: 35,
    status: "Active",
    createdAt: "2024-01-17",
    lowStockAlert: 8
  },

  // Restaurant - Beverages
  {
    id: "12",
    name: "Coca Cola (330ml)",
    description: "Classic Coca Cola soft drink",
    price: 300,
    imageUrl: "/placeholder.svg",
    barcode: "2345678901235",
    category: "Beverages",
    stock: 120,
    status: "Active",
    createdAt: "2024-01-18",
    lowStockAlert: 30
  },
  {
    id: "13",
    name: "Fresh Orange Juice (1L)",
    description: "Freshly squeezed orange juice",
    price: 1200,
    imageUrl: "/placeholder.svg",
    barcode: "3456789012346",
    category: "Beverages",
    stock: 25,
    status: "Active",
    createdAt: "2024-01-18",
    lowStockAlert: 8
  },
  {
    id: "14",
    name: "Bottled Water (500ml)",
    description: "Pure drinking water",
    price: 150,
    imageUrl: "/placeholder.svg",
    barcode: "4567890123457",
    category: "Beverages",
    stock: 200,
    status: "Active",
    createdAt: "2024-01-19",
    lowStockAlert: 50
  },

  // Restaurant - Prepared Foods/Menu Items
  {
    id: "15",
    name: "Jollof Rice",
    description: "Traditional Nigerian jollof rice with vegetables",
    price: 2500,
    imageUrl: "/placeholder.svg",
    barcode: "5678901234568",
    category: "Menu Items",
    stock: 0, // Prepared fresh daily
    status: "Active",
    createdAt: "2024-01-20",
    lowStockAlert: 0
  },
  {
    id: "16",
    name: "Grilled Chicken",
    description: "Succulent grilled chicken with special seasoning",
    price: 3500,
    imageUrl: "/placeholder.svg",
    barcode: "6789012345679",
    category: "Menu Items",
    stock: 0, // Prepared fresh daily
    status: "Active",
    createdAt: "2024-01-20",
    lowStockAlert: 0
  },
  {
    id: "17",
    name: "Beef Suya",
    description: "Spicy grilled beef skewers with suya spice",
    price: 1800,
    imageUrl: "/placeholder.svg",
    barcode: "7890123456780",
    category: "Menu Items",
    stock: 0, // Prepared fresh daily
    status: "Active",
    createdAt: "2024-01-21",
    lowStockAlert: 0
  },

  // Restaurant - Spices & Seasonings
  {
    id: "18",
    name: "Curry Powder (200g)",
    description: "Aromatic curry powder for cooking",
    price: 850,
    imageUrl: "/placeholder.svg",
    barcode: "8901234567891",
    category: "Spices & Seasonings",
    stock: 25,
    status: "Active",
    createdAt: "2024-01-22",
    lowStockAlert: 5
  },
  {
    id: "19",
    name: "Suya Spice Mix (100g)",
    description: "Traditional Nigerian suya spice blend",
    price: 650,
    imageUrl: "/placeholder.svg",
    barcode: "9012345678902",
    category: "Spices & Seasonings",
    stock: 30,
    status: "Active",
    createdAt: "2024-01-22",
    lowStockAlert: 8
  },
  {
    id: "20",
    name: "Maggi Cubes (50 pieces)",
    description: "Chicken flavored seasoning cubes",
    price: 400,
    imageUrl: "/placeholder.svg",
    barcode: "0123456789013",
    category: "Spices & Seasonings",
    stock: 40,
    status: "Active",
    createdAt: "2024-01-23",
    lowStockAlert: 10
  },

  // Restaurant - Kitchen Supplies
  {
    id: "21",
    name: "Disposable Plates (Pack of 50)",
    description: "Eco-friendly disposable plates for takeaway",
    price: 1500,
    imageUrl: "/placeholder.svg",
    barcode: "1234567890124",
    category: "Kitchen Supplies",
    stock: 15,
    status: "Active",
    createdAt: "2024-01-24",
    lowStockAlert: 3
  },
  {
    id: "22",
    name: "Food Containers (Pack of 100)",
    description: "Microwaveable food containers with lids",
    price: 3200,
    imageUrl: "/placeholder.svg",
    barcode: "2345678901235",
    category: "Kitchen Supplies",
    stock: 8,
    status: "Active",
    createdAt: "2024-01-24",
    lowStockAlert: 2
  },
  {
    id: "23",
    name: "Aluminum Foil Roll",
    description: "Heavy duty aluminum foil for food wrapping",
    price: 1200,
    imageUrl: "/placeholder.svg",
    barcode: "3456789012346",
    category: "Kitchen Supplies",
    stock: 12,
    status: "Active",
    createdAt: "2024-01-25",
    lowStockAlert: 3
  }
];
