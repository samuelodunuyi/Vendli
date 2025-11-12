import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Mail, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "@/redux/store";

interface AccessDeniedMessageProps {
  requiredRole?: number;
}

export function AccessDeniedMessage({ requiredRole }: AccessDeniedMessageProps) {
  const role = useAppSelector((state) => state.auth.user?.role);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const currentRole = role ?? 'Unknown';
  const handleSwitchAccount = async () => {
    await signOut();
    navigate('/auth');
  };

  const roleLabel = (role: number | string) => {
    switch (Number(role)) {
      case 0: return 'Super Admin';
      case 1: return 'Store Admin';
      case 2: return 'POS User';
      default: return 'Customer';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            You don't have sufficient permissions to access this page.
          </p>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Your current role:</p>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              {roleLabel(currentRole)}
            </Badge>
          </div>

          {requiredRole !== undefined && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Required role:</p>
              <Badge variant="destructive" className="gap-1">
                <Shield className="h-3 w-3" />
                {roleLabel(requiredRole)}
              </Badge>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <p className="text-sm text-gray-600">
              Need access? Contact your administrator:
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
              <Mail className="h-4 w-4" />
              <span>info@codeware.com.ng</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Home
            </Button>
            <Button 
              variant="outline"
              onClick={handleSwitchAccount}
              className="flex-1 gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
