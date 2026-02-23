"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { pokemonKeys } from "@/lib/api/queryKeys";
import { fetchPokemonListWithDetails, fetchPokemonByType } from "@/lib/api/pokemon";
import type { PokemonListItem } from "@/types/models";

export interface UsePokemonListOptions {
  typeFilter?: string;
}

interface UsePokemonListResult {
  pokemon: PokemonListItem[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void | Promise<unknown>;
}

/**
 * Hook for the main pokemon list. Supports infinite scroll and type filtering.
 * When a typeFilter is active, uses a regular query (type endpoint returns full list).
 * Without a filter, uses infinite query with pagination.
 */
export function usePokemonList(options: UsePokemonListOptions = {}): UsePokemonListResult {
  const { typeFilter } = options;

  // Infinite scroll query — used when no type filter is active
  const infiniteQuery = useInfiniteQuery({
    queryKey: pokemonKeys.list({ typeFilter: undefined }),
    queryFn: ({ pageParam }) => fetchPokemonListWithDetails(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.meta.nextOffset ?? undefined,
    enabled: !typeFilter,
  });

  // Type-filtered query — fetches all pokemon of a given type
  const typeQuery = useQuery({
    queryKey: pokemonKeys.list({ typeFilter }),
    queryFn: () => fetchPokemonByType(typeFilter!),
    enabled: !!typeFilter,
  });

  if (typeFilter) {
    return {
      pokemon: typeQuery.data?.items ?? [],
      fetchNextPage: () => {},
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: typeQuery.isLoading,
      isError: typeQuery.isError,
      error: typeQuery.error,
      refetch: () => typeQuery.refetch(),
    };
  }

  return {
    pokemon: infiniteQuery.data?.pages.flatMap((p) => p.items) ?? [],
    fetchNextPage: infiniteQuery.fetchNextPage,
    hasNextPage: infiniteQuery.hasNextPage,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    isLoading: infiniteQuery.isLoading,
    isError: infiniteQuery.isError,
    error: infiniteQuery.error,
    refetch: () => infiniteQuery.refetch(),
  };
}
