import { useState } from "react";
import { Mail, Phone, Shield, Store } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Nav } from "@/components/Nav";
import { FormField } from "@/components/common/FormField";
import { useAuth } from "@/hooks/useAuth";
import { useChangePasswordMutation } from "@/redux/services/auth.services";
import { roleLabel } from "@/lib/roles";
import { fullName, initials } from "@/lib/format";
import { apiErrorMessage } from "@/lib/errors";

const EMPTY = { oldPassword: "", newPassword: "", confirm: "" };

const Profile = () => {
  const { user, role } = useAuth();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form, setForm] = useState(EMPTY);
  if (!user) return null;
  const name = fullName(user);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error("New passwords don't match");
    try {
      await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword }).unwrap();
      toast.success("Password updated");
      setForm(EMPTY);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not update password"));
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Nav />
      <main className="mx-auto grid max-w-4xl gap-6 p-4 sm:p-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">{initials(name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate">{name}</CardTitle>
              <CardDescription>{roleLabel(role)}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" />{user.email}</p>
            {user.phoneNumber && <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" />{user.phoneNumber}</p>}
            <p className="flex items-center gap-3"><Store className="h-4 w-4 text-muted-foreground" />{user.storeName ?? "All stores"}</p>
            <p className="flex items-center gap-3"><Shield className="h-4 w-4 text-muted-foreground" />{roleLabel(role)}</p>
            <p className="pt-2 text-xs text-muted-foreground">Your role and store are managed by an administrator.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>Use at least 8 characters.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <FormField id="old" label="Current password">
                <Input id="old" type="password" autoComplete="current-password" required value={form.oldPassword} onChange={(e) => setForm({ ...form, oldPassword: e.target.value })} />
              </FormField>
              <FormField id="new" label="New password">
                <Input id="new" type="password" autoComplete="new-password" minLength={8} required value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
              </FormField>
              <FormField id="confirm" label="Confirm new password">
                <Input id="confirm" type="password" autoComplete="new-password" minLength={8} required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
              </FormField>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Updating…" : "Update password"}</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
