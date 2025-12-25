// Authentication Hooks using TanStack Query
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@store/hooks";
import { logout as logoutAction } from "@store/slices/authSlice";
import apiClient, { getErrorMessage } from "../client";
import { saveTokens, clearTokens } from "@services/tokenStorage";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
} from "../types";

// ===================================
// LOGIN MUTATION
// ===================================

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
    onSuccess: async (data) => {
      // Save tokens to secure storage
      await saveTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accessExp: Date.now() + 15 * 60 * 1000, // Assume 15 min expiry
      });
    },
    onError: (error) => {
      console.error("Login failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// REGISTER MUTATION
// ===================================

export const useRegister = () => {
  return useMutation({
    mutationFn: async (
      userData: RegisterRequest
    ): Promise<RegisterResponse> => {
      const response = await apiClient.post<RegisterResponse>(
        "/auth/signup",
        userData
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Registration failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// REFRESH TOKEN MUTATION
// ===================================

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (refreshToken: string): Promise<RefreshTokenResponse> => {
      const response = await apiClient.post<RefreshTokenResponse>(
        "/auth/refresh",
        {
          refresh_token: refreshToken,
        }
      );
      return response.data;
    },
    onSuccess: async (data) => {
      // Save new tokens
      await saveTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accessExp: Date.now() + 15 * 60 * 1000,
      });
    },
    onError: (error) => {
      console.error("Token refresh failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// LOGOUT HELPER
// ===================================

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return () => {
    dispatch(logoutAction());
    clearTokens();
  };
};
