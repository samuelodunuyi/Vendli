import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { AccessDeniedMessage } from './AccessDeniedMessage';
import type { RootState } from '@/redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
  requiredPermission?: {
    module: string;
    permission: string;
  };
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowedRoles,
  requiredPermission 
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Roles check
  // const hasRole = (role: string) => user.roles?.includes(role); // assuming user.roles is string[]
  
  // const hasRequiredRole = () => {
  //   if (allowedRoles?.length) return allowedRoles.some(role => hasRole(role));
  //   return requiredRole ? hasRole('super_admin') || hasRole(requiredRole) : true;
  // };

  // if (!hasRequiredRole()) {
  //   return <AccessDeniedMessage requiredRole={requiredRole} requiredPermission={requiredPermission} />;
  // }

  // Permissions check
  // const hasPermission = (module: string, permission: string) => {
  //   return user.permissions?.[module]?.includes(permission); // adjust according to your schema
  // };

  // if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.permission)) {
  //   return <AccessDeniedMessage requiredRole={requiredRole} requiredPermission={requiredPermission} />;
  // }

  return <>{children}</>;
}
