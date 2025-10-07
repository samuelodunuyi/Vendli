
import { useState } from 'react';
import { Building2, Search, Bell, Settings, HelpCircle, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

interface ResponsiveHeaderProps {
  onSearchToggle: () => void;
  isSearchOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export function ResponsiveHeader({
  onSearchToggle,
  isSearchOpen,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}: ResponsiveHeaderProps) {
  const { user, profile } = useAuth();
  const unreadNotifications = 3;

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : user?.email || 'User';

  return (
    <>
      {/* Main Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 shadow-lg sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CW RETAIL</h1>
              <p className="text-sm text-gray-300 hidden sm:block">Admin Dashboard</p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={onSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products, orders, customers..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={onSearchToggle}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 text-white">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-gray-300">Online</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-gray-900 rounded-lg shadow-xl mx-4 w-full max-w-md animate-slide-up">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Search</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSearchToggle}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={onSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products, orders, customers..."
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
