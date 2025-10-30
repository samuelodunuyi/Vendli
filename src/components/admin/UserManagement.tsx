import { useState } from "react";
import { Shield, Users } from "lucide-react";
import { useGetUsersQuery, User, useCreateEmployeeMutation, CreateUserRequest} from "@/redux/services/user.services";
import { useGetStoresQuery } from "@/redux/services/stores.services";
import { UserSummaryCards } from "./user-management/UserSummaryCards";
import { UserSearchBar } from "./user-management/UserSearchBar";
import { AddUserDialog } from "./user-management/AddUserDialog";
import { EditUserDialog } from "./user-management/EditUserDialog";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";
import { UsersTable } from "./user-management/UsersTable";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { user, hasRole } = useAuth(); 

  const { data: userList = [], isLoading, refetch } = useGetUsersQuery({}); 
  const { data: storesList = [], isLoading: loadingStores, refetch: refetchStores } = useGetStoresQuery(); 
  const [createUser] = useCreateEmployeeMutation()
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const filteredUsers = userList.filter(user =>
    (user.username?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.firstName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateUser = async (newUserData: CreateUserRequest) => {
  try {
    await createUser(newUserData).unwrap(); // call the RTK mutation
    toast.success("User created successfully!");
    refetch(); // refresh the user list
  } catch (err) {
    console.error(err);
    toast.error("Failed to create user");
  }
};

  // Only show this component to super admins
  // if (user?.role !=0) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-center">
  //         <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
  //         <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
  //         <p className="text-gray-500">You need Super Admin privileges to access user management.</p>
  //       </div>
  //     </div>
  //   );
  // }

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
      <UserSummaryCards users={userList} />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <UserSearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        
        <AddUserDialog
        stores={storesList || []}
        onUserAdded={handleCreateUser}
        />
      </div>

      <UsersTable 
        users={filteredUsers}
        onEditUser={openEditDialog}
        onDeleteUser={openDeleteDialog}
      />

      <EditUserDialog
        isOpen={isEditUserOpen}
        stores={[]}
        onOpenChange={setIsEditUserOpen}
        user={selectedUser}
        onUserUpdated={refetch} 
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onUserDeleted={refetch} 
      />
    </div>
  );
}
