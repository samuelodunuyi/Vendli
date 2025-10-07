
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Store, EditUserForm } from "./types";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  stores: Store[];
  onUserUpdated: () => void;
}

type ValidRole = "customer" | "store_sales_associate" | "store_cashier" | "store_inventory_clerk" | "store_manager" | "sales_manager" | "super_admin";

export function EditUserDialog({ isOpen, onOpenChange, user, stores, onUserUpdated }: EditUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<EditUserForm>({
    firstName: "",
    lastName: "",
    phone: "",
    role: "customer",
    storeId: ""
  });

  useEffect(() => {
    if (user) {
      const primaryRole = user.roles[0] || { role: 'customer', store_id: null };
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        phone: user.phone || "",
        role: primaryRole.role,
        storeId: primaryRole.store_id || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setLoading(true);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update user role - first delete existing roles, then add new one
      const { error: deleteRoleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      if (deleteRoleError) throw deleteRoleError;

      // Add the new role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: formData.role as ValidRole,
          store_id: formData.storeId || null
        });

      if (roleError) throw roleError;

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      onOpenChange(false);
      onUserUpdated();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value: ValidRole) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="store_sales_associate">Store Sales Associate</SelectItem>
                <SelectItem value="store_cashier">Store Cashier</SelectItem>
                <SelectItem value="store_inventory_clerk">Store Inventory Clerk</SelectItem>
                <SelectItem value="store_manager">Store Manager</SelectItem>
                <SelectItem value="sales_manager">Sales Manager</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.role.includes('store_') && (
            <div>
              <Label htmlFor="store">Store</Label>
              <Select value={formData.storeId} onValueChange={(value) => setFormData(prev => ({ ...prev, storeId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
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
