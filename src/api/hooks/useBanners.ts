// Banner Hooks using TanStack Query
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import apiClient from "../client";
import type { BannersResponse, Banner, NormalizedBanners } from "../types";

// ===================================
// BANNER NORMALIZATION UTILITY
// ===================================

/**
 * Normalizes banners from API response into grouped structure
 * Groups by title (top, middle, bottom) and sorts by child property
 */
function normalizeBanners(banners: Banner[]): NormalizedBanners {
  const grouped: NormalizedBanners = {
    top: [],
    middle: [],
    bottom: [],
  };

  // Group banners by title (case-insensitive)
  banners.forEach((banner) => {
    const key = banner.title.toLowerCase() as keyof NormalizedBanners;
    if (grouped[key]) {
      grouped[key].push(banner);
    }
  });

  // Sort each group by child property (ascending)
  // Banners without child property will be sorted first (undefined < number)
  Object.keys(grouped).forEach((key) => {
    grouped[key as keyof NormalizedBanners].sort(
      (a, b) => (a.child || 0) - (b.child || 0)
    );
  });

  return grouped;
}

// ===================================
// FETCH ALL BANNERS
// ===================================

export const useBanners = (
  options?: Omit<
    UseQueryOptions<BannersResponse, Error, NormalizedBanners, string[]>,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async (): Promise<BannersResponse> => {
      const response = await apiClient.get<BannersResponse>("/banners");
      return response.data;
    },
    select: (data) => normalizeBanners(data.banners),
    staleTime: 60 * 60 * 1000, // 1 hour - matches Redis cache TTL
    ...options,
  });
};
