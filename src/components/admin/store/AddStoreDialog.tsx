import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import {
  Store,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { User } from "@/redux/services/user.services";
import { StoreCreateRequest } from "@/redux/services/stores.services";

interface AddStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStore: (formData: StoreCreateRequest) => void;
  isCreating: boolean;
  getUserData: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
  }[];
}

export function AddStoreDialog({
  open,
  onOpenChange,
  onAddStore,
  isCreating,
  getUserData,
}: AddStoreDialogProps) {
  const [formData, setFormData] = useState({
    storeName: "",
    storePhoneNumber: "",
    storeEmailAddress: "",
    storeAddress: "",
    storeType: "",
    storeAdmin: "",
    userId: null as number | null,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "userId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.storeName || !formData.storeAddress || !formData.userId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Set storeAdmin based on selected user
    const selectedUser = getUserData.find((u) => u.id === formData.userId);
    const payload: StoreCreateRequest = {
      ...formData,
      storeAdmin: selectedUser
        ? `${selectedUser.firstName} ${selectedUser.lastName}`
        : "",
    };

    onAddStore(payload);

    // Reset form
    setFormData({
      storeName: "",
      storePhoneNumber: "",
      storeEmailAddress: "",
      storeAddress: "",
      storeType: "",
      storeAdmin: "",
      userId: null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Add New Store
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={(e) =>
                  handleInputChange("storeAddress", e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Manager Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="manager">Store Manager *</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                id="manager"
                className="pl-10 w-full border rounded-md h-10 text-sm focus:outline-none"
                value={formData.userId ?? ""}
                onChange={(e) => handleInputChange("userId", e.target.value)}
                required
              >
                <option value="">Select a manager</option>
                {getUserData?.map((user: User) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone & Email */}
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
                  onChange={(e) =>
                    handleInputChange("storePhoneNumber", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange("storeEmailAddress", e.target.value)
                  }
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

            <Button
              type="submit"
              disabled={isCreating}
              className="font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isCreating ? "Adding..." : "Add Store"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
