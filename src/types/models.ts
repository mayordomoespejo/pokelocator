// Internal normalized models — UI-ready, decoupled from PokéAPI response shape

export type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export interface PokemonType {
  name: PokemonTypeName;
  slot: number;
}

export interface PokemonStat {
  name: string;
  displayName: string;
  baseStat: number;
  effort: number;
}

export interface PokemonAbility {
  name: string;
  displayName: string;
  isHidden: boolean;
}

export interface PokemonMove {
  name: string;
  displayName: string;
  learnMethod: string;
  levelLearnedAt: number;
}

export interface PokemonSprites {
  officialArtwork: string;
  frontDefault: string;
  frontShiny: string | null;
}

// Card-level model — used in list, search results, favorites
export interface PokemonListItem {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: PokemonSprites;
  url: string;
}

// Full detail model
export interface PokemonDetail extends PokemonListItem {
  height: number; // in decimetres
  weight: number; // in hectograms
  baseExperience: number | null;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  speciesUrl: string;
}

// Species model
export interface PokemonSpecies {
  id: number;
  name: string;
  flavorText: string;
  genus: string;
  isLegendary: boolean;
  isMythical: boolean;
  isBaby: boolean;
  captureRate: number;
  baseHappiness: number | null;
  growthRate: string;
  habitat: string | null;
  generation: string;
  eggGroups: string[];
  evolutionChainId: number;
}

// Evolution tree node
export interface EvolutionNode {
  speciesName: string;
  speciesId: number;
  minLevel: number | null;
  triggerName: string;
  item: string | null;
  evolvesTo: EvolutionNode[];
}

// Favorites store item — minimal to keep localStorage lean
export interface FavoriteItem {
  id: number;
  name: string;
  types: PokemonType[];
  sprite: string;
}

// Compare store
export interface CompareSlot {
  id: number | null;
  name: string | null;
}

// Pagination meta
export interface PaginationMeta {
  total: number;
  nextOffset: number | null;
}
