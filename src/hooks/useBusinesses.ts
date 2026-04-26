"use client";

import useSWR from "swr";
import { getSupabaseBusinesses } from "@/services/supabaseData";

/**
 * 🚀 YELP-GRADE SWR Caching Hook
 * 
 * Benefits over plain useEffect:
 * 1. Shows cached (stale) data INSTANTLY while revalidating — zero loading flash
 * 2. Auto-revalidates on window focus (user always sees fresh data)
 * 3. Deduplicates requests — 10 components using this hook = only 1 API call
 * 4. Offline support — shows last known data if network is lost
 */

interface BusinessFilters {
  category?: string;
  search?: string;
  star_rating?: string;
  is_verified?: string;
  is_featured?: string;
  is_top_search?: string;
  is_trusted?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
}

// 🔑 Stable cache key — SWR uses this to deduplicate & cache results
function buildCacheKey(filters: BusinessFilters): string {
  return JSON.stringify({ route: "businesses", ...filters });
}

export function useBusinesses(filters: BusinessFilters = {}) {
  const key = buildCacheKey(filters);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => getSupabaseBusinesses(filters),
    {
      revalidateOnFocus: true,          // Refresh data when user returns to tab
      revalidateOnReconnect: true,      // Refresh when internet comes back
      dedupingInterval: 30_000,         // Cache for 30s — avoids duplicate requests
      keepPreviousData: true,           // Show old results while new ones load (no flash)
      fallbackData: [],
    }
  );

  return {
    businesses: data ?? [],
    isLoading,
    isValidating, // true when background revalidation happening
    error,
    mutate,       // Manually refresh if needed
  };
}

// Specialized hook for featured businesses (homepage)
export function useFeaturedBusinesses(limit = 8) {
  return useBusinesses({ is_featured: "true", limit });
}

// Specialized hook for top-searched businesses (homepage hero)
export function useTopSearchBusinesses(limit = 6) {
  return useBusinesses({ is_top_search: "true", limit });
}
