import type { APIPokemon, APIPokemonSpecies, APIEvolutionChain, APIChainLink } from "@/types/api";
import type {
  PokemonListItem,
  PokemonDetail,
  PokemonSpecies,
  PokemonStat,
  PokemonAbility,
  PokemonMove,
  PokemonType,
  PokemonTypeName,
  EvolutionNode,
} from "@/types/models";
import { STAT_DISPLAY_NAMES } from "@/lib/constants";
import { cleanFlavorText, formatApiName } from "./formatters";

function getPreferredLanguage(locale: string): string {
  return locale.toLowerCase().split("-")[0] ?? "en";
}

function pickLocalizedEntry<T extends { language: { name: string } }>(
  entries: T[],
  locale: string
): T | undefined {
  const preferredLanguage = getPreferredLanguage(locale);
  return (
    entries.find((entry) => entry.language.name === preferredLanguage) ??
    entries.find((entry) => entry.language.name === "en") ??
    entries[0]
  );
}

// ── Sprite helpers ────────────────────────────────────────────────────────────

export function getOfficialArtwork(raw: APIPokemon): string {
  return (
    raw.sprites.other["official-artwork"].front_default ??
    raw.sprites.other.home.front_default ??
    raw.sprites.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raw.id}.png`
  );
}

export function getFrontDefault(raw: APIPokemon): string {
  return (
    raw.sprites.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raw.id}.png`
  );
}

// ── ID extraction from URLs ───────────────────────────────────────────────────

export function getIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts.at(-1) ?? "0");
}

export function getEvolutionChainIdFromUrl(url: string): number {
  return getIdFromUrl(url);
}

// ── Stats normalizer ─────────────────────────────────────────────────────────

function normalizeStat(raw: APIPokemon["stats"][number]): PokemonStat {
  const name = raw.stat.name;
  return {
    name,
    displayName: STAT_DISPLAY_NAMES[name] ?? formatApiName(name),
    baseStat: raw.base_stat,
    effort: raw.effort,
  };
}

// ── Abilities normalizer ──────────────────────────────────────────────────────

function normalizeAbility(raw: APIPokemon["abilities"][number]): PokemonAbility {
  return {
    name: raw.ability.name,
    displayName: formatApiName(raw.ability.name),
    isHidden: raw.is_hidden,
  };
}

// ── Moves normalizer ─────────────────────────────────────────────────────────

function normalizeMove(raw: APIPokemon["moves"][number]): PokemonMove {
  // Take the first version group detail for simplicity
  const detail = raw.version_group_details[0];
  return {
    name: raw.move.name,
    displayName: formatApiName(raw.move.name),
    learnMethod: detail?.move_learn_method.name ?? "unknown",
    levelLearnedAt: detail?.level_learned_at ?? 0,
  };
}

// ── Type normalizer ──────────────────────────────────────────────────────────

function normalizeType(raw: APIPokemon["types"][number]): PokemonType {
  return {
    name: raw.type.name as PokemonTypeName,
    slot: raw.slot,
  };
}

// ── Public normalizers ────────────────────────────────────────────────────────

export function normalizePokemonToListItem(raw: APIPokemon): PokemonListItem {
  return {
    id: raw.id,
    name: raw.name,
    types: raw.types.map(normalizeType),
    sprites: {
      officialArtwork: getOfficialArtwork(raw),
      frontDefault: getFrontDefault(raw),
      frontShiny: raw.sprites.front_shiny,
    },
    url: `https://pokeapi.co/api/v2/pokemon/${raw.id}/`,
  };
}

export function normalizePokemonToDetail(raw: APIPokemon): PokemonDetail {
  return {
    ...normalizePokemonToListItem(raw),
    height: raw.height,
    weight: raw.weight,
    baseExperience: raw.base_experience,
    stats: raw.stats.map(normalizeStat),
    abilities: raw.abilities.sort((a, b) => a.slot - b.slot).map(normalizeAbility),
    moves: raw.moves.map(normalizeMove),
    speciesUrl: raw.species.url,
  };
}

export function normalizeSpecies(raw: APIPokemonSpecies, locale = "en"): PokemonSpecies {
  const flavorEntry = pickLocalizedEntry(raw.flavor_text_entries, locale);
  const genusEntry = pickLocalizedEntry(raw.genera, locale);

  return {
    id: raw.id,
    name: raw.name,
    flavorText: flavorEntry ? cleanFlavorText(flavorEntry.flavor_text) : "",
    genus: genusEntry?.genus ?? "",
    isLegendary: raw.is_legendary,
    isMythical: raw.is_mythical,
    isBaby: raw.is_baby,
    captureRate: raw.capture_rate,
    baseHappiness: raw.base_happiness,
    growthRate: formatApiName(raw.growth_rate.name),
    habitat: raw.habitat ? formatApiName(raw.habitat.name) : null,
    generation: formatApiName(raw.generation.name.replace("generation-", "Gen ")),
    eggGroups: raw.egg_groups.map((g) => formatApiName(g.name)),
    evolutionChainId: getEvolutionChainIdFromUrl(raw.evolution_chain.url),
  };
}

// ── Evolution chain normalizer ────────────────────────────────────────────────

function normalizeChainLink(link: APIChainLink, isRoot = false): EvolutionNode {
  const detail = link.evolution_details[0]; // first detail for this stage

  return {
    speciesName: link.species.name,
    speciesId: getIdFromUrl(link.species.url),
    minLevel: isRoot ? null : (detail?.min_level ?? null),
    triggerName: isRoot ? "" : (detail?.trigger.name ?? ""),
    item: isRoot ? null : (detail?.item?.name ?? detail?.held_item?.name ?? null),
    evolvesTo: link.evolves_to.map((child) => normalizeChainLink(child)),
  };
}

export function normalizeEvolutionChain(raw: APIEvolutionChain): EvolutionNode {
  return normalizeChainLink(raw.chain, true);
}
