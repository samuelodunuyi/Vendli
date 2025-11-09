
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Nav } from "@/components/Nav";
import { products } from "@/data/products";
import { ShoppingCart, Store, Monitor, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/products.services";

const Index = () => {
  const {data: products } = useGetProductsQuery({})
  const featuredProducts = products?.products?.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Nav />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            CW RETAIL
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete e-commerce and Point of Sale solution for modern retail businesses. 
            Manage your online store and in-person sales from one powerful platform.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link to="/cart">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shop Online
              </Button>
            </Link>
            
            <Link to="/pos">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold">
                <Monitor className="mr-2 h-5 w-5" />
                POS System
              </Button>
            </Link>
            
            <Link to="/admin">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold">
                <Store className="mr-2 h-5 w-5" />
                Admin Portal
              </Button>
            </Link>

            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold">
                <Settings className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Online Store</h3>
              <p className="text-gray-600">Full-featured e-commerce with cart, checkout, and order management</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Monitor className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">POS Terminal</h3>
              <p className="text-gray-600">Professional point-of-sale system for in-store transactions</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Store className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">Comprehensive management tools for inventory, sales, and analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
