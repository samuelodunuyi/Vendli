import { useState } from 'react';
import { Building2, Search, Bell, Settings, HelpCircle, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import { UserProfileDropdown } from '@/components/auth/UserProfileDropdown';
import { RoleUpgradeDialog } from '@/components/auth/RoleUpgradeDialog';
import { NotificationsPanel } from './NotificationsPanel';
import { SettingsPanel } from './SettingsPanel';
import { HelpPanel } from './HelpPanel';
import { UserProfilePanel } from './UserProfilePanel';
import { useLogoutMutation } from '@/redux/services/auth.services';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutRedux } from '@/redux/slices/authSlice';

export function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const [logout] = useLogoutMutation();
  const unreadNotifications = 3; // Replace with real data

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  // FIXED LOGOUT (no UI changes)
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      await logout({ refreshToken }).unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear Redux
    dispatch(logoutRedux());

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sessionId");

    // Navigate
    navigate("/auth/login");
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CW RETAIL</h1>
            <p className="text-sm text-gray-300">Admin Dashboard</p>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products, orders, customers..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Role Upgrade */}
          <div className="hidden lg:block">
            <RoleUpgradeDialog />
          </div>

          {/* Notifications */}
          <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-gray-300 hover:text-white hover:bg-gray-800">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <NotificationsPanel />
            </SheetContent>
          </Sheet>

          {/* Settings */}
          <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <SettingsPanel />
            </SheetContent>
          </Sheet>

          {/* Help */}
          <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Help & Support</SheetTitle>
              </SheetHeader>
              <HelpPanel />
            </SheetContent>
          </Sheet>

          {/* User Profile Dropdown */}
          <div className="hidden md:block">
            <UserProfileDropdown />
          </div>

          {/* Logout */}
          <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <LogOut className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to logout?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Mobile User Profile */}
          <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost"
                size="sm"
                className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>User Profile</SheetTitle>
              </SheetHeader>
              <UserProfilePanel />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-gray-900 rounded-lg shadow-xl mx-4 w-full max-w-md">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Search</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products, orders, customers..."
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
