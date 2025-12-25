// AuthInitializer.tsx - Restores authentication state on app load
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated, logout, setUser } from "@store/slices/authSlice";
import { loadTokens, saveTokens, clearTokens } from "@services/tokenStorage";
import { useUserProfile } from "@api/hooks/useUser";
import axios from "axios";
import type { RefreshTokenResponse } from "@api/types";
import type { RootState } from "@store/index";
import { API_BASE_URL } from "@/api/client";

export default function AuthInitializer() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Fetch user profile whenever authenticated
  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useUserProfile({
    enabled: isAuthenticated,
  });

  // Update Redux store when user profile is successfully fetched
  useEffect(() => {
    if (profileData?.user) {
      dispatch(setUser(profileData.user));
    }
  }, [profileData, dispatch]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Load tokens from secure storage
        const tokens = await loadTokens();

        // If we don't have any access token, user is not authenticated
        if (!tokens.accessToken) {
          dispatch(setAuthenticated(false));
          return;
        }

        // Check if access token is expired
        const now = Date.now();
        const isExpired = tokens.accessExp && tokens.accessExp < now;

        if (!isExpired) {
          // Access token is valid, restore authenticated state
          dispatch(setAuthenticated(true));
        } else {
          // Access token expired, try to refresh using refresh token
          if (!tokens.refreshToken) {
            // No refresh token available, user needs to login again
            dispatch(logout());
            await clearTokens();
            return;
          }

          // Call refresh token endpoint
          try {
            const response = await axios.post<RefreshTokenResponse>(
              `${API_BASE_URL}/auth/refresh`,
              { refresh_token: tokens.refreshToken },
              {
                headers: { "Content-Type": "application/json" },
                timeout: 10000,
              }
            );

            if (response.data.success) {
              const { access_token, refresh_token } = response.data;

              // Save new tokens to secure storage
              await saveTokens({
                accessToken: access_token,
                refreshToken: refresh_token,
                accessExp: Date.now() + 15 * 60 * 1000,
              });

              // Update auth state
              dispatch(setAuthenticated(true));
            } else {
              // Refresh failed, logout user
              dispatch(logout());
              await clearTokens();
            }
          } catch (refreshError) {
            // Refresh failed
            dispatch(logout());
            await clearTokens();
          }
        }
      } catch (error) {
        dispatch(setAuthenticated(false));
      }
    };

    initAuth();
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}
