
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { SalesAnalytics } from "@/components/admin/SalesAnalytics";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { ProductsManagement } from "@/components/admin/ProductsManagement";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import { InventoryTracking } from "@/components/admin/InventoryTracking";
import { EnhancedStoreManagement } from "@/components/admin/EnhancedStoreManagement";
import { CustomerManagement } from "@/components/admin/CustomerManagement";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AIAnalyticsHub } from "@/components/admin/analytics/AIAnalyticsHub";

export type AdminSection = "dashboard" | "sales" | "users" | "settings" | "products" | "orders" | "tracking" | "stores" | "customers" | "ai-analytics";

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "sales":
        return <SalesAnalytics />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <SystemSettings />;
      case "products":
        return <ProductsManagement />;
      case "orders":
        return <OrdersManagement />;
      case "tracking":
        return <InventoryTracking />;
      case "stores":
        return <EnhancedStoreManagement />;
      case "customers":
        return <CustomerManagement />;
      case "ai-analytics":
        return <AIAnalyticsHub />;
      default:
        return <AdminDashboard />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard":
        return "Dashboard";
      case "sales":
        return "Sales Analytics";
      case "users":
        return "User Management";
      case "settings":
        return "System Settings";
      case "products":
        return "Products Management";
      case "orders":
        return "Orders Management";
      case "tracking":
        return "Inventory Tracking";
      case "stores":
        return "Multi-Store Management";
      case "customers":
        return "Customer Management";
      case "ai-analytics":
        return "AI Analytics Hub";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <AdminHeader />
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-1 w-full">
          <AdminSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex flex-1 items-center gap-2">
                <h1 className="text-xl font-semibold">
                  {getSectionTitle()}
                </h1>
              </div>
            </header>
            <main className="flex-1 p-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <div className="mb-4">
                  <p className="text-gray-600">
                    Manage your store operations and monitor performance
                  </p>
                </div>
                {renderActiveSection()}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;
