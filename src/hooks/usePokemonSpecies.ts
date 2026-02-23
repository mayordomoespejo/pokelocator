"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { pokemonKeys } from "@/lib/api/queryKeys";
import { fetchNormalizedSpecies } from "@/lib/api/pokemon";
import type { PokemonSpecies } from "@/types/models";

export function usePokemonSpecies(id: number): {
  species: PokemonSpecies | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const locale = useLocale();

  const query = useQuery({
    queryKey: pokemonKeys.species(id, locale),
    queryFn: () => fetchNormalizedSpecies(id, locale),
    enabled: id > 0,
  });

  return {
    species: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
