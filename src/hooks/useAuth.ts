import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectCurrentUser, signedIn, signedOut } from "@/redux/slices/authSlice";
import { useLoginMutation, useLogoutMutation } from "@/redux/services/auth.services";
import { UserRole, homePathFor, isStoreScoped } from "@/lib/roles";

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);
  const [login, loginState] = useLoginMutation();
  const [logout] = useLogoutMutation();

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await login({ email, password }).unwrap();
      dispatch(
        signedIn({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: {
            id: res.id,
            firstName: res.firstName,
            lastName: res.lastName,
            email: res.email,
            username: res.username,
            phoneNumber: res.phoneNumber,
            role: res.role,
            storeId: res.store?.storeId ?? null,
            storeName: res.store?.storeName ?? null,
          },
        })
      );
      return homePathFor(res.role);
    },
    [dispatch, login]
  );

  const signOut = useCallback(async () => {
    // Revoke server-side, but never let a failed call keep someone signed in locally.
    if (refreshToken) await logout({ refreshToken }).unwrap().catch(() => undefined);
    dispatch(signedOut());
    navigate("/auth", { replace: true });
  }, [dispatch, logout, navigate, refreshToken]);

  const role = user?.role ?? null;
  return {
    user,
    role,
    isSuperAdmin: role === UserRole.SuperAdmin,
    isStoreAdmin: role === UserRole.StoreAdmin,
    isStoreScoped: isStoreScoped(role),
    signIn,
    signingIn: loginState.isLoading,
    signOut,
  };
}
