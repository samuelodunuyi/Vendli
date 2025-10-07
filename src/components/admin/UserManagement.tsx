
import { useState } from "react";
import { Shield, Users } from "lucide-react";
import { useUserManagement } from "./user-management/useUserManagement";
import { UserSummaryCards } from "./user-management/UserSummaryCards";
import { UserSearchBar } from "./user-management/UserSearchBar";
import { AddUserDialog } from "./user-management/AddUserDialog";
import { EditUserDialog } from "./user-management/EditUserDialog";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";
import { UsersTable } from "./user-management/UsersTable";
import { User } from "./user-management/types";

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { users, stores, loading, fetchUsers, hasRole } = useUserManagement();

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const filteredUsers = users.filter(user =>
    (user.first_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Only show this component to super admins
  if (!hasRole('super_admin')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">You need Super Admin privileges to access user management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
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
      <UserSummaryCards users={users} />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <UserSearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        
        <AddUserDialog 
          stores={stores} 
          onUserAdded={fetchUsers} 
        />
      </div>

      <UsersTable 
        users={filteredUsers}
        onEditUser={openEditDialog}
        onDeleteUser={openDeleteDialog}
      />

      <EditUserDialog
        isOpen={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        user={selectedUser}
        stores={stores}
        onUserUpdated={fetchUsers}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onUserDeleted={fetchUsers}
      />
    </div>
  );
}
