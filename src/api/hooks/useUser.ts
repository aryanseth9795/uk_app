// User Profile & Address Hooks using TanStack Query
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "@store/slices/authSlice";
import apiClient, { getErrorMessage } from "../client";
import type {
  UserDetailsResponse,
  AddAddressRequest,
  AddAddressResponse,
  EditAddressRequest,
  EditAddressResponse,
  DeleteAddressResponse,
} from "../types";

// ===================================
// GET USER PROFILE
// ===================================

export const useUserProfile = (
  options?: Omit<UseQueryOptions<UserDetailsResponse>, "queryKey" | "queryFn">
) => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async (): Promise<UserDetailsResponse> => {
      const response = await apiClient.get<UserDetailsResponse>(
        "/user/details"
      );
      return response.data;
    },
    staleTime: Infinity, // Keep fresh until mutation - user profile rarely changes
    ...options,
  });
};

// ===================================
// ADD ADDRESS MUTATION
// ===================================

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      addressData: AddAddressRequest
    ): Promise<AddAddressResponse> => {
      const response = await apiClient.post<AddAddressResponse>(
        "/user/address/add",
        addressData
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user profile to refetch updated addresses
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error) => {
      console.error("Add address failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// EDIT ADDRESS MUTATION
// ===================================

export const useEditAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      addressId,
      addressData,
    }: {
      addressId: string;
      addressData: EditAddressRequest;
    }): Promise<EditAddressResponse> => {
      const response = await apiClient.put<EditAddressResponse>(
        `/user/address/edit/${addressId}`,
        addressData
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user profile to refetch updated addresses
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error) => {
      console.error("Edit address failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// DELETE ADDRESS MUTATION
// ===================================

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string): Promise<DeleteAddressResponse> => {
      const response = await apiClient.delete<DeleteAddressResponse>(
        `/user/address/delete/${addressId}`
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user profile to refetch updated addresses
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error) => {
      console.error("Delete address failed:", getErrorMessage(error));
    },
  });
};
