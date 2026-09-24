import { Link } from "react-router-dom";
import { ArrowLeft, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { homePathFor, roleLabel } from "@/lib/roles";

export function AccessDeniedMessage() {
  const { role, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShieldAlert className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground">Your account doesn't have permission to open this page.</p>
          <Badge variant="secondary">Signed in as {roleLabel(role)}</Badge>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link to={homePathFor(role)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to my workspace
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
