import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  StoreIcon,
  MapPin,
  User,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Store } from "@/redux/services/stores.services";

interface EditStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditStore: (updatedData: any) => void;
  getUserData: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }[];
}

export function EditStoreDialog({
  open,
  onOpenChange,
  store,
  onEditStore,
  getUserData,
}: EditStoreDialogProps) {
  const [formData, setFormData] = useState({
    storeId: null,
    storeName: "",
    storePhoneNumber: "",
    storeEmailAddress: "",
    storeAddress: "",
    storeType: "",
    storeAdmin: "",
    userId: null,
    isActive: null,
  });

  useEffect(() => {
    if (open && store) {
      const selectedUser = getUserData?.find(
        (u) => `${u.firstName} ${u.lastName}` === store.storeAdmin
      );

      setFormData({
        storeId: store.storeId,
        storeName: store.storeName || "",
        storePhoneNumber: store.storePhoneNumber || "",
        storeEmailAddress: store.storeEmailAddress || "",
        storeAddress: store.storeAddress || "",
        storeType: store.storeType || "",
        storeAdmin: store.storeAdmin || "",
        userId: selectedUser ? selectedUser.id.toString() : "",
        isActive: store.isActive || null,
      });
    }
  }, [open, store, getUserData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: prev.isActive === "active" ? "inactive" : "active",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.storeName || !formData.storeAddress || !formData.storeAdmin) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedUser = getUserData.find(
      (u) => u.id === Number(formData.userId)
    );

    const updatedStore = {
      storeId: formData.storeId,
      storeName: formData.storeName,
      storeAddress: formData.storeAddress,
      storeAdmin: selectedUser
        ? `${selectedUser.firstName} ${selectedUser.lastName}`
        : "",
      userId: selectedUser ? selectedUser.id : 0,
      storePhoneNumber: formData.storePhoneNumber,
      storeEmailAddress: formData.storeEmailAddress,
      isActive: formData.isActive,
    };

    onEditStore(updatedStore);
    toast.success(`Store "${formData.storeName}" updated successfully!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StoreIcon className="h-5 w-5" />
            Edit Store Information
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Store Status</p>
              <p className="text-sm text-gray-600">
                Toggle store operational status
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={formData.isActive === "active" ? "default" : "secondary"}
              >
                {formData.isActive}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleStatus}
                className="p-1"
              >
                {formData.isActive === "active" ? (
                  <ToggleRight className="h-6 w-6 text-green-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name *</Label>
            <Input
              id="storeName"
              placeholder="Enter store name"
              value={formData.storeName}
              onChange={(e) => handleInputChange("storeName", e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                placeholder="Enter store address"
                className="pl-10"
                value={formData.storeAddress}
                onChange={(e) => handleInputChange("storeAddress", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Manager Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="manager">Store Manager *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                id="manager"
                className="pl-10 w-full border rounded-md h-10 text-sm focus:outline-none"
                value={formData.userId}
                onChange={(e) => handleInputChange("userId", e.target.value)}
                required
              >
                <option value="">Select a manager</option>
                {getUserData?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="+234 XXX XXX XXXX"
                  className="pl-10"
                  value={formData.storePhoneNumber}
                  onChange={(e) => handleInputChange("storePhoneNumber", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="store@company.com"
                  className="pl-10"
                  value={formData.storeEmailAddress}
                  onChange={(e) => handleInputChange("storeEmailAddress", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Store</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
