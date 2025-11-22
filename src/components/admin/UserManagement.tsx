import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import {
  useGetUsersQuery,
  User,
  useCreateUserMutation,
  useUpdateUserMutation,
  CreateUserRequest,
  useSetUserStatusMutation, 
} from "@/redux/services/user.services";
import { useGetStoresQuery } from "@/redux/services/stores.services";
import { UserSummaryCards } from "./user-management/UserSummaryCards";
import { UserSearchBar } from "./user-management/UserSearchBar";
import { AddUserDialog } from "./user-management/AddUserDialog";
import { EditUserDialog } from "./user-management/EditUserDialog";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";
import { UsersTable } from "./user-management/UsersTable";
import { toast } from "sonner";

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [setUserStatus, { isLoading: isTogglingStatus }] = useSetUserStatusMutation();

  const { data: userListData, isLoading, refetch } = useGetUsersQuery({
    role: selectedRole,
    page: currentPage,
    itemsPerPage,
  });

  const totalUsers = userListData?.pagination?.totalItems ?? 0;
  const totalPages = userListData?.pagination?.totalPages ?? 1;
  const users = userListData?.users ?? [];
  const userSummary = userListData?.tiles;
  console.log("User data in UserManagement:", userSummary);
  const { data: storesList } = useGetStoresQuery();

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter((u) =>
      [u.username, u.email, u.firstName, u.lastName]
        .some((f) => !!f && f.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateUser = async (newUserData: CreateUserRequest) => {
    try {
      await createUser(newUserData).unwrap();
      toast.success("User created successfully!");
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await setUserStatus({ userId: user.id, isActive: !user.isActive }).unwrap();
      toast.success(`${user.isActive ? "Disabled" : "Activated"} ${user.email}`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      <UserSummaryCards users={userSummary} totalUsers={userListData?.pagination?.totalItems} />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <UserSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex items-center gap-2">
          <AddUserDialog
            stores={storesList?.stores || []}
            onUserAdded={handleCreateUser}
          />
        </div>
      </div>

      <UsersTable
        users={filteredUsers}
        onEditUser={openEditDialog}
        onDisableUser={handleToggleStatus}
        onDeleteUser={openDeleteDialog}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(n) => {
          setItemsPerPage(n);
          setCurrentPage(1);
        }}
        totalUsers={totalUsers}
        isLoading={isLoading}
      />

      <EditUserDialog
        isOpen={isEditUserOpen}
        stores={storesList?.stores || []}
        onOpenChange={setIsEditUserOpen}
        user={selectedUser}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
      />
    </div>
  );
}
