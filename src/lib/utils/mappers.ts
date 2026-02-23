import type { FavoriteItem, PokemonListItem } from "@/types/models";

type PokemonWithCardData = Pick<PokemonListItem, "id" | "name" | "types" | "sprites">;

export function pokemonToFavoriteItem(pokemon: PokemonWithCardData): FavoriteItem {
  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    sprite: pokemon.sprites.officialArtwork,
  };
}

export function favoriteToPokemonListItem(favorite: FavoriteItem): PokemonListItem {
  return {
    id: favorite.id,
    name: favorite.name,
    types: favorite.types,
    sprites: {
      officialArtwork: favorite.sprite,
      frontDefault: favorite.sprite,
      frontShiny: null,
    },
    url: `https://pokeapi.co/api/v2/pokemon/${favorite.id}/`,
  };
}
