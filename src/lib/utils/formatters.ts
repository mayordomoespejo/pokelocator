/**
 * Format height from decimetres to meters string
 * e.g. 7 → "0.7 m"
 */
export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`;
}

/**
 * Format weight from hectograms to kilograms string
 * e.g. 69 → "6.9 kg"
 */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

/**
 * Zero-pad a Pokémon dex number
 * e.g. 25 → "#025"
 */
export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a hyphenated API name to a display name
 * e.g. "special-attack" → "Special Attack"
 */
export function formatApiName(name: string): string {
  return name.split("-").map(capitalize).join(" ");
}

/**
 * Clean flavor text — remove special newline/form feed characters from PokéAPI
 */
export function cleanFlavorText(text: string): string {
  return text
    .replace(/[\n\f\r]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
