import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, MoreHorizontal, UserX, UserCheck } from "lucide-react";
import { User } from "@/redux/services/user.services";

interface UsersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDisableUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (n: number) => void;
  totalUsers?: number;
  isLoading?: boolean;
}

function nameToColorClass(name?: string) {
  if (!name) return "bg-gray-100 text-gray-700";
  const colors = [
    "bg-amber-100 text-amber-800",
    "bg-emerald-100 text-emerald-800",
    "bg-sky-100 text-sky-800",
    "bg-rose-100 text-rose-800",
    "bg-violet-100 text-violet-800",
    "bg-lime-100 text-lime-800",
    "bg-indigo-100 text-indigo-800",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  const idx = Math.abs(h) % colors.length;
  return colors[idx];
}

export function UsersTable({
  users,
  onEditUser,
  onDisableUser,
  onDeleteUser,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  totalUsers = 0,
  isLoading = false,
}: UsersTableProps) {
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const startIndex = totalUsers === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(totalUsers, currentPage * itemsPerPage);

  const rowsPerPageOptions = [10, 25, 50, 100];

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>
            Users{" "}
            <span className="text-sm font-normal text-muted-foreground">
              (showing {startIndex}-{endIndex} of {totalUsers})
            </span>
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground hidden sm:block">Rows per page:</div>
          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {rowsPerPageOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // skeleton rows
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell>
                    <div className="h-4 bg-gray-100 rounded w-40" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-100 rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-100 rounded w-12" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-100 rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-100 rounded w-10" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const displayName =
                  (user.firstName || user.lastName)
                    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                    : "No name set";

                const initials =
                  (user.firstName && user.lastName)
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : (user.username?.[0] ?? "U").toUpperCase();

                const avatarClass = nameToColorClass(displayName || user.username);

                return (
                  <TableRow
                    key={user.id}
                    className={!user.isActive ? "bg-gray-50/50 opacity-90" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full w-9 h-9 flex items-center justify-center ${avatarClass}`}>
                          <span className="font-semibold text-sm">{initials}</span>
                        </div>
                        <div>
                          <div className="font-medium">{displayName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phoneNumber && (
                            <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{user.roleName}</Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-gray-600">
                      {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "—"}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditUser(user)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>

                            {/* Toggle Active / Disable */}
                            <DropdownMenuItem
                              onClick={() =>
                                setUserToToggle(user)
                              }
                              className={!user.isActive ? "text-green-600" : "text-red-600"}
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" /> Disable
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" /> Activate
                                </>
                              )}
                            </DropdownMenuItem>

                            {/* Delete */}
                            <DropdownMenuItem
                              onClick={() => setUserToDelete(user)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination - right aligned */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 px-4 py-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => {
              const p = i + 1;
              // keep the UI compact if many pages: show first, last, current +/-1
              const shouldHide =
                totalPages > 7 && Math.abs(currentPage - p) > 2 && p !== 1 && p !== totalPages;
              return shouldHide ? (
                // show ellipsis only once where appropriate
                (p === currentPage - 3 || p === currentPage + 3) ? (
                  <div key={`dots-${p}`} className="px-2">…</div>
                ) : null
              ) : (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>

      {/* Confirm Toggle (Activate / Disable) */}
      <AlertDialog
        open={!!userToToggle}
        onOpenChange={() => setUserToToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToToggle?.isActive ? "Disable user?" : "Activate user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggle?.isActive
                ? "Disabling will prevent the user from logging in. You can restore access later."
                : "Activating will allow the user to log in again."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToToggle(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToToggle) onDisableUser(userToToggle);
                setUserToToggle(null);
              }}
              className={userToToggle?.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {userToToggle?.isActive ? "Disable" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Delete */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting is permanent. Are you sure you want to delete{" "}
              <strong>{userToDelete?.email}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToDelete) onDeleteUser(userToDelete);
                setUserToDelete(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
