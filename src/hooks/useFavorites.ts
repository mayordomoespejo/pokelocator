"use client";

import { useFavoritesStore } from "@/lib/store/favoritesStore";
import type { FavoriteItem } from "@/types/models";

/**
 * Thin selectors over the Zustand favorites store.
 * Prevents unnecessary re-renders by subscribing to only what's needed.
 */
export function useFavorites() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const hydrated = useFavoritesStore((state) => state.hydrated);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return {
    favorites,
    hydrated,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}

export type { FavoriteItem };
