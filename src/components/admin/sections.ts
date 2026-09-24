import type { ComponentType, LazyExoticComponent } from "react";
import { lazyWithReload } from "@/lib/lazy";
import { Brain, LayoutDashboard, Package, Settings, ShoppingBag, Store, Tags, Truck, UserPlus, Users, type LucideIcon } from "lucide-react";
import { ADMIN_ROLES, UserRole } from "@/lib/roles";

export interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  roles: readonly UserRole[];
  component: LazyExoticComponent<ComponentType>;
}

const load = <K extends string>(factory: () => Promise<Record<K, ComponentType>>, name: K) =>
  lazyWithReload(() => factory().then((m) => ({ default: m[name] })));

export const ADMIN_SECTIONS: AdminSection[] = [
  { id: "dashboard", title: "Dashboard", description: "Performance at a glance", icon: LayoutDashboard, roles: ADMIN_ROLES, component: load(() => import("./AdminDashboard"), "AdminDashboard") },
  { id: "sales", title: "Sales Analytics", description: "Revenue, margins and inventory value", icon: ShoppingBag, roles: ADMIN_ROLES, component: load(() => import("./SalesAnalytics"), "SalesAnalytics") },
  { id: "orders", title: "Orders", description: "Track and update customer orders", icon: Truck, roles: ADMIN_ROLES, component: load(() => import("./OrdersManagement"), "OrdersManagement") },
  { id: "products", title: "Products", description: "Catalogue, pricing and stock levels", icon: Tags, roles: ADMIN_ROLES, component: load(() => import("./ProductsManagement"), "ProductsManagement") },
  { id: "inventory", title: "Inventory", description: "Stock movements and adjustments", icon: Package, roles: ADMIN_ROLES, component: load(() => import("./InventoryTracking"), "InventoryTracking") },
  { id: "customers", title: "Customers", description: "Profiles, loyalty and complaints", icon: UserPlus, roles: ADMIN_ROLES, component: load(() => import("./CustomerManagement"), "CustomerManagement") },
  { id: "users", title: "Staff & Users", description: "Accounts and access", icon: Users, roles: ADMIN_ROLES, component: load(() => import("./UserManagement"), "UserManagement") },
  { id: "stores", title: "Stores", description: "Store network and performance", icon: Store, roles: ADMIN_ROLES, component: load(() => import("./StoreManagement"), "StoreManagement") },
  { id: "ai-analytics", title: "AI Analytics", description: "Forecasts and insights", icon: Brain, roles: [UserRole.SuperAdmin], component: load(() => import("./analytics/AIAnalyticsHub"), "AIAnalyticsHub") },
  { id: "settings", title: "Settings", description: "Organisation-wide configuration", icon: Settings, roles: [UserRole.SuperAdmin], component: load(() => import("./SystemSettings"), "SystemSettings") },
];

export const sectionsFor = (role: UserRole | null) => ADMIN_SECTIONS.filter((s) => role !== null && s.roles.includes(role));
