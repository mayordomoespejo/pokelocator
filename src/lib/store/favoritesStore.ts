"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FavoriteItem } from "@/types/models";

interface FavoritesState {
  favorites: FavoriteItem[];
  hydrated: boolean;
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  setHydrated: (value: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      addFavorite: (item) => set((state) => ({ favorites: [...state.favorites, item] })),
      removeFavorite: (id) =>
        set((state) => ({ favorites: state.favorites.filter((f) => f.id !== id) })),
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
      toggleFavorite: (item) => {
        if (get().isFavorite(item.id)) {
          get().removeFavorite(item.id);
        } else {
          get().addFavorite(item);
        }
      },
    }),
    {
      name: "pokelocator-favorites",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
