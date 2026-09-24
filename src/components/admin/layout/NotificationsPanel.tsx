import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import type { Notification } from "@/hooks/useNotifications";

export function NotificationsPanel({ items, onNavigate }: { items: Notification[]; onNavigate: () => void }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-2 p-10 text-center text-muted-foreground">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        <p>You're all caught up.</p>
      </div>
    );
  }
  return (
    <ul className="divide-y">
      {items.map((n) => (
        <li key={n.id}>
          <Link to={n.href} onClick={onNavigate} className="flex gap-3 p-4 hover:bg-muted/50">
            <n.icon className={`mt-0.5 h-5 w-5 shrink-0 ${n.tone}`} />
            <div className="min-w-0">
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{n.message}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
