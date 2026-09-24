import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck, Store, MonitorSmartphone } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { useAuth } from "@/hooks/useAuth";
import { homePathFor } from "@/lib/roles";
import { apiErrorMessage } from "@/lib/errors";
import { USE_MOCK_API } from "@/config";

const DEMO_ACCOUNTS = [
  { label: "Super Admin", email: "superadmin@vendli.ng", hint: "All stores, users & settings", icon: ShieldCheck },
  { label: "Store Admin", email: "storeadmin@vendli.ng", hint: "Victoria Island Store only", icon: Store },
  { label: "POS User", email: "pos@vendli.ng", hint: "Till at Victoria Island", icon: MonitorSmartphone },
];
const DEMO_PASSWORD = "Demo@123";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signingIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  if (user) return <Navigate to={homePathFor(user.role)} replace />;

  const submit = async (email: string, password: string) => {
    try {
      const home = await signIn(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      // Only honour the redirect if it's inside the user's own area.
      navigate(from && from.startsWith(home) ? from : home, { replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Sign in failed"));
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <AuthHeader />

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in with your staff account</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit(form.email.trim(), form.password);
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="username" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className="pr-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Forgot your password? Ask your store admin to reset it.</p>
              </div>
              <Button type="submit" className="w-full" disabled={signingIn}>
                {signingIn && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        {USE_MOCK_API && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Demo accounts</CardTitle>
              <CardDescription>
                Password for all: <code className="font-mono">{DEMO_PASSWORD}</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {DEMO_ACCOUNTS.map(({ label, email, hint, icon: Icon }) => (
                <Button key={email} variant="outline" className="h-auto justify-start py-3 text-left" disabled={signingIn} onClick={() => submit(email, DEMO_PASSWORD)}>
                  <Icon className="h-5 w-5 mr-3 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="block font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground truncate">{email} · {hint}</span>
                  </span>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
