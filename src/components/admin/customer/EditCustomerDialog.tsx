/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Customer, useUpdateCustomerMutation } from "@/redux/services/customer.services";
import { Store } from "@/redux/services/stores.services";

export enum KYCStatus {
  Unverified = 0,
  Pending = 1,
  Verified = 2,
}

export enum LoyaltyTier {
  Bronze = 0,
  Silver = 1,
  Gold = 2,
  Platinum = 3,
}

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  storeData: Store[];
  onCustomerUpdated: () => void;
}

export function EditCustomerDialog({ open, onOpenChange, customer, onCustomerUpdated, storeData }: EditCustomerDialogProps) {
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    classification: 2 as number | null,
    industryClass: "",
    companyName: "",
    preferredStore: "",
    status: 1 as number | null,
    notes: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.userInfo.firstName,
        lastName: customer.userInfo.lastName,
        email: customer.userInfo.email,
        phone: customer.userInfo.phoneNumber || "",
        classification: customer.customerClassification,
        industryClass: customer.industryClass || "",
        companyName: customer.companyName || "",
        preferredStore: customer.preferredStore || "",
        status: customer.customerStatus,
        notes: customer.notes || "",
      });
    }
  }, [customer]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    const payload: any = { id: customer.id };

    if (formData.firstName) payload.firstName = formData.firstName;
    if (formData.lastName) payload.lastName = formData.lastName;
    if (formData.email) payload.email = formData.email;
    if (formData.phone) payload.phoneNumber = formData.phone;
    if (formData.classification !== null) payload.customerClassification = formData.classification;
    if (formData.status !== null) payload.customerStatus = formData.status;
    if (formData.companyName) payload.companyName = formData.companyName;
    if (formData.industryClass) payload.industryClass = formData.industryClass;
    if (formData.preferredStore) payload.preferredStore = formData.preferredStore;
    if (formData.notes) payload.notes = formData.notes;

    try {
      await updateCustomer(payload).unwrap();
      toast.success("Customer updated successfully!");
      onCustomerUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update customer");
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer - {customer.userInfo.firstName} {customer.userInfo.lastName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">₦{customer.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <Badge variant="outline">{LoyaltyTier[customer.loyaltyTier]}</Badge>
              <div className="text-sm text-gray-600 mt-1">{customer.loyaltyPoints} points</div>
            </div>
            <div className="text-center">
              <Badge
                variant={
                  customer.kycStatus === KYCStatus.Verified ? "default" :
                  customer.kycStatus === KYCStatus.Pending ? "secondary" :
                  "destructive"
                }
              >
                {KYCStatus[customer.kycStatus]}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">KYC Status</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
              </div>
            </div>

            {/* Classification, Status, Store */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classification">Customer Classification</Label>
                <Select value={formData.classification?.toString()} onValueChange={(value) => handleInputChange("classification", Number(value))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Corporate</SelectItem>
                    <SelectItem value="1">VIP</SelectItem>
                    <SelectItem value="2">Regular</SelectItem>
                    <SelectItem value="3">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status?.toString()} onValueChange={(value) => handleInputChange("status", Number(value))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                    <SelectItem value="2">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredStore">Preferred Store</Label>
                <Select value={formData.preferredStore || ""} onValueChange={(value) => handleInputChange("preferredStore", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {storeData.map(store => (
                      <SelectItem key={store.storeId} value={store.storeName}>{store.storeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Corporate Fields */}
            {formData.classification === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industryClass">Industry Class</Label>
                  <Input id="industryClass" value={formData.industryClass} onChange={(e) => handleInputChange("industryClass", e.target.value)} />
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} rows={3} />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Updating..." : "Update Customer"}</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
