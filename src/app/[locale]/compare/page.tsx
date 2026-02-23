"use client";

import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import { useTranslations } from "next-intl";
import { PokemonDetailHero } from "@/components/pokemon/PokemonDetailHero";
import { CompareSelector } from "@/components/pokemon/CompareSelector";
import { CompareTable } from "@/components/pokemon/CompareTable";
import { Skeleton } from "@/components/ui/Skeleton";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { useCompareStore } from "@/lib/store/compareStore";
import type { PokemonDetail } from "@/types/models";

function PokemonComparePanel({
  pokemon,
  isLoading,
}: {
  pokemon?: PokemonDetail;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-40 w-40 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  if (!pokemon) return null;

  return <PokemonDetailHero pokemon={pokemon} compact />;
}

export default function ComparePage() {
  const t = useTranslations("pages.compare");
  const tPokemon = useTranslations("pokemon.compare");
  const { slotA, slotB, setSlot, clearSlot } = useCompareStore();

  const { pokemon: pokemonA, isLoading: isLoadingA } = usePokemonDetail(slotA.id ?? 0);
  const { pokemon: pokemonB, isLoading: isLoadingB } = usePokemonDetail(slotB.id ?? 0);

  const canCompare = !!pokemonA && !!pokemonB;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto max-w-4xl px-4 py-6 sm:px-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <Swords size={24} className="text-brand" aria-hidden="true" />
        <h1 className="text-text-primary text-2xl font-bold">{t("title")}</h1>
      </div>

      {/* Selectors */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <CompareSelector
          label={tPokemon("slotA")}
          slot={slotA}
          onSelect={(p) => setSlot("A", p)}
          onClear={() => clearSlot("A")}
        />
        <CompareSelector
          label={tPokemon("slotB")}
          slot={slotB}
          onSelect={(p) => setSlot("B", p)}
          onClear={() => clearSlot("B")}
        />
      </div>

      {/* Pokemon previews */}
      {(slotA.id || slotB.id) && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border-border bg-bg-card rounded-2xl border p-4">
            {slotA.id ? (
              <PokemonComparePanel pokemon={pokemonA} isLoading={isLoadingA} />
            ) : (
              <div className="text-text-muted flex h-32 items-center justify-center text-sm">
                {tPokemon("slotA")}
              </div>
            )}
          </div>
          <div className="border-border bg-bg-card rounded-2xl border p-4">
            {slotB.id ? (
              <PokemonComparePanel pokemon={pokemonB} isLoading={isLoadingB} />
            ) : (
              <div className="text-text-muted flex h-32 items-center justify-center text-sm">
                {tPokemon("slotB")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparison table */}
      {canCompare && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CompareTable pokemonA={pokemonA!} pokemonB={pokemonB!} />
        </motion.div>
      )}

      {!canCompare && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="text-5xl" aria-hidden="true">
            ⚔️
          </span>
          <p className="text-text-secondary">{t("emptyHint")}</p>
        </div>
      )}
    </motion.div>
  );
}
