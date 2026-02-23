"use client";

import { useQuery } from "@tanstack/react-query";
import { pokemonKeys } from "@/lib/api/queryKeys";
import { fetchNormalizedEvolutionChain } from "@/lib/api/pokemon";
import type { EvolutionNode } from "@/types/models";

export function useEvolutionChain(chainId: number | undefined): {
  chain: EvolutionNode | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const query = useQuery({
    queryKey: pokemonKeys.evolution(chainId ?? 0),
    queryFn: () => fetchNormalizedEvolutionChain(chainId!),
    enabled: !!chainId && chainId > 0,
  });

  return {
    chain: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
