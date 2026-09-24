import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/common/FormField";
import { useCreateStoreMutation, useUpdateStoreMutation, type Store } from "@/redux/services/stores.services";
import { useGetUsersQuery } from "@/redux/services/user.services";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/roles";
import { apiErrorMessage } from "@/lib/errors";

const TYPES = ["Flagship", "Retail", "Mall", "Outlet"];
const EMPTY = { storeName: "", storeAddress: "", storePhoneNumber: "", storeEmailAddress: "", storeType: "Retail", userId: "", isActive: true };

interface StoreFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store?: Store | null;
}

export function StoreFormDialog({ open, onOpenChange, store }: StoreFormDialogProps) {
  const { isSuperAdmin } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const { data: admins } = useGetUsersQuery({ role: UserRole.StoreAdmin, itemsPerPage: 100 }, { skip: !open || !isSuperAdmin });
  const [create, createState] = useCreateStoreMutation();
  const [update, updateState] = useUpdateStoreMutation();
  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!open) return;
    setForm(
      store
        ? { storeName: store.storeName, storeAddress: store.storeAddress, storePhoneNumber: store.storePhoneNumber, storeEmailAddress: store.storeEmailAddress, storeType: store.storeType, userId: store.userId ? String(store.userId) : "", isActive: store.isActive }
        : EMPTY
    );
  }, [open, store]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const admin = admins?.users.find((u) => u.id === Number(form.userId));
    const body = {
      storeName: form.storeName.trim(),
      storeAddress: form.storeAddress.trim(),
      storePhoneNumber: form.storePhoneNumber.trim(),
      storeEmailAddress: form.storeEmailAddress.trim(),
      storeType: form.storeType,
      userId: Number(form.userId) || 0,
      storeAdmin: admin ? `${admin.firstName} ${admin.lastName}` : store?.storeAdmin ?? "",
    };
    try {
      if (store) await update({ storeId: store.storeId, ...body, isActive: form.isActive }).unwrap();
      else await create(body).unwrap();
      toast.success(store ? "Store updated" : "Store created");
      onOpenChange(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save store"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{store ? `Edit ${store.storeName}` : "Add store"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="name" label="Store name *" className="sm:col-span-2">
              <Input id="name" required value={form.storeName} onChange={(e) => set("storeName", e.target.value)} />
            </FormField>
            <FormField id="phone" label="Phone">
              <Input id="phone" type="tel" value={form.storePhoneNumber} onChange={(e) => set("storePhoneNumber", e.target.value)} />
            </FormField>
            <FormField id="email" label="Email">
              <Input id="email" type="email" value={form.storeEmailAddress} onChange={(e) => set("storeEmailAddress", e.target.value)} />
            </FormField>
            <FormField id="type" label="Type">
              <Select value={form.storeType} onValueChange={(v) => set("storeType", v)}>
                <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            {isSuperAdmin && (
              <FormField id="admin" label="Store admin" hint="Promote a user to Store Admin in Staff & Users first.">
                <Select value={form.userId} onValueChange={(v) => set("userId", v)}>
                  <SelectTrigger id="admin"><SelectValue placeholder="Not assigned" /></SelectTrigger>
                  <SelectContent>
                    {admins?.users.map((u) => <SelectItem key={u.id} value={String(u.id)}>{u.firstName} {u.lastName}{u.storeName ? ` · ${u.storeName}` : ""}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </div>
          <FormField id="address" label="Address">
            <Textarea id="address" rows={2} value={form.storeAddress} onChange={(e) => set("storeAddress", e.target.value)} />
          </FormField>
          {store && isSuperAdmin && (
            <div className="flex items-center gap-2">
              <Switch id="active" checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
              <Label htmlFor="active">Store is open for trading</Label>
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createState.isLoading || updateState.isLoading}>{store ? "Save changes" : "Create store"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
