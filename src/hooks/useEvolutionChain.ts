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
  const normalizedChainId = chainId ?? 0;
  const query = useQuery({
    queryKey: pokemonKeys.evolution(normalizedChainId),
    queryFn: () => fetchNormalizedEvolutionChain(normalizedChainId),
    enabled: normalizedChainId > 0,
  });

  return {
    chain: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
