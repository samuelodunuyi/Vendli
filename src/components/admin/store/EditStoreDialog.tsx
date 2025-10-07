
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Store, MapPin, User, Phone, Mail, Calendar, ToggleLeft, ToggleRight } from "lucide-react";

interface EditStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId?: string;
}

export function EditStoreDialog({ open, onOpenChange, storeId }: EditStoreDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    manager: "",
    phone: "",
    email: "",
    openingDate: "",
    status: "active" as "active" | "inactive"
  });

  // Load store data when dialog opens
  useEffect(() => {
    if (open && storeId) {
      // Simulate loading store data
      setFormData({
        name: "Victoria Island Store",
        location: "1004 Victoria Island, Lagos",
        manager: "Adebayo Ogundimu",
        phone: "+234 901 234 5678",
        email: "vi.store@company.com",
        openingDate: "2020-01-15",
        status: "active"
      });
    }
  }, [open, storeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.location || !formData.manager) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate API call
    toast.success(`Store "${formData.name}" updated successfully!`);
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleStatus = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === "active" ? "inactive" : "active"
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Edit Store Information
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Store Status</p>
              <p className="text-sm text-gray-600">Toggle store operational status</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={formData.status === "active" ? "default" : "secondary"}>
                {formData.status}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleStatus}
                className="p-1"
              >
                {formData.status === "active" ? (
                  <ToggleRight className="h-6 w-6 text-green-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name *</Label>
            <Input
              id="storeName"
              placeholder="Enter store name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                placeholder="Enter store address"
                className="pl-10"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">Store Manager *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="manager"
                placeholder="Enter manager name"
                className="pl-10"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="+234 XXX XXX XXXX"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openingDate">Opening Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="openingDate"
                type="date"
                className="pl-10"
                value={formData.openingDate}
                onChange={(e) => handleInputChange("openingDate", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Store
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
