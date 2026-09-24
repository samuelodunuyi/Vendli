import { useState } from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

const PALETTE = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
];

const colorFor = (seed: string) => PALETTE[[...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % PALETTE.length];

/** Product photo with a tidy initials tile when there's no image or it fails to load. */
export function ProductImage({ src, name, className }: { src?: string | null; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className={cn("object-cover", className)} />;
  }
  return (
    <div className={cn("flex items-center justify-center font-semibold", colorFor(name), className)} aria-label={name}>
      {initials(name)}
    </div>
  );
}
