import { Lock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetStoresQuery } from "@/redux/services/stores.services";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const ALL = "all";

interface StoreSelectProps {
  value: number | null | undefined;
  onChange: (storeId: number | undefined) => void;
  /** Offer an "All stores" option (ignored for store-scoped users). */
  allowAll?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * Store picker used across the admin. Store admins and POS users are pinned to
 * their own store, so for them this renders as a read-only label.
 */
export function StoreSelect({ value, onChange, allowAll = true, placeholder = "Select store", className, id }: StoreSelectProps) {
  const { user, isStoreScoped } = useAuth();
  const { data, isLoading } = useGetStoresQuery(undefined, { skip: isStoreScoped });

  if (isStoreScoped) {
    return (
      <div id={id} className={cn("flex h-10 items-center gap-2 rounded-md border bg-muted/50 px-3 text-sm", className)}>
        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="truncate">{user?.storeName}</span>
      </div>
    );
  }

  return (
    <Select
      value={value ? String(value) : allowAll ? ALL : ""}
      onValueChange={(v) => onChange(v === ALL ? undefined : Number(v))}
      disabled={isLoading}
    >
      <SelectTrigger id={id} className={cn("w-full sm:w-52", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value={ALL}>All stores</SelectItem>}
        {data?.stores.map((s) => (
          <SelectItem key={s.storeId} value={String(s.storeId)}>
            {s.storeName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
