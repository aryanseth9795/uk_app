import { QueryClient } from "@tanstack/react-query";

// Production-ready Query Client Configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)

      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 2 times for network errors
        return failureCount < 2;
      },

      // Refetch strategies
      refetchOnWindowFocus: false, // Don't refetch on window focus (mobile app)
      refetchOnReconnect: true, // Refetch when connection is restored
      refetchOnMount: true, // Refetch when component mounts if data is stale
    },
    mutations: {
      // Retry mutations once on network error
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
