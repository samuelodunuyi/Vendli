import { Link } from "react-router-dom";
import { LayoutDashboard, LogOut, MonitorSmartphone, Receipt, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_ROLES, POS_ROLES, roleLabel } from "@/lib/roles";
import { fullName, initials } from "@/lib/format";

/** Account menu shared by the admin and POS headers. Links shown depend on role. */
export function UserMenu() {
  const { user, role, signOut } = useAuth();
  if (!user || role === null) return null;
  const name = fullName(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-1.5 sm:px-2" aria-label="Account menu">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials(name)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline">{user.firstName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {roleLabel(role)}
            {user.storeName && ` · ${user.storeName}`}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
        </DropdownMenuItem>
        {ADMIN_ROLES.includes(role) && (
          <DropdownMenuItem asChild>
            <Link to="/admin"><LayoutDashboard className="mr-2 h-4 w-4" /> Admin dashboard</Link>
          </DropdownMenuItem>
        )}
        {POS_ROLES.includes(role) && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/pos"><MonitorSmartphone className="mr-2 h-4 w-4" /> Point of sale</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/pos/orders"><Receipt className="mr-2 h-4 w-4" /> Store orders</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
