"use client";

import { useQuery } from "@tanstack/react-query";
import { typeKeys } from "@/lib/api/queryKeys";
import { fetchAllTypesRaw } from "@/lib/api/pokemon";
import { EXCLUDED_TYPES } from "@/lib/constants";

export function usePokemonTypes(): {
  types: string[];
  isLoading: boolean;
} {
  const query = useQuery({
    queryKey: typeKeys.list(),
    queryFn: fetchAllTypesRaw,
    staleTime: Infinity,
    select: (data) => data.results.map((t) => t.name).filter((name) => !EXCLUDED_TYPES.has(name)),
  });

  return {
    types: query.data ?? [],
    isLoading: query.isLoading,
  };
}
