import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { getErrorMessage } from "../client";

interface RegisterTokenPayload {
  expoToken: string;
  platform?: "android" | "ios";
  appType: "consumer";
  deviceId?: string;
}

interface RemoveTokenPayload {
  expoToken: string;
}

interface TokenResponse {
  success: boolean;
  message: string;
  token?: {
    _id: string;
    userId: string;
    expoToken: string;
    platform: string;
    appType: string;
    deviceId?: string;
    isActive: boolean;
    lastActive: string;
  };
}

interface GetTokensResponse {
  success: boolean;
  count: number;
  tokens: Array<{
    _id: string;
    userId: string;
    expoToken: string;
    platform: string;
    appType: string;
    deviceId?: string;
    isActive: boolean;
    lastActive: string;
  }>;
}

/**
 * Hook to register or update Expo push notification token
 */
export const useRegisterExpoToken = () => {
  return useMutation<TokenResponse, Error, RegisterTokenPayload>({
    mutationFn: async (payload) => {
      // Token endpoint is at /api/v1/token/expo (not under /user)
      // Since base URL is /api/v1/user, we go up with /../token/expo
      const response = await apiClient.post<TokenResponse>(
        "/../token/expo",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Token registered successfully
    },
    onError: (error) => {
      console.error("Failed to register expo token:", getErrorMessage(error));
    },
  });
};

/**
 * Hook to remove Expo push notification token
 */
export const useRemoveExpoToken = () => {
  return useMutation<TokenResponse, Error, RemoveTokenPayload>({
    mutationFn: async (payload) => {
      // Token endpoint is at /api/v1/token/expo (not under /user)
      const response = await apiClient.delete<TokenResponse>("/../token/expo", {
        data: payload,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Token removed successfully
    },
    onError: (error) => {
      console.error("Failed to remove expo token:", getErrorMessage(error));
    },
  });
};

/**
 * Hook to get all registered tokens for the current user (debug)
 */
export const useGetExpoTokens = () => {
  return useQuery<GetTokensResponse, Error>({
    queryKey: ["expo-tokens"],
    queryFn: async () => {
      // Token endpoint is at /api/v1/token/expo (not under /user)
      const response = await apiClient.get<GetTokensResponse>("/../token/expo");
      return response.data;
    },
    enabled: false, // Only run when explicitly called
  });
};
