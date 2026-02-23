// Single source of truth for all TanStack Query keys
// Leaf values are readonly arrays; use factories for parameterized keys

export const pokemonKeys = {
  all: ["pokemon"] as const,

  lists: () => [...pokemonKeys.all, "list"] as const,
  list: (filters: { typeFilter?: string }) => [...pokemonKeys.lists(), filters] as const,

  details: () => [...pokemonKeys.all, "detail"] as const,
  detail: (id: number) => [...pokemonKeys.details(), id] as const,

  species: (id: number, locale: string) => [...pokemonKeys.all, "species", id, locale] as const,

  evolutions: () => [...pokemonKeys.all, "evolution"] as const,
  evolution: (chainId: number) => [...pokemonKeys.evolutions(), chainId] as const,

  allNames: () => [...pokemonKeys.all, "allNames"] as const,
} as const;

export const typeKeys = {
  all: ["types"] as const,
  list: () => [...typeKeys.all, "list"] as const,
} as const;
