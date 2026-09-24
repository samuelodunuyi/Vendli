import { cn } from "@/lib/utils";

/** Vendli mark. Same artwork as public/favicon.svg. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("h-9 w-9 shrink-0", className)}>
      <rect width="64" height="64" rx="14" className="fill-primary" />
      <path d="M17 18h8.6L32 38.4 38.4 18H47L36.2 47h-8.4z" fill="#fff" />
    </svg>
  );
}
