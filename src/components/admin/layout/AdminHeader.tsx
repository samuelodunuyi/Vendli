import { useState } from "react";
import { Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/common/UserMenu";
import { NotificationsPanel } from "./NotificationsPanel";
import { useNotifications } from "@/hooks/useNotifications";
import { HelpPanel } from "./HelpPanel";
import { useAuth } from "@/hooks/useAuth";

export function AdminHeader({ title }: { title: string }) {
  const { user } = useAuth();
  const notifications = useNotifications();
  const [panel, setPanel] = useState<"notifications" | "help" | null>(null);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur sm:px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
      </div>
      {user?.storeName && (
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {user.storeName}
        </Badge>
      )}

      <Sheet open={panel === "notifications"} onOpenChange={(o) => setPanel(o ? "notifications" : null)}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {notifications.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full p-0 sm:max-w-md">
          <SheetHeader className="border-b p-4">
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <NotificationsPanel items={notifications} onNavigate={() => setPanel(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={panel === "help"} onOpenChange={(o) => setPanel(o ? "help" : null)}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Help">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader className="border-b pb-4">
            <SheetTitle>Help & support</SheetTitle>
          </SheetHeader>
          <HelpPanel />
        </SheetContent>
      </Sheet>

      <UserMenu />
    </header>
  );
}
