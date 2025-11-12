import { useState } from "react";
import { Shield, Users } from "lucide-react";
import {
  useGetUsersQuery,
  User,
  useCreateUserMutation,
  CreateUserRequest,
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
  const [selectedRole, setSelectedRole] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [createUser] = useCreateUserMutation();

const { data: userListData, isLoading } = useGetUsersQuery({
  role: selectedRole,
  page: currentPage,
  itemsPerPage: itemsPerPage,
});

  const users = userListData?.users ?? [];

  const {
    data: storesList,
    isLoading: loadingStores,
    refetch: refetchStores,
  } = useGetStoresQuery();
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    console.log(user)
    setIsEditUserOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const filteredUsers = users.filter((user) =>
    [user.username, user.email, user.firstName, user.lastName].some((f) =>
      f?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const handleCreateUser = async (newUserData: CreateUserRequest) => {
    try {
      await createUser(newUserData).unwrap();
      toast.success("User created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserSummaryCards users={filteredUsers} />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <UserSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <AddUserDialog
          stores={storesList?.stores || []}
          onUserAdded={handleCreateUser}
        />
      </div>

      <UsersTable
        users={filteredUsers}
        onEditUser={openEditDialog}
        onDisableUser={null}
        onDeleteUser={openDeleteDialog}
      />

      <EditUserDialog
        isOpen={isEditUserOpen}
        stores={[]}
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
