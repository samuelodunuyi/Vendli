
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UpdateUserRequest, User } from "@/redux/services/user.services";
import { Store } from "@/redux/services/stores.services";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  stores: Store[];
}

export function EditUserDialog({ isOpen, onOpenChange, user, stores }: EditUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    roleId: null,
    storeId: null,
    email: "",
    id: null,
    username: "",
    joinedDate: null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        roleId: user.roleId,
        email: user.email,
        id: user.id,
        username: user.username,
        storeId: user.storeId,
        joinedDate: user.joinedDate
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and role assignment.
          </DialogDescription>
        </DialogHeader>
<form onSubmit={handleSubmit} className="space-y-4">
  {/* Email */}
  <div>
    <Label htmlFor="email">Email *</Label>
    <Input
      id="email"
      type="email"
      value={formData.email}
      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
      required
    />
  </div>

  {/* First & Last Name */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="firstName">First Name</Label>
      <Input
        id="firstName"
        value={formData.firstName}
        onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
      />
    </div>
    <div>
      <Label htmlFor="lastName">Last Name</Label>
      <Input
        id="lastName"
        value={formData.lastName}
        onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
      />
    </div>
  </div>

  {/* Phone */}
  <div>
    <Label htmlFor="phoneNumber">Phone</Label>
    <Input
      id="phoneNumber"
      value={formData.phoneNumber}
      onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
    />
  </div>

  {/* Store & Role on same line */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="store">Store</Label>
      <Select
        value={formData?.storeId?.toString() || ""}
        onValueChange={value => setFormData(prev => ({ ...prev, storeId: Number(value) }))}
      >
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
    <div>
      <Label htmlFor="role">Role</Label>
      <Select
        value={formData?.roleId?.toString() || ""}
        onValueChange={value => setFormData(prev => ({ ...prev, roleId: Number(value) }))}
      >
        <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Super Admin</SelectItem>
          <SelectItem value="1">Store Admin</SelectItem>
          <SelectItem value="2">Employee</SelectItem>
          <SelectItem value="3">Customer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>

  {/* Joined Date */}
<div>
  <Label htmlFor="joinedDate">Joined Date</Label>
  <Input
    id="joinedDate"
    type="date"
    value={formData.joinedDate ? formData.joinedDate.split("T")[0] : ""}
    onChange={e => setFormData(prev => ({ ...prev, joinedDate: e.target.value }))}
  />
</div>

  {/* Action Buttons */}
  <div className="flex gap-2">
    <Button
      type="button"
      variant="outline"
      onClick={() => onOpenChange(false)}
      className="flex-1"
    >
      Cancel
    </Button>
    <Button
      type="submit"
      disabled={loading}
      className="flex-1"
    >
      {loading ? 'Updating...' : 'Update User'}
    </Button>
  </div>
</form>
      </DialogContent>
    </Dialog>
  );
}
