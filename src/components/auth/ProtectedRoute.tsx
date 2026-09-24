import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/slices/authSlice";
import type { UserRole } from "@/lib/roles";
import { AccessDeniedMessage } from "./AccessDeniedMessage";

interface ProtectedRouteProps {
  roles?: readonly UserRole[];
  children?: React.ReactNode;
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(user.role)) return <AccessDeniedMessage />;

  return <>{children ?? <Outlet />}</>;
}
