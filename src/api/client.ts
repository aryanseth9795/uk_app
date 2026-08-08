// Axios Client with Token Interceptors and Auto-Refresh
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { loadTokens, saveTokens } from "@services/tokenStorage";
import { createRefreshQueue } from "@utils/refreshQueue";
import { performLogout } from "@utils/auth";
import type { RefreshTokenResponse } from "./types";

// Environment selection belongs in configuration, not in a commented-out
// line. The previous version hardcoded production with a stale LAN IP commented
// above it, so every simulator run and QA build talked to prod, and pointing at
// a local backend meant editing tracked source (CA-09).
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  "https://u-r-s-backend-node.onrender.com/api/v1/user";

/**
 * Expo-token routes live at /api/v1/token, a sibling of the /user base URL.
 * Derived explicitly rather than climbing out with a "/../token/expo" relative
 * path, which only worked by accident of URL normalization (CA-10).
 */
export const TOKEN_BASE_URL = API_BASE_URL.replace(/\/user$/, "/token");

// Create Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Track whether a refresh is in flight, so concurrent 401s share one call.
let isRefreshing = false;
const refreshQueue = createRefreshQueue();

// Request Interceptor: Attach Bearer Token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get access token from storage (most up-to-date)
    const tokens = await loadTokens();
    const accessToken = tokens.accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 and Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Park until the in-flight refresh settles. The queue rejects on
        // failure as well as resolving on success, so this can never hang
        // (CA-01).
        const token = await refreshQueue.subscribe();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token
        const tokens = await loadTokens();
        const refreshToken = tokens.refreshToken;

        if (!refreshToken) {
          // No refresh token available, logout
          await performLogout();
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          const { access_token, refresh_token } = response.data;

          // Save new tokens
          await saveTokens({
            accessToken: access_token,
            refreshToken: refresh_token,
            accessExp: Date.now() + 15 * 60 * 1000, // Assume 15 min expiry
          });

          // Update request header with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          isRefreshing = false;
          refreshQueue.succeed(access_token);

          // Retry original request
          return apiClient(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        isRefreshing = false;
        // Drain the queue by REJECTING, not by discarding. Emptying the array
        // without settling left every parked request pending forever (CA-01).
        refreshQueue.fail(refreshError);
        await performLogout();
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject normally
    return Promise.reject(error);
  }
);

// Helper function to extract error message
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // 429 became a real response when Phase 1 added rate limiting, and it needs
    // its own copy: the correct user action is to WAIT, which is the opposite
    // of what a "Login Failed" alert invites (CA-04).
    if (error.response?.status === 429) {
      const retryAfter = Number(error.response.headers?.["retry-after"]);
      return Number.isFinite(retryAfter) && retryAfter > 0
        ? `Too many attempts. Please try again in ${Math.ceil(retryAfter / 60)} minute(s).`
        : "Too many attempts. Please wait a few minutes and try again.";
    }

    const message = error.response?.data?.message || error.message;
    return message || "An unexpected error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

// Export configured client
export default apiClient;
