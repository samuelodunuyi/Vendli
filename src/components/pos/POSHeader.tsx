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
      <div className="max-w-full mx-auto px-3 sm:px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Section - Brand & Status */}
          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="leading-tight">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">CW Retail POS</h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">{storeName}</p>
              </div>
            </div>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{currentTime}</span>
              </div>

              {isOffline && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                >
                  <WifiOff className="h-3 w-3" />
                  <span className="hidden sm:inline">Offline Mode</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex">
              <ConnectionStatus />
            </div>

            <Link to="/theme-settings">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center text-xs sm:text-sm px-2 sm:px-3"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>

            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center text-xs sm:text-sm px-2 sm:px-3"
              >
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Store Mode</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
