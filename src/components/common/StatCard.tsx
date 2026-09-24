import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TONES = {
  default: "text-foreground",
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-red-600",
  info: "text-blue-600",
  accent: "text-violet-600",
} as const;

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  tone?: keyof typeof TONES;
  /** Percentage change vs the previous period. */
  change?: number | null;
  loading?: boolean;
}

export function StatCard({ label, value, icon: Icon, hint, tone = "default", change, loading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
        </div>
        {loading ? (
          <Skeleton className="mt-2 h-7 w-24" />
        ) : (
          <p className={cn("mt-1 text-xl sm:text-2xl font-bold tabular-nums truncate", TONES[tone])}>{value}</p>
        )}
        {(hint || change != null) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {change != null && Number.isFinite(change) && (
              <span className={cn("inline-flex items-center font-medium", change >= 0 ? "text-emerald-600" : "text-red-600")}>
                {change >= 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                {Math.abs(change).toFixed(1)}%
              </span>
            )}
            {hint && <span className="truncate">{hint}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>{children}</div>;
}
