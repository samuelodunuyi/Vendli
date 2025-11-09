import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { Store } from "@/redux/services/stores.services";
import { CreateUserRequest } from "@/redux/services/user.services";

interface AddUserDialogProps {
  stores: Store[];
  onUserAdded: (newUserData: CreateUserRequest) => Promise<void>; 
}

export function AddUserDialog({ stores, onUserAdded }: AddUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
const roles = [
  { id: 0, name: "Super Admin" },
  { id: 1, name: "Store Admin" },
  { id: 2, name: "Employee" },
  { id: 3, name: "Customer" },
];
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    roleId: null,
    role: "",
    storeId: null,
    username: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      await onUserAdded({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        roleId: formData.roleId,
        role: formData.role,
        storeId: formData.storeId,
        username: formData.email
      });

      toast({ title: "Success", description: "User created successfully" });

      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        roleId: null,
        role: "",
        storeId: null,
        username: ""
      });

      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Create a new user account and assign roles.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} required />
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <Input id="password" type="password" value={formData.password} onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" value={formData.firstName} onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" value={formData.lastName} onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))} required />
            </div>
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone</Label>
            <Input id="phoneNumber" value={formData.phoneNumber} onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))} />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
<Select
  value={formData?.roleId?.toString() || ""}
  onValueChange={(value) => {
    const selectedRole = roles.find(r => r.id === Number(value));
    if (selectedRole) {
      setFormData(prev => ({
        ...prev,
        roleId: selectedRole.id,
        role: selectedRole.name,
      }));
    }
  }}
>
  <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
  <SelectContent>
    {roles.map((r) => (
      <SelectItem key={r.id} value={r.id.toString()}>
        {r.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          </div>

          <div>
            <Label htmlFor="store">Store</Label>
            <Select value={formData?.storeId?.toString() || ""} onValueChange={value => setFormData(prev => ({ ...prev, storeId: Number(value) }))}>
              <SelectTrigger><SelectValue placeholder="Select store" /></SelectTrigger>
              <SelectContent>
                {stores.map(store => (
                  <SelectItem key={store.storeId} value={store.storeId.toString()}>
                    {store.storeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1">{loading ? "Creating..." : "Create User"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
