"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PokemonGrid } from "@/components/pokemon/PokemonGrid";
import { PokemonTypeFilter } from "@/components/pokemon/PokemonTypeFilter";
import { PokemonSearchBar } from "@/components/pokemon/PokemonSearchBar";
import { usePokemonList } from "@/hooks/usePokemonList";

export default function HomePage() {
  const t = useTranslations("pages.home");
  const tPokemon = useTranslations("pokemon.grid");
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const { pokemon, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    usePokemonList({ typeFilter });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto max-w-7xl px-4 py-6 sm:px-6"
    >
      {/* Hero search */}
      <section className="mb-8 text-center" aria-label={t("searchSectionLabel")}>
        <h1 className="text-text-primary mb-2 text-3xl font-bold sm:text-4xl">{t("title")}</h1>
        <p className="text-text-secondary mb-6">{t("subtitle")}</p>
        <PokemonSearchBar className="mx-auto max-w-lg" />
      </section>

      {/* Type filter */}
      <section aria-label={t("typeFilterSectionLabel")} className="mb-6">
        <PokemonTypeFilter activeType={typeFilter} onTypeChange={setTypeFilter} />
      </section>

      {/* Results info */}
      {!isLoading && pokemon.length > 0 && (
        <p className="text-text-muted mb-4 text-sm" aria-live="polite">
          {typeFilter
            ? tPokemon("showingType", { count: pokemon.length, type: typeFilter })
            : tPokemon("showing", { count: pokemon.length })}
        </p>
      )}

      {/* Pokemon grid */}
      <PokemonGrid
        pokemon={pokemon}
        isLoading={isLoading}
        isError={isError}
        error={error}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </motion.div>
  );
}
