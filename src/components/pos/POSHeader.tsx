import { Link } from "react-router-dom";
import { Clock, Receipt } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/common/UserMenu";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useAuth } from "@/hooks/useAuth";
import { useNow } from "@/hooks/useNow";

export function POSHeader({ active }: { active: "sale" | "orders" }) {
  const { user } = useAuth();
  const now = useNow();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
        <Link to="/pos" className="flex min-w-0 items-center gap-2">
          <Logo />
          <div className="min-w-0 leading-tight">
            <p className="font-bold">Vendli POS</p>
            <p className="truncate text-xs text-muted-foreground">{user?.storeName}</p>
          </div>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 sm:flex">
          <Button asChild size="sm" variant={active === "sale" ? "secondary" : "ghost"}>
            <Link to="/pos">New sale</Link>
          </Button>
          <Button asChild size="sm" variant={active === "orders" ? "secondary" : "ghost"}>
            <Link to="/pos/orders"><Receipt className="mr-1.5 h-4 w-4" />Orders</Link>
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-1 text-sm tabular-nums text-muted-foreground md:flex">
            <Clock className="h-4 w-4" />
            {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <div className="hidden lg:block">
            <ConnectionStatus />
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
