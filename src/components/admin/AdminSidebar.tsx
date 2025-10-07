
import { Home, LayoutDashboard, Users, Settings, ShoppingBag, Package, Truck, Store, UserPlus, Brain } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { AdminSection } from "@/pages/Admin";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    section: "dashboard" as AdminSection,
  },
  {
    title: "Sales Analytics",
    icon: ShoppingBag,
    section: "sales" as AdminSection,
  },
  {
    title: "User Management",
    icon: Users,
    section: "users" as AdminSection,
  },
  {
    title: "Products",
    icon: ShoppingBag,
    section: "products" as AdminSection,
  },
  {
    title: "Orders",
    icon: Truck,
    section: "orders" as AdminSection,
  },
  {
    title: "Inventory",
    icon: Package,
    section: "tracking" as AdminSection,
  },
  {
    title: "Stores",
    icon: Store,
    section: "stores" as AdminSection,
  },
  {
    title: "Customers",
    icon: UserPlus,
    section: "customers" as AdminSection,
  },
  {
    title: "AI Analytics",
    icon: Brain,
    section: "ai-analytics" as AdminSection,
  },
  {
    title: "Settings",
    icon: Settings,
    section: "settings" as AdminSection,
  },
];

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Admin Dashboard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.section}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.section)}
                    isActive={activeSection === item.section}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
