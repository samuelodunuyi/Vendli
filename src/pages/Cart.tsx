
import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { CartSummary } from "@/components/CartSummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Cart = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="pl-0 hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        <div className="max-w-3xl mx-auto">
          <CartSummary />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2025 EasyShop POS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
