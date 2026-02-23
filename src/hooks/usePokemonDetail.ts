"use client";

import { useQuery } from "@tanstack/react-query";
import { pokemonKeys } from "@/lib/api/queryKeys";
import { fetchPokemonDetailById } from "@/lib/api/pokemon";
import type { PokemonDetail } from "@/types/models";

export function usePokemonDetail(id: number): {
  pokemon: PokemonDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const query = useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => fetchPokemonDetailById(id),
    enabled: id > 0,
  });

  return {
    pokemon: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
