import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/common/UserMenu";
import { useAuth } from "@/hooks/useAuth";

export function Nav() {
  const { user } = useAuth();
  return (
    <nav className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Logo className="h-8 w-8" />
          Vendli
        </Link>
        {user ? <UserMenu /> : <Button asChild size="sm"><Link to="/auth">Sign in</Link></Button>}
      </div>
    </nav>
  );
}
