
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { AccessDeniedMessage } from './AccessDeniedMessage';

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
  const { user, loading, hasRole, hasPermission } = useAuth();
  const navigate = useNavigate();

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

  if (!user) {
    return null;
  }

  // Check role requirement - either single role or multiple allowed roles
  const hasRequiredRole = () => {
    if (allowedRoles && allowedRoles.length > 0) {
      return allowedRoles.some(role => hasRole(role));
    }
    if (requiredRole) {
      // Super admin can access everything
      return hasRole('super_admin') || hasRole(requiredRole);
    }
    return true;
  };

  if (!hasRequiredRole()) {
    return (
      <AccessDeniedMessage 
        requiredRole={requiredRole}
        requiredPermission={requiredPermission}
      />
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.permission)) {
    return (
      <AccessDeniedMessage 
        requiredRole={requiredRole}
        requiredPermission={requiredPermission}
      />
    );
  }

  return <>{children}</>;
}
