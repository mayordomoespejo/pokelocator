import type {
  APIResourceList,
  APIPokemon,
  APIPokemonSpecies,
  APIEvolutionChain,
  APITypeDetail,
} from "@/types/api";
import type {
  PokemonListItem,
  PokemonDetail,
  PokemonSpecies,
  EvolutionNode,
  PaginationMeta,
} from "@/types/models";
import { apiFetch, buildUrl } from "./client";
import { POKEMON_PAGE_SIZE } from "@/lib/constants";
import {
  normalizePokemonToListItem,
  normalizePokemonToDetail,
  normalizeSpecies,
  normalizeEvolutionChain,
} from "@/lib/utils/pokemon";

// ── Raw API fetches ───────────────────────────────────────────────────────────

export async function fetchPokemonListPage(
  offset: number,
  limit = POKEMON_PAGE_SIZE
): Promise<APIResourceList> {
  return apiFetch<APIResourceList>(buildUrl(`/pokemon?limit=${limit}&offset=${offset}`));
}

export async function fetchPokemonByIdOrName(idOrName: string | number): Promise<APIPokemon> {
  return apiFetch<APIPokemon>(buildUrl(`/pokemon/${idOrName}`));
}

export async function fetchPokemonSpeciesRaw(
  idOrName: string | number
): Promise<APIPokemonSpecies> {
  return apiFetch<APIPokemonSpecies>(buildUrl(`/pokemon-species/${idOrName}`));
}

export async function fetchEvolutionChainRaw(id: number): Promise<APIEvolutionChain> {
  return apiFetch<APIEvolutionChain>(buildUrl(`/evolution-chain/${id}`));
}

export async function fetchAllTypesRaw(): Promise<APIResourceList> {
  return apiFetch<APIResourceList>(buildUrl("/type?limit=100"));
}

export async function fetchTypeDetailRaw(name: string): Promise<APITypeDetail> {
  return apiFetch<APITypeDetail>(buildUrl(`/type/${name}`));
}

export async function fetchAllPokemonNames(): Promise<APIResourceList> {
  // Fetch all pokemon names for client-side search (~1300 entries, ~50KB)
  return apiFetch<APIResourceList>(buildUrl("/pokemon?limit=10000&offset=0"));
}

// ── Normalized fetches ────────────────────────────────────────────────────────

/**
 * Fetch one page of the pokemon list, then batch-fetch details for sprites/types.
 * Promise.all with 24 concurrent requests (one per card on a page).
 */
export async function fetchPokemonListWithDetails(
  offset: number,
  limit = POKEMON_PAGE_SIZE
): Promise<{ items: PokemonListItem[]; meta: PaginationMeta }> {
  const listPage = await fetchPokemonListPage(offset, limit);

  // Batch-fetch all details in parallel — errors on individual pokemon are swallowed
  const detailResults = await Promise.allSettled(
    listPage.results.map((r) => apiFetch<APIPokemon>(r.url))
  );

  const items = detailResults
    .filter((r): r is PromiseFulfilledResult<APIPokemon> => r.status === "fulfilled")
    .map((r) => normalizePokemonToListItem(r.value));

  return {
    items,
    meta: {
      total: listPage.count,
      nextOffset: listPage.next ? offset + limit : null,
    },
  };
}

/**
 * Fetch all pokemon of a given type, then batch-fetch details.
 * Used when type filter is active (PokéAPI doesn't support paginated type filtering).
 */
export async function fetchPokemonByType(typeName: string): Promise<{ items: PokemonListItem[] }> {
  const typeDetail = await fetchTypeDetailRaw(typeName);

  // Limit to first 100 for performance — most types have 50–100 pokemon
  const toFetch = typeDetail.pokemon.slice(0, 100);

  const detailResults = await Promise.allSettled(
    toFetch.map((entry) => apiFetch<APIPokemon>(entry.pokemon.url))
  );

  const items = detailResults
    .filter((r): r is PromiseFulfilledResult<APIPokemon> => r.status === "fulfilled")
    .map((r) => normalizePokemonToListItem(r.value));

  return { items };
}

export async function fetchPokemonDetailById(id: number): Promise<PokemonDetail> {
  const raw = await fetchPokemonByIdOrName(id);
  return normalizePokemonToDetail(raw);
}

export async function fetchNormalizedSpecies(
  idOrName: string | number,
  locale = "en"
): Promise<PokemonSpecies> {
  const raw = await fetchPokemonSpeciesRaw(idOrName);
  return normalizeSpecies(raw, locale);
}

export async function fetchNormalizedEvolutionChain(chainId: number): Promise<EvolutionNode> {
  const raw = await fetchEvolutionChainRaw(chainId);
  return normalizeEvolutionChain(raw);
}
