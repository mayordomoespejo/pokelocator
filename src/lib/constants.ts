export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const POKEMON_PAGE_SIZE = 24;
export const API_BATCH_CONCURRENCY = 8;

// Pokémon type colors — bg + text for badge rendering
export const TYPE_COLORS: Record<string, { bg: string; text: string; hex: string }> = {
  normal: { bg: "bg-stone-400", text: "text-stone-900", hex: "#A8A878" },
  fire: { bg: "bg-orange-500", text: "text-white", hex: "#F08030" },
  water: { bg: "bg-blue-500", text: "text-white", hex: "#6890F0" },
  electric: { bg: "bg-yellow-400", text: "text-yellow-900", hex: "#F8D030" },
  grass: { bg: "bg-green-500", text: "text-white", hex: "#78C850" },
  ice: { bg: "bg-cyan-400", text: "text-cyan-900", hex: "#98D8D8" },
  fighting: { bg: "bg-red-700", text: "text-white", hex: "#C03028" },
  poison: { bg: "bg-purple-500", text: "text-white", hex: "#A040A0" },
  ground: { bg: "bg-amber-600", text: "text-white", hex: "#E0C068" },
  flying: { bg: "bg-indigo-400", text: "text-white", hex: "#A890F0" },
  psychic: { bg: "bg-pink-500", text: "text-white", hex: "#F85888" },
  bug: { bg: "bg-lime-600", text: "text-white", hex: "#A8B820" },
  rock: { bg: "bg-yellow-700", text: "text-white", hex: "#B8A038" },
  ghost: { bg: "bg-purple-800", text: "text-white", hex: "#705898" },
  dragon: { bg: "bg-violet-700", text: "text-white", hex: "#7038F8" },
  dark: { bg: "bg-gray-800", text: "text-white", hex: "#705848" },
  steel: { bg: "bg-slate-500", text: "text-white", hex: "#B8B8D0" },
  fairy: { bg: "bg-pink-300", text: "text-pink-900", hex: "#EE99AC" },
};

export const STAT_DISPLAY_NAMES: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

// Max base stat value for bar percentage calculation
export const MAX_BASE_STAT = 255;

// Number of pokemon suggestions shown in search dropdown
export const MAX_SEARCH_SUGGESTIONS = 8;

// Debounce delay for search input (ms)
export const SEARCH_DEBOUNCE_MS = 300;

// Pokemon types to exclude from filter (non-standard)
export const EXCLUDED_TYPES = new Set(["unknown", "shadow"]);
