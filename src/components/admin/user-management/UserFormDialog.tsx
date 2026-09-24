import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/common/FormField";
import { StoreSelect } from "@/components/common/StoreSelect";
import { useCreateUserMutation, useUpdateUserMutation, type User } from "@/redux/services/user.services";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS, UserRole, assignableRoles } from "@/lib/roles";
import { apiErrorMessage } from "@/lib/errors";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing; absent when creating. */
  user?: User | null;
}

const blank = (role: UserRole, storeId: number | null) => ({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  roleId: role,
  storeId,
});

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const { user: me, role: myRole } = useAuth();
  const roles = assignableRoles(myRole ?? UserRole.Employee);
  const isEdit = Boolean(user);
  const isSelf = user?.id === me?.id;
  const [form, setForm] = useState(() => blank(UserRole.Employee, me?.storeId ?? null));
  const [createUser, createState] = useCreateUserMutation();
  const [updateUser, updateState] = useUpdateUserMutation();
  const saving = createState.isLoading || updateState.isLoading;

  useEffect(() => {
    if (!open) return;
    setForm(
      user
        ? { firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber ?? "", password: "", roleId: user.roleId, storeId: user.storeId ?? null }
        : blank(roles.includes(UserRole.Employee) ? UserRole.Employee : roles[0], me?.storeId ?? null)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const needsStore = form.roleId !== UserRole.SuperAdmin;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (needsStore && !form.storeId) return toast.error("Choose a store for this user");
    const common = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      username: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      roleId: form.roleId,
      storeId: needsStore ? form.storeId : null,
    };
    try {
      if (user) {
        await updateUser({ id: user.id, joinedDate: user.joinedDate, ...common, ...(form.password && { password: form.password }) }).unwrap();
        toast.success("User updated");
      } else {
        await createUser({ ...common, password: form.password, joinedDate: new Date().toISOString() }).unwrap();
        toast.success("User created");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save user"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Add user"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update details, role or store." : "Create a staff account and assign access."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="firstName" label="First name *">
              <Input id="firstName" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </FormField>
            <FormField id="lastName" label="Last name *">
              <Input id="lastName" required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </FormField>
            <FormField id="email" label="Email *">
              <Input id="email" type="email" required autoComplete="off" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </FormField>
            <FormField id="phone" label="Phone">
              <Input id="phone" type="tel" value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} />
            </FormField>
            <FormField id="role" label="Role">
              <Select value={String(form.roleId)} onValueChange={(v) => set("roleId", Number(v))} disabled={isSelf || roles.length < 2}>
                <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(roles.includes(form.roleId) ? roles : [form.roleId, ...roles]).map((r) => (
                    <SelectItem key={r} value={String(r)}>{ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            {needsStore && (
              <FormField id="store" label="Store *">
                <StoreSelect id="store" allowAll={false} className="sm:w-full" value={form.storeId} onChange={(id) => set("storeId", id ?? null)} />
              </FormField>
            )}
          </div>
          <FormField
            id="password"
            label={isEdit ? "New password" : "Temporary password *"}
            hint={isEdit ? "Leave blank to keep the current password." : "At least 8 characters. Ask them to change it after first sign-in."}
          >
            <Input id="password" type="password" autoComplete="new-password" minLength={8} required={!isEdit} value={form.password} onChange={(e) => set("password", e.target.value)} />
          </FormField>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Create user"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
