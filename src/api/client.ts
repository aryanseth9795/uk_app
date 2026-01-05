// Axios Client with Token Interceptors and Auto-Refresh
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "@store/index";
import { logout } from "@store/slices/authSlice";
import { loadTokens, saveTokens, clearTokens } from "@services/tokenStorage";
import type { RefreshTokenResponse } from "./types";

// Get base URL from environment
// const API_BASE_URL ="http://192.168.1.6:5000/api/v1/user";
export const API_BASE_URL ="https://u-r-s-backend-node.onrender.com/api/v1/user";

// Create Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

// Notify all subscribers when token is refreshed
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

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
        // If already refreshing, wait for the new token
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token
        const tokens = await loadTokens();
        const refreshToken = tokens.refreshToken;

        if (!refreshToken) {
          // No refresh token available, logout
          store.dispatch(logout());
          await clearTokens();
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

          // Notify all waiting requests
          onTokenRefreshed(access_token);

          isRefreshing = false;

          // Retry original request
          return apiClient(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        isRefreshing = false;
        refreshSubscribers = [];
        store.dispatch(logout());
        await clearTokens();
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
