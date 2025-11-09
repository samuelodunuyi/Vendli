
import { Link } from "react-router-dom";
import { Home, Settings, ShoppingCart, Clock, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useAppSelector } from "@/redux/store";

interface POSHeaderProps {
  currentTime: string;
  isOffline: boolean;
}


export function POSHeader({ currentTime, isOffline }: POSHeaderProps) {
  const storeName = useAppSelector((state) => state.auth.user?.storeName);

  return (
    <header className="bg-white shadow-lg border-b-2 border-primary/10">
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Brand & Status */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CW Retail POS</h1>
                <p className="text-sm text-gray-500">{storeName}</p>
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>
              
              {isOffline && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <WifiOff className="h-3 w-3" />
                  Offline Mode
                </Badge>
              )}
            </div>
          </div>
          
          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            <ConnectionStatus />
            
            <Link to="/theme-settings">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Store Mode
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
