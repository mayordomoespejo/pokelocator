"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Button } from "@/components/ui/Button";
import { useFavorites } from "@/hooks/useFavorites";
import { favoriteToPokemonListItem } from "@/lib/utils/mappers";
import type { PokemonListItem } from "@/types/models";

export default function FavoritesPage() {
  const t = useTranslations("pages.favorites");
  const { favorites, hydrated } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Intentional: avoid SSR/client hydration mismatch for localStorage-based state
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Map FavoriteItem to PokemonListItem shape for PokemonCard
  const pokemonItems: PokemonListItem[] = favorites.map(favoriteToPokemonListItem);

  const isReady = mounted && hydrated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto max-w-7xl px-4 py-6 sm:px-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <Heart size={24} className="text-brand" aria-hidden="true" />
        <h1 className="text-text-primary text-2xl font-bold">{t("title")}</h1>
        {isReady && favorites.length > 0 && (
          <span className="bg-brand-light text-brand rounded-full px-2.5 py-0.5 text-sm font-semibold">
            {favorites.length}
          </span>
        )}
      </div>

      {!isReady ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-bg-muted h-40 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : pokemonItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <span className="text-6xl" aria-hidden="true">
            💔
          </span>
          <div>
            <p className="text-text-primary text-lg font-semibold">{t("empty")}</p>
            <p className="text-text-secondary mt-1 text-sm">{t("emptyHint")}</p>
          </div>
          <Link href="/">
            <Button variant="primary">{t("browse")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {pokemonItems.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
