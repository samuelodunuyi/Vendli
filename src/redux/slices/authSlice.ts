// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  lastName: string;
  firstName: string;
  username: string;
  email: string;
  role: number;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  loading: false,
};

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<AuthPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setTokens, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
