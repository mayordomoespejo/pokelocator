// Raw PokéAPI response shapes — never used directly in UI, only in API layer

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface APIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

// ── Pokemon endpoint (/api/v2/pokemon/{id}) ──────────────────────────────────

export interface APIStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface APIType {
  slot: number;
  type: NamedAPIResource;
}

export interface APIAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface APIMove {
  move: NamedAPIResource;
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: NamedAPIResource;
    version_group: NamedAPIResource;
  }>;
}

export interface APISpriteOther {
  "official-artwork": {
    front_default: string | null;
    front_shiny: string | null;
  };
  home: {
    front_default: string | null;
    front_shiny: string | null;
  };
}

export interface APISpriteSet {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other: APISpriteOther;
}

export interface APIPokemon {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  abilities: APIAbility[];
  moves: APIMove[];
  species: NamedAPIResource;
  sprites: APISpriteSet;
  stats: APIStat[];
  types: APIType[];
}

// ── Species endpoint (/api/v2/pokemon-species/{id}) ─────────────────────────

export interface APIFlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface APIGenus {
  genus: string;
  language: NamedAPIResource;
}

export interface APIPokemonSpecies {
  id: number;
  name: string;
  base_happiness: number | null;
  capture_rate: number;
  color: NamedAPIResource;
  flavor_text_entries: APIFlavorTextEntry[];
  gender_rate: number;
  genera: APIGenus[];
  generation: NamedAPIResource;
  growth_rate: NamedAPIResource;
  habitat: NamedAPIResource | null;
  has_gender_differences: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  evolution_chain: { url: string };
  egg_groups: NamedAPIResource[];
}

// ── Evolution chain endpoint (/api/v2/evolution-chain/{id}) ─────────────────

export interface APIEvolutionDetail {
  min_level: number | null;
  trigger: NamedAPIResource;
  item: NamedAPIResource | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  held_item: NamedAPIResource | null;
  known_move: NamedAPIResource | null;
  known_move_type: NamedAPIResource | null;
  location: NamedAPIResource | null;
  needs_overworld_rain: boolean;
  party_species: NamedAPIResource | null;
  party_type: NamedAPIResource | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: NamedAPIResource | null;
  turn_upside_down: boolean;
}

export interface APIChainLink {
  is_baby: boolean;
  species: NamedAPIResource;
  evolution_details: APIEvolutionDetail[];
  evolves_to: APIChainLink[];
}

export interface APIEvolutionChain {
  id: number;
  chain: APIChainLink;
}

// ── Type endpoint (/api/v2/type) ─────────────────────────────────────────────

export interface APITypeRelations {
  double_damage_from: NamedAPIResource[];
  double_damage_to: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  half_damage_to: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
  no_damage_to: NamedAPIResource[];
}

export interface APITypeDetail {
  id: number;
  name: string;
  damage_relations: APITypeRelations;
  pokemon: Array<{ pokemon: NamedAPIResource; slot: number }>;
}
