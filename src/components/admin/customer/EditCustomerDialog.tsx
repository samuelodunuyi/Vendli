
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  classification: string;
  industryClass?: string;
  companyName?: string;
  preferredStore: string;
  loyaltyTier: string;
  loyaltyPoints: number;
  totalSpent: number;
  lastTransaction: string;
  kycStatus: string;
  status: string;
}

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onCustomerUpdated: () => void;
}

export function EditCustomerDialog({ open, onOpenChange, customer, onCustomerUpdated }: EditCustomerDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    classification: "regular",
    industryClass: "",
    companyName: "",
    preferredStore: "",
    status: "active",
    notes: ""
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        classification: customer.classification,
        industryClass: customer.industryClass || "",
        companyName: customer.companyName || "",
        preferredStore: customer.preferredStore,
        status: customer.status,
        notes: ""
      });
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Updating customer:", customer?.id, formData);
    toast.success("Customer updated successfully!");
    onCustomerUpdated();
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer - {customer.firstName} {customer.lastName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Customer Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">₦{customer.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <Badge variant="outline">{customer.loyaltyTier}</Badge>
              <div className="text-sm text-gray-600 mt-1">{customer.loyaltyPoints} points</div>
            </div>
            <div className="text-center">
              <Badge variant={customer.kycStatus === 'verified' ? 'default' : 'secondary'}>
                {customer.kycStatus}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">KYC Status</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classification">Customer Classification</Label>
                <Select value={formData.classification} onValueChange={(value) => handleInputChange("classification", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredStore">Preferred Store</Label>
              <Select value={formData.preferredStore} onValueChange={(value) => handleInputChange("preferredStore", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Victoria Island Store">Victoria Island Store</SelectItem>
                  <SelectItem value="Ikeja Store">Ikeja Store</SelectItem>
                  <SelectItem value="Lekki Store">Lekki Store</SelectItem>
                  <SelectItem value="Ajah Store">Ajah Store</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.classification === "corporate" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industryClass">Industry Class</Label>
                  <Input
                    id="industryClass"
                    value={formData.industryClass}
                    onChange={(e) => handleInputChange("industryClass", e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about the customer"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Customer
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
