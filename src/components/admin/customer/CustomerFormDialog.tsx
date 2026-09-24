import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/common/FormField";
import { StoreSelect } from "@/components/common/StoreSelect";
import { useCreateCustomerMutation, useUpdateCustomerMutation, type Customer } from "@/redux/services/customer.services";
import { CUSTOMER_CLASSIFICATION, CUSTOMER_STATUS, KYC_STATUS } from "@/lib/enums";
import { apiErrorMessage } from "@/lib/errors";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present to edit an existing customer; absent to create one. */
  customer?: Customer | null;
  onCustomerAdded?: (customer: { id: number; userId: number }) => void;
}

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  customerClassification: 2,
  customerStatus: 1,
  kycStatus: 0,
  companyName: "",
  industryClass: "",
  preferredStoreId: undefined as number | undefined,
  notes: "",
};

function EnumSelect({ id, options, value, onChange }: { id: string; options: readonly string[]; value: number; onChange: (v: number) => void }) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger id={id}><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map((label, i) => <SelectItem key={label} value={String(i)}>{label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function CustomerFormDialog({ open, onOpenChange, customer, onCustomerAdded }: CustomerFormDialogProps) {
  const [createCustomer, createState] = useCreateCustomerMutation();
  const [updateCustomer, updateState] = useUpdateCustomerMutation();
  const [form, setForm] = useState(EMPTY);
  const isEdit = Boolean(customer);
  const saving = createState.isLoading || updateState.isLoading;
  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const isCorporate = form.customerClassification === 0;

  useEffect(() => {
    if (!open) return;
    setForm(
      customer
        ? {
            firstName: customer.userInfo.firstName,
            lastName: customer.userInfo.lastName,
            email: customer.userInfo.email,
            phoneNumber: customer.userInfo.phoneNumber ?? "",
            customerClassification: customer.customerClassification,
            customerStatus: customer.customerStatus,
            kycStatus: customer.kycStatus,
            companyName: customer.companyName ?? "",
            industryClass: customer.industryClass ?? "",
            preferredStoreId: undefined,
            notes: customer.notes ?? "",
          }
        : EMPTY
    );
  }, [open, customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const common = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      customerClassification: form.customerClassification,
      companyName: isCorporate ? form.companyName || null : null,
      industryClass: isCorporate ? form.industryClass || null : null,
      notes: form.notes,
    };
    try {
      if (customer) {
        await updateCustomer({ id: customer.id, ...common, customerStatus: form.customerStatus, kycStatus: form.kycStatus }).unwrap();
        toast.success("Customer updated");
      } else {
        const created = await createCustomer({
          ...common,
          username: form.email || `${form.firstName}.${form.lastName}`.toLowerCase(),
          email: form.email.trim(),
          preferredStoreId: form.preferredStoreId,
        }).unwrap();
        toast.success("Customer added");
        onCustomerAdded?.(created as unknown as { id: number; userId: number });
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save customer"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit customer" : "Add customer"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="firstName" label="First name *">
              <Input id="firstName" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </FormField>
            <FormField id="lastName" label="Last name *">
              <Input id="lastName" required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </FormField>
            <FormField id="phone" label="Phone *">
              <Input id="phone" type="tel" required placeholder="+234 800 000 0000" value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} />
            </FormField>
            <FormField id="email" label="Email">
              <Input id="email" type="email" disabled={isEdit} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </FormField>
            <FormField id="classification" label="Classification">
              <EnumSelect id="classification" options={CUSTOMER_CLASSIFICATION} value={form.customerClassification} onChange={(v) => set("customerClassification", v)} />
            </FormField>
            {isEdit ? (
              <>
                <FormField id="status" label="Status">
                  <EnumSelect id="status" options={CUSTOMER_STATUS} value={form.customerStatus} onChange={(v) => set("customerStatus", v)} />
                </FormField>
                <FormField id="kyc" label="KYC">
                  <EnumSelect id="kyc" options={KYC_STATUS} value={form.kycStatus} onChange={(v) => set("kycStatus", v)} />
                </FormField>
              </>
            ) : (
              <FormField id="preferredStore" label="Preferred store">
                <StoreSelect id="preferredStore" allowAll={false} className="sm:w-full" value={form.preferredStoreId} onChange={(id) => set("preferredStoreId", id)} />
              </FormField>
            )}
            {isCorporate && (
              <>
                <FormField id="companyName" label="Company name">
                  <Input id="companyName" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
                </FormField>
                <FormField id="industryClass" label="Industry">
                  <Input id="industryClass" placeholder="e.g. Banking & Finance" value={form.industryClass} onChange={(e) => set("industryClass", e.target.value)} />
                </FormField>
              </>
            )}
          </div>
          <FormField id="notes" label="Notes">
            <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </FormField>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Add customer"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
