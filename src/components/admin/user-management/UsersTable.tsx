import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, UserCheck, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pager } from "@/components/common/Pager";
import type { User } from "@/redux/services/user.services";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/roles";
import { formatDate, fullName, initials } from "@/lib/format";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

type Pending = { user: User; kind: "status" | "delete" } | null;

export function UsersTable({ users, loading, page, totalPages, totalItems, onPageChange, onEdit, onToggleStatus, onDelete }: UsersTableProps) {
  const { user: me, isSuperAdmin } = useAuth();
  const [pending, setPending] = useState<Pending>(null);

  // Mirrors the server rule: store admins only manage POS users in their store, nobody manages themselves.
  const canManage = (u: User) => u.id !== me?.id && (isSuperAdmin || u.roleId === UserRole.Employee);

  const actions = (u: User) =>
    canManage(u) ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Actions for ${fullName(u)}`}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(u)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPending({ user: u, kind: "status" })}>
            {u.isActive ? <><UserX className="mr-2 h-4 w-4" /> Disable</> : <><UserCheck className="mr-2 h-4 w-4" /> Activate</>}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setPending({ user: u, kind: "delete" })}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : null;

  const identity = (u: User) => (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="text-xs">{initials(fullName(u))}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">
          {fullName(u)} {u.id === me?.id && <span className="text-xs text-muted-foreground">(you)</span>}
        </p>
        <p className="truncate text-sm text-muted-foreground">{u.email}</p>
      </div>
    </div>
  );

  const status = (u: User) => <Badge variant={u.isActive ? "secondary" : "outline"}>{u.isActive ? "Active" : "Disabled"}</Badge>;

  return (
    <Card className="overflow-hidden">
      {loading ? (
        <div className="space-y-2 p-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
      ) : users.length === 0 ? (
        <p className="p-10 text-center text-muted-foreground">No users match your filters.</p>
      ) : (
        <>
          <ul className="divide-y md:hidden">
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-2 p-3">
                <div className="min-w-0 flex-1 space-y-1.5">
                  {identity(u)}
                  <div className="flex flex-wrap gap-1.5 pl-12">
                    <Badge variant="outline">{u.roleName}</Badge>
                    {u.storeName && <Badge variant="outline">{u.storeName}</Badge>}
                    {status(u)}
                  </div>
                </div>
                {actions(u)}
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className={u.isActive ? undefined : "opacity-60"}>
                    <TableCell>{identity(u)}</TableCell>
                    <TableCell><Badge variant="outline">{u.roleName}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{u.storeName ?? "All stores"}</TableCell>
                    <TableCell>{status(u)}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(u.joinedDate)}</TableCell>
                    <TableCell>{actions(u)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      <Pager page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={onPageChange} />

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        title={pending?.kind === "delete" ? "Delete user?" : pending?.user.isActive ? "Disable user?" : "Activate user?"}
        description={
          pending?.kind === "delete"
            ? `${pending.user.email} will be removed permanently.`
            : pending?.user.isActive
              ? "They will be signed out and won't be able to sign in until re-activated."
              : "They will be able to sign in again."
        }
        confirmLabel={pending?.kind === "delete" ? "Delete" : pending?.user.isActive ? "Disable" : "Activate"}
        destructive={pending?.kind === "delete" || pending?.user.isActive}
        onConfirm={() => {
          if (!pending) return;
          if (pending.kind === "delete") onDelete(pending.user);
          else onToggleStatus(pending.user);
        }}
      />
    </Card>
  );
}
