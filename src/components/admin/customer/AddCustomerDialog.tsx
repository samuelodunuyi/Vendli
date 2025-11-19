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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { useCreateCustomerMutation } from "@/redux/services/customer.services";
import { Store } from "@/redux/services/stores.services";

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerAdded: () => void;
  storeData: Store[];
}

export function AddCustomerDialog({
  open,
  onOpenChange,
  onCustomerAdded,
  storeData,
}: AddCustomerDialogProps) {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    classification: "regular",
    industryClass: "",
    companyName: "",
    preferredStore: "",
    marketingConsent: false,
    notes: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const classificationMap: Record<string, number> = {
    corporate: 0,
    vip: 1,
    regular: 2,
    "walk-in": 3,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        username: formData.email.split("@")[0],
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
        loyaltyTier: 0,
        kycStatus: 0,
        loyaltyPoints: 0,
        lastTransactionDate: null,
        totalSpent: 0,
        customerClassification: classificationMap[formData.classification],
        companyName: formData.companyName || null,
        industryClass: formData.industryClass || null,
        notes: formData.notes || "",
        customerStatus: 1,
      };

      await createCustomer(payload).unwrap();

      toast.success("Customer added successfully!");
      onCustomerAdded();
      onOpenChange(false);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        classification: "regular",
        industryClass: "",
        companyName: "",
        preferredStore: "",
        marketingConsent: false,
        notes: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to add customer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+234 XXX XXX XXXX"
                required
              />
            </div>
          </div>

          {/* Classification & Store */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classification">Customer Classification</Label>
              <Select
                value={formData.classification}
                onValueChange={(value) =>
                  handleInputChange("classification", value)
                }
              >
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
  <Label htmlFor="preferredStore">Preferred Store</Label>
  <Select
    value={formData.preferredStore}
    onValueChange={(value) => handleInputChange("preferredStore", value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select store" />
    </SelectTrigger>
    <SelectContent>
      {storeData?.map((store) => (
        <SelectItem key={store.storeId} value={store.storeName}>
          {store.storeName}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

          </div>

          {/* Conditional Corporate Fields */}
          {formData.classification === "corporate" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industryClass">Industry Class</Label>
                <Input
                  id="industryClass"
                  value={formData.industryClass}
                  onChange={(e) =>
                    handleInputChange("industryClass", e.target.value)
                  }
                  placeholder="e.g., Banking & Finance"
                />
              </div>
            </div>
          )}

          {/* Notes */}
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

          {/* Marketing Consent */}
          <div className="flex items-center space-x-2">
            <Switch
              id="marketingConsent"
              checked={formData.marketingConsent}
              onCheckedChange={(checked) =>
                handleInputChange("marketingConsent", checked)
              }
            />
            <Label htmlFor="marketingConsent">
              Customer consents to marketing communications
            </Label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
