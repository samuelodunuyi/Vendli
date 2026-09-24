import { useState } from "react";
import { Search, ShieldCheck, Store, UserCheck, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { StoreSelect } from "@/components/common/StoreSelect";
import { UsersTable } from "./user-management/UsersTable";
import { UserFormDialog } from "./user-management/UserFormDialog";
import { useDeleteUserMutation, useGetUsersQuery, useSetUserStatusMutation, type User } from "@/redux/services/user.services";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ROLE_LABELS, STAFF_ROLES } from "@/lib/roles";
import { apiErrorMessage } from "@/lib/errors";

const ALL = "all";

export function UserManagement() {
  const { isSuperAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(ALL);
  const [storeId, setStoreId] = useState<number>();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const debounced = useDebouncedValue(search);

  const { data, isFetching } = useGetUsersQuery({
    page,
    itemsPerPage: 15,
    search: debounced || undefined,
    role: role === ALL ? undefined : role,
    storeId,
  });
  const [setStatus] = useSetUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();
  const tiles = data?.tiles;

  const run = async (action: Promise<unknown>, success: string) => {
    try {
      await action;
      toast.success(success);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <StatGrid>
        <StatCard label="Active users" value={tiles?.activeUsers ?? "—"} icon={UserCheck} tone="success" loading={!tiles} />
        {isSuperAdmin && <StatCard label="Super admins" value={tiles?.superAdmins ?? "—"} icon={ShieldCheck} loading={!tiles} />}
        <StatCard label="Store admins" value={tiles?.storeAdmins ?? "—"} icon={Store} loading={!tiles} />
        <StatCard label="POS users" value={tiles?.employees ?? "—"} icon={Users} loading={!tiles} />
      </StatGrid>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, email or phone…" className="pl-9" value={search} onChange={(e) => resetPage(setSearch)(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Select value={role} onValueChange={resetPage(setRole)}>
            <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All roles</SelectItem>
              {STAFF_ROLES.filter((r) => isSuperAdmin || r !== 0).map((r) => (
                <SelectItem key={r} value={String(r)}>{ROLE_LABELS[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <StoreSelect value={storeId} onChange={resetPage(setStoreId)} />
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <UserPlus className="mr-2 h-4 w-4" /> Add user
        </Button>
      </div>

      <UsersTable
        users={data?.users ?? []}
        loading={isFetching && !data}
        page={page}
        totalPages={data?.pagination.totalPages ?? 1}
        totalItems={data?.pagination.totalItems}
        onPageChange={setPage}
        onEdit={(u) => { setEditing(u); setFormOpen(true); }}
        onToggleStatus={(u) => run(setStatus({ userId: u.id, isActive: !u.isActive }).unwrap(), `${u.firstName} ${u.isActive ? "disabled" : "re-activated"}`)}
        onDelete={(u) => run(deleteUser({ id: u.id }).unwrap(), `${u.firstName} ${u.lastName} deleted`)}
      />

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editing} />
    </div>
  );
}
