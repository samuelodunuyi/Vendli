
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Cloud, CloudOff, ShoppingCart } from 'lucide-react';
import { Link } from "react-router-dom";

export const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cloudConnected, setCloudConnected] = useState(true);
  const [onlineOrdersActive, setOnlineOrdersActive] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center space-x-1">
        {isOnline ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </Badge>

      <Badge variant={cloudConnected ? "default" : "destructive"} className="flex items-center space-x-1">
        {cloudConnected ? (
          <Cloud className="h-3 w-3" />
        ) : (
          <CloudOff className="h-3 w-3" />
        )}
        <span>{cloudConnected ? 'Cloud' : 'Disconnected'}</span>
      </Badge>

<Link to="/POSOrders" className="no-underline">
  <Badge
    variant={onlineOrdersActive ? "default" : "outline"}
    className="flex items-center space-x-1 cursor-pointer hover:bg-blue-50"
  >
    <ShoppingCart className="h-3 w-3" />
    <span>Orders</span>
  </Badge>
</Link>
    </div>
  );
};
