"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TypeBadge } from "@/components/ui/Badge";
import { FavoritesButton } from "@/features/favorites/FavoritesButton";
import { formatDexNumber, capitalize, formatHeight, formatWeight } from "@/lib/utils/formatters";
import { pokemonToFavoriteItem } from "@/lib/utils/mappers";
import type { PokemonDetail } from "@/types/models";
import type { PokemonSpecies } from "@/types/models";

interface PokemonDetailHeroProps {
  pokemon: PokemonDetail;
  species?: PokemonSpecies;
  compact?: boolean;
}

export function PokemonDetailHero({ pokemon, species, compact = false }: PokemonDetailHeroProps) {
  const t = useTranslations("pokemon.detail.hero");
  const { id, name, types, sprites, height, weight } = pokemon;

  const favoriteItem = pokemonToFavoriteItem(pokemon);

  return (
    <div
      className={`flex flex-col items-center gap-4 ${compact ? "" : "sm:flex-row sm:items-start sm:gap-8"}`}
    >
      {/* Sprite */}
      <motion.div
        className={`relative shrink-0 ${compact ? "h-32 w-32" : "h-48 w-48 sm:h-64 sm:w-64"}`}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={sprites.officialArtwork}
          alt={capitalize(name)}
          fill
          sizes={compact ? "128px" : "(max-width: 640px) 192px, 256px"}
          priority
          className="object-contain drop-shadow-xl"
        />
      </motion.div>

      {/* Info */}
      <div
        className={`flex flex-col ${compact ? "items-center text-center" : "items-center text-center sm:items-start sm:text-left"} gap-3`}
      >
        <span className="text-text-muted text-sm font-medium">{formatDexNumber(id)}</span>

        <h1
          className={`text-text-primary font-bold capitalize ${compact ? "text-2xl" : "text-4xl sm:text-5xl"}`}
        >
          {name}
        </h1>

        {species?.genus && <p className="text-text-secondary text-sm italic">{species.genus}</p>}

        {/* Type badges */}
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <TypeBadge key={type.slot} type={type.name} size="md" />
          ))}
        </div>

        {/* Measurements */}
        {!compact && (
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-text-muted text-xs font-medium tracking-wide uppercase">
                {t("height")}
              </p>
              <p className="text-text-primary mt-0.5 font-semibold">{formatHeight(height)}</p>
            </div>
            <div className="text-center">
              <p className="text-text-muted text-xs font-medium tracking-wide uppercase">
                {t("weight")}
              </p>
              <p className="text-text-primary mt-0.5 font-semibold">{formatWeight(weight)}</p>
            </div>
            {pokemon.baseExperience !== null && (
              <div className="text-center">
                <p className="text-text-muted text-xs font-medium tracking-wide uppercase">
                  {t("baseXp")}
                </p>
                <p className="text-text-primary mt-0.5 font-semibold">{pokemon.baseExperience}</p>
              </div>
            )}
          </div>
        )}

        {/* Favorite button */}
        {!compact && <FavoritesButton item={favoriteItem} showLabel />}
      </div>
    </div>
  );
}
