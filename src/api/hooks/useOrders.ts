// Order Hooks using TanStack Query
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import apiClient, { getErrorMessage } from "../client";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrdersListResponse,
  OrderDetailRequest,
  OrderDetailResponse,
  CancelOrderRequest,
  CancelOrderResponse,
} from "../types";

// ===================================
// GET ORDERS LIST
// ===================================

export const useOrders = (
  options?: Omit<UseQueryOptions<OrdersListResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["orders", "list"],
    queryFn: async (): Promise<OrdersListResponse> => {
      const response = await apiClient.get<OrdersListResponse>("/orders/list");
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds - orders should be relatively fresh
    ...options,
  });
};

// ===================================
// GET ORDER DETAIL
// ===================================

export const useOrderDetail = (
  orderId: string | undefined,
  options?: Omit<UseQueryOptions<OrderDetailResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["orders", "detail", orderId],
    queryFn: async (): Promise<OrderDetailResponse> => {
      const response = await apiClient.post<OrderDetailResponse>(
        "/orders/details",
        {
          orderId,
        }
      );
      return response.data;
    },
    enabled: !!orderId,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

// ===================================
// CREATE ORDER MUTATION
// ===================================

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      orderData: CreateOrderRequest
    ): Promise<CreateOrderResponse> => {
      const response = await apiClient.post<CreateOrderResponse>(
        "/orders/create",
        orderData
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate orders list to show the new order
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });

      // Optionally set the order detail in cache
      queryClient.setQueryData(["orders", "detail", data.order._id], {
        success: true,
        order: data.order,
      });
    },
    onError: (error) => {
      console.error("Create order failed:", getErrorMessage(error));
    },
  });
};

// ===================================
// CANCEL ORDER MUTATION
// ===================================

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string): Promise<CancelOrderResponse> => {
      const response = await apiClient.post<CancelOrderResponse>(
        "/orders/cancel",
        {
          orderId,
        }
      );
      return response.data;
    },
    onSuccess: (data, orderId) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });

      // Update the specific order in cache
      queryClient.invalidateQueries({
        queryKey: ["orders", "detail", orderId],
      });
    },
    onError: (error) => {
      console.error("Cancel order failed:", getErrorMessage(error));
    },
  });
};
