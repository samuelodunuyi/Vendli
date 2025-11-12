import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { AccessDeniedMessage } from './AccessDeniedMessage';
import type { RootState } from '@/redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: (number | string)[];
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);

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

  const hasRole = (role: number | string) => {
    const userRole = typeof user.role === 'string' ? parseInt(user.role) : user.role;
    return userRole === Number(role);
  };

  const isAllowed = allowedRoles ? allowedRoles.some(role => hasRole(role)) : true;

  if (!isAllowed) {
    return <AccessDeniedMessage />;
  }

  return <>{children}</>;
}
