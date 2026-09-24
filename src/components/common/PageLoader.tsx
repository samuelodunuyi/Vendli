import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageLoader({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground", !className && "min-h-screen", className)}>
      <Loader2 className="h-7 w-7 animate-spin" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
