import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "@/lib/roles";

export interface SessionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber?: string;
  role: UserRole;
  storeId: number | null;
  storeName: string | null;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: SessionUser | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signedIn: (state, { payload }: PayloadAction<Tokens & { user: SessionUser }>) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.user = payload.user;
    },
    tokensRefreshed: (state, { payload }: PayloadAction<Tokens>) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
    profileUpdated: (state, { payload }: PayloadAction<Partial<Pick<SessionUser, "firstName" | "lastName" | "phoneNumber">>>) => {
      if (state.user) Object.assign(state.user, payload);
    },
    signedOut: () => initialState,
  },
  selectors: {
    selectCurrentUser: (state) => state.user,
    selectRole: (state) => state.user?.role ?? null,
    selectIsAuthenticated: (state) => Boolean(state.accessToken && state.user),
  },
});

export const { signedIn, tokensRefreshed, profileUpdated, signedOut } = authSlice.actions;
export const { selectCurrentUser, selectRole, selectIsAuthenticated } = authSlice.selectors;
export default authSlice.reducer;
