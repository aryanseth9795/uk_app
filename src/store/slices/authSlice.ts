// Simplified Auth Slice - Token and User State Management
// Data fetching moved to TanStack Query hooks
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTokens } from "@services/tokenStorage";
import { clearPrimaryAddressId } from "./addressSlice";
import type { User } from "@api/types";

// ===================================
// STATE TYPES
// ===================================

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// ===================================
// AUTH SLICE
// ===================================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user info (called by useUserProfile hook)
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    // Set authenticated status (called after successful login)
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },

    // Logout
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      clearTokens(); // Clear tokens from storage
      // Note: clearPrimaryAddressId must be dispatched separately in components
      // because reducers cannot dispatch other actions
    },
  },
});

export const { setUser, setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
