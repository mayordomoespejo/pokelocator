"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TypeBadge } from "@/components/ui/Badge";
import { FavoritesButton } from "@/features/favorites/FavoritesButton";
import { formatDexNumber, capitalize } from "@/lib/utils/formatters";
import type { PokemonListItem } from "@/types/models";

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const tCard = useTranslations("pokemon.card");
  const tTypes = useTranslations("pokemon.types");
  const { id, name, types, sprites } = pokemon;
  const localizedTypes = types.map((type) =>
    tTypes.has(type.name) ? tTypes(type.name) : capitalize(type.name)
  );

  const favoriteItem = {
    id,
    name,
    types,
    sprite: sprites.officialArtwork,
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group border-border bg-bg-card relative flex flex-col items-center rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md"
      aria-label={`${capitalize(name)}, ${localizedTypes.join(" / ")}`}
    >
      {/* Favorite button */}
      <div className="absolute top-2 right-2">
        <FavoritesButton item={favoriteItem} size="sm" />
      </div>

      <Link
        href={`/pokemon/${id}`}
        className="flex w-full flex-col items-center"
        aria-label={tCard("viewDetails", { name: capitalize(name) })}
        tabIndex={0}
      >
        {/* Dex number */}
        <span className="text-text-muted mb-1 text-xs font-medium">{formatDexNumber(id)}</span>

        {/* Sprite */}
        <div className="relative mb-3 h-24 w-24">
          <Image
            src={sprites.officialArtwork}
            alt={capitalize(name)}
            fill
            sizes="96px"
            className="object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Name */}
        <h3 className="text-text-primary mb-2 text-sm font-semibold capitalize">{name}</h3>

        {/* Type badges */}
        <div className="flex flex-wrap justify-center gap-1">
          {types.map((type) => (
            <TypeBadge key={type.slot} type={type.name} size="sm" />
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
