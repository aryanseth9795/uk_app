import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { getErrorMessage, TOKEN_BASE_URL } from "../client";

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
      // Absolute URL, derived from TOKEN_BASE_URL. The previous
      // "/../token/expo" climbed out of the /user base URL and only resolved
      // correctly by accident of URL normalization (CA-10).
      const response = await apiClient.post<TokenResponse>(
        `${TOKEN_BASE_URL}/expo`,
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
      const response = await apiClient.delete<TokenResponse>(`${TOKEN_BASE_URL}/expo`, {
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
      const response = await apiClient.get<GetTokensResponse>(`${TOKEN_BASE_URL}/expo`);
      return response.data;
    },
    enabled: false, // Only run when explicitly called
  });
};
