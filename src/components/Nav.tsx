
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

export function Nav() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            EasyShop POS
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-primary">
            Store
          </Link>
          <Link to="/categories" className="text-gray-600 hover:text-primary">
            Categories
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-primary">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-primary">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart">
            <Button variant="ghost" className="relative">
              <ShoppingCart />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Link to="/account">
            <Button variant="ghost">
              <User />
            </Button>
          </Link>
          
          <Link to="/admin">
            <Button variant="outline" className="font-bold border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </Button>
          </Link>
          
          <Link to="/pos">
            <Button className="font-bold bg-blue-600 hover:bg-blue-700 text-white">POS Mode</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Link to="/cart" className="mr-4 relative">
            <ShoppingCart />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0">
                {itemCount}
              </Badge>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white w-full py-4 px-6 border-t border-gray-200">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-primary py-2"
            >
              Store
            </Link>
            <Link 
              to="/categories"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-primary py-2"
            >
              Categories
            </Link>
            <Link 
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-primary py-2"
            >
              About
            </Link>
            <Link 
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-primary py-2"
            >
              Contact
            </Link>
            <Link 
              to="/account"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-primary py-2"
            >
              Account
            </Link>
            <Link 
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="text-orange-600 hover:text-orange-700 py-2 font-bold"
            >
              Admin Panel
            </Link>
            <Link 
              to="/pos"
              onClick={() => setIsMenuOpen(false)}
              className="text-blue-600 hover:text-blue-700 py-2 font-bold"
            >
              POS Mode
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
