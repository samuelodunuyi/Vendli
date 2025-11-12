import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/redux/store";

export function Nav() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const storeName = useAppSelector((state) => state.auth.user?.storeName);

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left: Logo + Store */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            CW Retail POS
          </Link>
          {storeName && <span className="text-gray-600 font-medium">{storeName}</span>}
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/cart" className="relative">
            <Button variant="ghost">
              <ShoppingCart />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link to="/profile">
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

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-3">
          <Link to="/cart" className="relative">
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

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white w-full py-4 px-4 border-t border-gray-200">
          <div className="flex flex-col space-y-3">
            <Link to="/account" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-primary font-medium py-2">Account</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-orange-600 hover:text-orange-700 font-bold py-2">Admin Panel</Link>
            <Link to="/pos" onClick={() => setIsMenuOpen(false)} className="text-blue-600 hover:text-blue-700 font-bold py-2">POS Mode</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
