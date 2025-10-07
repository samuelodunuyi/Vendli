
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button>
              <Home className="mr-2 h-4 w-4" /> Go Home
            </Button>
          </Link>
          <Link to="/pos">
            <Button variant="outline">
              <ShoppingBag className="mr-2 h-4 w-4" /> Open POS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
