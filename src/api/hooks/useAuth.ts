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
  SendEmailOtpRequest,
  SendEmailOtpResponse,
  VerifyAndRegisterRequest,
  VerifyAndRegisterResponse,
  AddEmailRequest,
  AddEmailResponse,
  ForgotPasswordSendOtpRequest,
  ForgotPasswordSendOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
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
        credentials,
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
      userData: RegisterRequest,
    ): Promise<RegisterResponse> => {
      const response = await apiClient.post<RegisterResponse>(
        "/auth/signup",
        userData,
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
        },
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

// ===================================
// EMAIL OTP — SEND OTP
// ===================================

export const useSendEmailOtp = () => {
  return useMutation({
    mutationFn: async (
      payload: SendEmailOtpRequest,
    ): Promise<SendEmailOtpResponse> => {
      const response = await apiClient.post<SendEmailOtpResponse>(
        "/auth/email-otp/send",
        payload,
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Send OTP failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// EMAIL OTP — VERIFY & REGISTER (new users)
// ===================================

export const useVerifyAndRegister = () => {
  return useMutation({
    mutationFn: async (
      payload: VerifyAndRegisterRequest,
    ): Promise<VerifyAndRegisterResponse> => {
      const response = await apiClient.post<VerifyAndRegisterResponse>(
        "/auth/email-otp/verify-and-register",
        payload,
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Verify & Register failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// EMAIL OTP — ADD EMAIL (existing users)
// ===================================

export const useAddEmail = () => {
  return useMutation({
    mutationFn: async (payload: AddEmailRequest): Promise<AddEmailResponse> => {
      const response = await apiClient.post<AddEmailResponse>(
        "/user/email-otp/add-email",
        payload,
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Add email failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// FORGOT PASSWORD — SEND OTP
// ===================================

export const useForgotPasswordSendOtp = () => {
  return useMutation({
    mutationFn: async (
      payload: ForgotPasswordSendOtpRequest,
    ): Promise<ForgotPasswordSendOtpResponse> => {
      const response = await apiClient.post<ForgotPasswordSendOtpResponse>(
        "/auth/forgot-password/send-otp",
        payload,
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Forgot password send OTP failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// FORGOT PASSWORD — RESET PASSWORD
// ===================================

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (
      payload: ResetPasswordRequest,
    ): Promise<ResetPasswordResponse> => {
      const response = await apiClient.post<ResetPasswordResponse>(
        "/auth/forgot-password/reset",
        payload,
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Reset password failed:", getErrorMessage(error));
    },
  });
};
