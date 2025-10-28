/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { useAssignStoreAdminMutation } from '@/redux/services/user.services';

export function RoleUpgradeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('store_manager');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const userRole = useAppSelector((state) => state.auth.user.role); 
  const [assignStoreAdmin] = useAssignStoreAdminMutation();

  // Only show to super admins
  if (userRole !== 1) return null; // assuming role 1 = super_admin

  const handleUpgradeRole = async () => {
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call RTK mutation
      await assignStoreAdmin({
        userEmail: email,
        storeId: role.includes('store_') ? 'storeId-placeholder' : '', // replace with real storeId
      }).unwrap();

      toast({
        title: 'Role updated successfully',
        description: `User ${email} has been assigned the ${role} role`,
      });

      setEmail('');
      setRole('store_manager');
      setIsOpen(false);
    } catch (error: any) {
      console.error('Role upgrade error:', error);
      toast({
        title: 'Error',
        description: error.data?.message || error.message || 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Upgrade User Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade User Role</DialogTitle>
          <DialogDescription>Assign admin or staff roles to existing users.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="user-email">User Email</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="user-role">New Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="store_sales_associate">Store Sales Associate</SelectItem>
                <SelectItem value="store_cashier">Store Cashier</SelectItem>
                <SelectItem value="store_inventory_clerk">Store Inventory Clerk</SelectItem>
                <SelectItem value="store_manager">Store Manager</SelectItem>
                <SelectItem value="sales_manager">Sales Manager</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUpgradeRole} disabled={isLoading} className="flex-1">
              {isLoading ? 'Updating...' : 'Update Role'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
