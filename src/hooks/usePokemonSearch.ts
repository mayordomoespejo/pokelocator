"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { pokemonKeys } from "@/lib/api/queryKeys";
import { fetchAllPokemonNames } from "@/lib/api/pokemon";
import { getIdFromUrl } from "@/lib/utils/pokemon";
import { MAX_SEARCH_SUGGESTIONS } from "@/lib/constants";

export interface SearchSuggestion {
  id: number;
  name: string;
}

/**
 * Client-side pokemon search.
 * Fetches all ~1300 pokemon names once (cached indefinitely), then filters
 * locally on every keypress after debouncing.
 */
export function usePokemonSearch(query: string): {
  suggestions: SearchSuggestion[];
  isLoading: boolean;
} {
  const allNamesQuery = useQuery({
    queryKey: pokemonKeys.allNames(),
    queryFn: fetchAllPokemonNames,
    staleTime: Infinity,
  });

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!query || query.length < 2 || !allNamesQuery.data) return [];
    const q = query.toLowerCase().trim();
    return allNamesQuery.data.results
      .filter((p) => p.name.startsWith(q))
      .slice(0, MAX_SEARCH_SUGGESTIONS)
      .map((p) => ({
        name: p.name,
        id: getIdFromUrl(p.url),
      }));
  }, [query, allNamesQuery.data]);

  return {
    suggestions,
    isLoading: allNamesQuery.isLoading,
  };
}
