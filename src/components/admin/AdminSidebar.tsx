import { Link } from "react-router-dom";
import { MonitorSmartphone } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { AdminSection } from "./sections";
import { useAuth } from "@/hooks/useAuth";
import { roleLabel } from "@/lib/roles";

interface AdminSidebarProps {
  sections: AdminSection[];
  activeId: string;
}

export function AdminSidebar({ sections, activeId }: AdminSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const { user, role, isStoreAdmin } = useAuth();
  const close = () => setOpenMobile(false);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/admin" onClick={close} className="flex items-center gap-3 px-2 py-2">
          <Logo />
          <div className="min-w-0">
            <p className="font-bold leading-tight">Vendli</p>
            <p className="truncate text-xs text-muted-foreground">{user?.storeName ?? "All stores"}</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((s) => (
                <SidebarMenuItem key={s.id}>
                  <SidebarMenuButton asChild isActive={s.id === activeId}>
                    <Link to={s.id === "dashboard" ? "/admin" : `/admin/${s.id}`} onClick={close}>
                      <s.icon className="h-4 w-4" />
                      <span>{s.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {isStoreAdmin && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/pos" onClick={close}>
                  <MonitorSmartphone className="h-4 w-4" />
                  <span>Open POS</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <div className="px-2 py-1 text-xs text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{roleLabel(role)}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
