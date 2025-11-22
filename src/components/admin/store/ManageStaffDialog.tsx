import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import {
  CreateUserRequest,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useSetUserStatusMutation,
  User,
} from "@/redux/services/user.services";
import { Store } from "@/redux/services/stores.services";

interface Staff {
  id: number;
  name: string;
  roleName: string;
  roleId: number;
  email: string;
  phone: string;
  status: "active" | "inactive";
  joinDate: string;
}

interface ManageStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId?: number;
  storeName?: string;
  stores: Store[];
}

export function ManageStaffDialog({
  open,
  onOpenChange,
  storeId,
  storeName,
  stores,
}: ManageStaffDialogProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const emptyForm: CreateUserRequest = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    roleId: null,
    role: "",
    storeId: storeId ?? null,
    username: "",
    joinedDate: "",
  };

  const [formData, setFormData] = useState<CreateUserRequest>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data: userData } = useGetUsersQuery({ page: 1, itemsPerPage: 1000 });
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [setUserStatus] = useSetUserStatusMutation();

  const filteredUsers = useMemo(() => {
    if (!userData?.users) return [];
    return userData.users.filter((u: User) => u.storeId === storeId);
  }, [userData, storeId]);

  console.log("Filtered Users:", filteredUsers);
  useEffect(() => {
    const mapped: Staff[] = filteredUsers.map((user) => ({
      id: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      roleName: user.roleName ?? "Employee",
      roleId: user.roleId ?? null,
      email: user.email ?? "",
      phone: user.phoneNumber ?? "",
      status: user.isActive ? "active" : "inactive",
      joinDate: user.joinedDate
        ? user.joinedDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
    }));
    setStaff(mapped);
  }, [filteredUsers]);

  const roles = [
    { id: 0, name: "Super Admin" },
    { id: 1, name: "Store Admin" },
    { id: 2, name: "Employee" },
    { id: 3, name: "Customer" },
  ];

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddDialog = () => {
    setEditId(null);
    setFormData({ ...emptyForm });
    setIsEditorOpen(true);
  };

  const openEditDialog = (member: Staff) => {
    setEditId(Number(member.id));

    const [first, ...rest] = member.name.split(" ");
    console.log("Editing member:", member);
    setFormData({
      email: member.email,
      password: "",
      firstName: first,
      lastName: rest.join(" "),
      phoneNumber: member.phone,
      roleId: member.roleId,
      role: member.roleName,
      storeId: storeId ?? null,
      username: member.email.split("@")[0],
      joinedDate: member.joinDate.split("T")[0],
    });

    setIsEditorOpen(true);
  };

  const handleRemoveStaff = (id: number) => {
    const user = staff.find((s) => s.id === id);
    if (!user) return;
    toast.success(`${user.name} removed`);
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleStatus = async (id: number) => {
    const member = staff.find((s) => s.id === id);
    if (!member) return;

    try {
      setLoading(true);
      await setUserStatus({
        userId: Number(id),
        isActive: member.status === "inactive",
      }).unwrap();
      setStaff((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: s.status === "active" ? "inactive" : "active" }
            : s
        )
      );
      toast.success(
        `${member.name} is now ${
          member.status === "active" ? "inactive" : "active"
        }`
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Store Manager":
        return "bg-purple-100 text-purple-800";
      case "Sales Associate":
        return "bg-blue-100 text-blue-800";
      case "Cashier":
        return "bg-green-100 text-green-800";
      case "Inventory Clerk":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      if (editId) {
        await updateUser({ id: editId, ...formData }).unwrap();
        toast.success("User updated");
      } else {
        await createUser(formData).unwrap();
        toast.success("User created");
      }
      setIsEditorOpen(false);
      setFormData({ ...emptyForm });
    } catch {
      toast.error("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Staff – {storeName || "Store"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search staff..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>

        <div className="space-y-3 mt-4">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>

                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Badge className={getRoleColor(member.roleName)}>
                        {member.roleName}
                      </Badge>
                      <Badge
                        variant={
                          member.status === "active" ? "default" : "secondary"
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>

                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {member.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {member.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(member.id)}
                  >
                    {member.status === "active" ? "Deactivate" : "Activate"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  </div>
              </CardContent>
            </Card>
          ))}

          {filteredStaff.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No staff found.
            </div>
          )}
        </div>

        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editId ? "Edit Staff" : "Add New Staff"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmitUser} className="space-y-4">
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>

              {!editId && (
                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, password: e.target.value }))
                    }
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, firstName: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Last Name *</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, lastName: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phoneNumber: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Store</Label>
                  <Select
                    value={formData.storeId?.toString() || ""}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, storeId: Number(v) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((s) => (
                        <SelectItem
                          key={s.storeId}
                          value={s.storeId.toString()}
                        >
                          {s.storeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Role</Label>
                  <Select
                    value={formData.roleId?.toString() || ""}
                    onValueChange={(v) => {
                      const role = roles.find((r) => r.id === Number(v));
                      if (role)
                        setFormData((p) => ({
                          ...p,
                          roleId: role.id,
                          role: role.name,
                        }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Joined Date</Label>
                <Input
                  type="date"
                  value={formData.joinedDate || ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, joinedDate: e.target.value }))
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : editId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
