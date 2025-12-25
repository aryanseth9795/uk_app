// AuthInitializer.tsx - Restores authentication state on app load
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated, logout, setUser } from "@store/slices/authSlice";
import { loadTokens, saveTokens, clearTokens } from "@services/tokenStorage";
import { useUserProfile } from "@api/hooks/useUser";
import axios from "axios";
import type { RefreshTokenResponse } from "@api/types";
import type { RootState } from "@store/index";

// Get base URL from environment (same as API client)
const API_BASE_URL = "http://192.168.1.3:5000/api/v1/user";

/**
 * Component that checks for stored tokens on app initialization
 * and updates the auth slice accordingly.
 *
 * Features:
 * - Loads tokens from secure storage
 * - Validates token expiry
 * - Automatically refreshes expired access tokens using refresh token
 * - Updates auth state based on token validity
 * - Fetches user profile data when authenticated
 *
 * This should be mounted once at the root level of the app.
 */
export default function AuthInitializer() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Fetch user profile whenever authenticated (will be called after tokens are validated/refreshed)
  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useUserProfile({
    enabled: isAuthenticated,
  });

  console.log(
    "[AuthInitializer RENDER] isAuthenticated:",
    isAuthenticated,
    "| profileData:",
    profileData ? "LOADED" : "undefined",
    "| isLoading:",
    isLoading,
    "| isError:",
    isError
  );

  // Log error details when profile fetch fails
  useEffect(() => {
    if (isError && error) {
      console.error("[AuthInitializer] ❌ User profile fetch failed!");
      console.error("[AuthInitializer] Error details:", error);
      // @ts-ignore - error object might have response
      if (error?.response) {
        // @ts-ignore
        console.error(
          "[AuthInitializer] Response status:",
          error.response.status
        );
        // @ts-ignore
        console.error("[AuthInitializer] Response data:", error.response.data);
      }
    }
  }, [isError, error]);

  // Update Redux store when user profile is successfully fetched
  useEffect(() => {
    if (profileData?.user) {
      console.log("[AuthInitializer] ✅ Updating Redux with user profile");
      dispatch(setUser(profileData.user));
    }
  }, [profileData, dispatch]);

  useEffect(() => {
    const initAuth = async () => {
      console.log("[AuthInitializer] Starting auth initialization...");
      try {
        // Load tokens from secure storage
        const tokens = await loadTokens();
        console.log("[AuthInitializer] Tokens loaded:", {
          hasAccessToken: !!tokens.accessToken,
          hasRefreshToken: !!tokens.refreshToken,
          accessExp: tokens.accessExp,
        });

        // If we don't have any access token, user is not authenticated
        if (!tokens.accessToken) {
          dispatch(setAuthenticated(false));
          console.log(
            "[AuthInitializer] ❌ No token found, user not authenticated"
          );
          return;
        }

        // Check if access token is expired
        const now = Date.now();
        const isExpired = tokens.accessExp && tokens.accessExp < now;
        console.log("[AuthInitializer] Token expiry check:", {
          now,
          accessExp: tokens.accessExp,
          isExpired,
        });

        if (!isExpired) {
          // Access token is valid, restore authenticated state
          console.log(
            "[AuthInitializer] ✅ Token valid, setting authenticated = true"
          );
          dispatch(setAuthenticated(true));
          console.log(
            "[AuthInitializer] User authenticated from stored access token"
          );
        } else {
          // Access token expired, try to refresh using refresh token
          console.log(
            "[AuthInitializer] Access token expired, attempting refresh..."
          );

          if (!tokens.refreshToken) {
            // No refresh token available, user needs to login again
            dispatch(logout());
            await clearTokens();
            console.log(
              "[AuthInitializer] No refresh token available, user logged out"
            );
            return;
          }

          // Call refresh token endpoint
          try {
            const response = await axios.post<RefreshTokenResponse>(
              `${API_BASE_URL}/auth/refresh`,
              { refresh_token: tokens.refreshToken },
              {
                headers: { "Content-Type": "application/json" },
                timeout: 10000, // 10 second timeout for initialization
              }
            );

            if (response.data.success) {
              const { access_token, refresh_token } = response.data;

              // Save new tokens to secure storage
              await saveTokens({
                accessToken: access_token,
                refreshToken: refresh_token,
                accessExp: Date.now() + 15 * 60 * 1000, // 15 min expiry
              });

              // Update auth state - user is now authenticated with fresh token
              dispatch(setAuthenticated(true));
              console.log(
                "[AuthInitializer] Token refreshed successfully, user authenticated"
              );
            } else {
              // Refresh failed, logout user
              dispatch(logout());
              await clearTokens();
              console.log(
                "[AuthInitializer] Token refresh failed, user logged out"
              );
            }
          } catch (refreshError) {
            // Refresh failed (network error, invalid refresh token, etc.)
            console.error(
              "[AuthInitializer] Token refresh error:",
              refreshError
            );
            dispatch(logout());
            await clearTokens();
            console.log(
              "[AuthInitializer] Token refresh failed, user logged out"
            );
          }
        }
      } catch (error) {
        console.error(
          "[AuthInitializer] Error during auth initialization:",
          error
        );
        dispatch(setAuthenticated(false));
      }
    };

    initAuth();
  }, [dispatch]);

  // Log when profile is fetched
  useEffect(() => {
    if (profileData?.user) {
      console.log("[AuthInitializer] User profile fetched successfully");
    }
  }, [profileData]);

  // This component doesn't render anything
  return null;
}
