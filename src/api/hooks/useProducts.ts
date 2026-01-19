// Product Hooks using TanStack Query
import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import apiClient, { getErrorMessage } from "../client";
import type {
  LandingPageResponse,
  CategoryProductsResponse,
  ProductDetailResponse,
  SimilarProductsResponse,
  SearchProductsResponse,
  SearchSuggestionsResponse,
  SearchFilters,
  MixedProductsResponse,
  FilteredMixedProductsResponse,
  CategoryMixedProductsResponse,
} from "../types";

// ===================================
// LANDING PAGE PRODUCTS
// ===================================

export const useLandingProducts = (
  options?: Omit<UseQueryOptions<LandingPageResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["products", "landing"],
    queryFn: async (): Promise<LandingPageResponse> => {
      const response = await apiClient.get<LandingPageResponse>(
        "/products/landing"
      );

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - landing page products don't change often
    ...options,
  });
};

// ===================================
// FILTERED LANDING PAGE PRODUCTS
// ===================================

export type FilterType =
  | "isCheap"
  | "isLatestProduct"
  | "isTopDiscount"
  | "topSeller";

export const useFilteredLandingProducts = (
  filterType: FilterType,
  options?: Omit<UseQueryOptions<LandingPageResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["products", "landing", "filtered", filterType],
    queryFn: async (): Promise<LandingPageResponse> => {
      const response = await apiClient.get<LandingPageResponse>(
        "/products/landing/filtered",
        {
          params: {
            [filterType]: true,
          },
        }
      );

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// ===================================
// CATEGORY PRODUCTS (Level-Aware)
// ===================================

export const useCategoryProducts = (
  categoryId: string,
  options?: Omit<
    UseQueryOptions<CategoryProductsResponse>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: async (): Promise<CategoryProductsResponse> => {
      const response = await apiClient.get<CategoryProductsResponse>(
        `/products/category/${categoryId}`
      );
      return response.data;
    },
    enabled: !!categoryId, // Only run if categoryId exists
    staleTime: 3 * 60 * 1000, // 3 minutes
    ...options,
  });
};

// ===================================
// PRODUCT DETAIL BY ID
// ===================================

export const useProductDetail = (
  productId: string | undefined,
  options?: Omit<UseQueryOptions<ProductDetailResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["products", "detail", productId],
    queryFn: async (): Promise<ProductDetailResponse> => {
      const response = await apiClient.get<ProductDetailResponse>(
        `/products/${productId}`
      );
      return response.data;
    },
    enabled: !!productId, // Only run if productId exists
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// ===================================
// SIMILAR PRODUCTS
// ===================================

export const useSimilarProducts = (
  categoryId: string,
  excludeProductId?: string,
  options?: Omit<
    UseQueryOptions<SimilarProductsResponse>,
    "queryKey" | "queryFn"
  >
) => {
  console.log(categoryId,excludeProductId);
  return useQuery({
    queryKey: ["products", "similar", categoryId, excludeProductId],
    
    queryFn: async (): Promise<SimilarProductsResponse> => {
      const response = await apiClient.get<SimilarProductsResponse>(
        `/products/similar/${categoryId}`,
        {
          params: excludeProductId ? { excludeProductId } : undefined,
        }
      );
      return response.data;
    },
    enabled: !!categoryId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    ...options,
  });
};

// ===================================
// SEARCH PRODUCTS
// ===================================

export const useSearchProducts = (
  filters: SearchFilters,
  options?: Omit<
    UseQueryOptions<SearchProductsResponse>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["products", "search", filters],
    queryFn: async (): Promise<SearchProductsResponse> => {
      // console.log("useSearchProducts", filters);
      const response = await apiClient.get<SearchProductsResponse>(
        "/products/search",
        {
          params: filters,
        }
      );
      return response.data;
    },
    enabled: !!(
      filters.q ||
      filters.categoryId ||
      filters.subCategoryId ||
      filters.subSubCategoryId ||
      filters.brand
    ), // Only run if there's a search query or filter
    staleTime: 1 * 60 * 1000, // 1 minute - search results should be fresher
    ...options,
  });
};

// ===================================
// SEARCH SUGGESTIONS (Autocomplete)
// ===================================

export const useSearchSuggestions = (
  query: string,
  options?: Omit<
    UseQueryOptions<SearchSuggestionsResponse>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["products", "suggestions", query],
    queryFn: async (): Promise<SearchSuggestionsResponse> => {
      const response = await apiClient.get<SearchSuggestionsResponse>(
        "/products/search/suggestions",
        {
          params: { q: query },
        }
      );
      return response.data;
    },
    enabled: query.length >= 2, // Only search if query has at least 2 characters
    staleTime: 30 * 1000, // 30 seconds - suggestions can be very fresh
    ...options,
  });
};

// ===================================
// MIXED PRODUCTS (Infinite Scroll)
// ===================================

export const useMixedProducts = (
  limit: number = 20,
  options?: Omit<
    UseInfiniteQueryOptions<MixedProductsResponse>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => {
  return useInfiniteQuery({
    queryKey: ["products", "mixed", limit],
    queryFn: async ({ pageParam = 1 }): Promise<MixedProductsResponse> => {
      const response = await apiClient.get<MixedProductsResponse>(
        "/products/mixed",
        {
          params: {
            page: pageParam,
            limit,
          },
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// ===================================
// FILTERED MIXED PRODUCTS (Infinite Scroll)
// ===================================

export type MixedFilterType =
  | "cheapest"
  | "newest"
  | "topDiscount"
  | "topSeller";

export const useFilteredMixedProducts = (
  filter: MixedFilterType,
  options?: Omit<
    UseInfiniteQueryOptions<FilteredMixedProductsResponse>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => {
  return useInfiniteQuery({
    queryKey: ["products", "mixed", "filtered", filter] as const,
    queryFn: async ({
      pageParam = 1,
    }): Promise<FilteredMixedProductsResponse> => {
      const response = await apiClient.get<FilteredMixedProductsResponse>(
        "/products/mixed/filtered",
        {
          params: {
            filter,
            page: pageParam,
          },
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: FilteredMixedProductsResponse) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// ===================================
// CATEGORY MIXED PRODUCTS (Infinite Scroll)
// ===================================

export const useCategoryMixedProducts = (
  categoryId: string,
  excludeProductId?: string,
  options?: Omit<
    UseInfiniteQueryOptions<CategoryMixedProductsResponse>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => {
  return useInfiniteQuery({
    queryKey: [
      "products",
      "category",
      categoryId,
      "mixed",
      excludeProductId,
    ] as const,
    queryFn: async ({
      pageParam = 1,
    }): Promise<CategoryMixedProductsResponse> => {
      const response = await apiClient.get<CategoryMixedProductsResponse>(
        `/products/category/${categoryId}/mixed`,
        {
          params: {
            page: pageParam,
            ...(excludeProductId && { excludeProductId }),
          },
        }
      );
      return response.data;
    },
    enabled: !!categoryId,
    initialPageParam: 1,
    getNextPageParam: (lastPage: CategoryMixedProductsResponse) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};
