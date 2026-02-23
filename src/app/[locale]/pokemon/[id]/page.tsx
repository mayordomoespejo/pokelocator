"use client";

import { use, useEffect } from "react";
import { motion } from "framer-motion";
import { capitalize } from "@/lib/utils/formatters";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PokemonDetailHero } from "@/components/pokemon/PokemonDetailHero";
import { PokemonStats } from "@/components/pokemon/PokemonStats";
import { PokemonMoves } from "@/components/pokemon/PokemonMoves";
import { PokemonEvolutionChain } from "@/components/pokemon/PokemonEvolutionChain";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { usePokemonSpecies } from "@/hooks/usePokemonSpecies";
import { useEvolutionChain } from "@/hooks/useEvolutionChain";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PokemonDetailPage({ params }: DetailPageProps) {
  const { id: idParam } = use(params);
  const t = useTranslations("pages.detail");
  const pokemonId = Number(idParam);

  const { pokemon, isLoading, isError, error } = usePokemonDetail(isNaN(pokemonId) ? 0 : pokemonId);
  const { species, isLoading: speciesLoading } = usePokemonSpecies(pokemon?.id ?? 0);
  const { chain, isLoading: chainLoading } = useEvolutionChain(species?.evolutionChainId);

  // Set document title when pokemon is loaded (for SEO and browser tab)
  useEffect(() => {
    if (pokemon) {
      document.title = `${capitalize(pokemon.name)} | PokéLocator`;
    }
  }, [pokemon]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !pokemon) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle size={40} className="text-text-muted" />
        <div>
          <p className="text-text-primary text-lg font-semibold">{t("notFound")}</p>
          <p className="text-text-secondary mt-1 text-sm">
            {error?.message ?? t("notFoundMessage", { id: idParam })}
          </p>
        </div>
        <Link href="/">
          <Button variant="primary">
            <ChevronLeft size={16} />
            {t("back")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto max-w-4xl px-4 py-6 sm:px-6"
    >
      {/* Back link */}
      <Link
        href="/"
        className="text-text-secondary hover:text-text-primary mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        {t("back")}
      </Link>

      {/* Hero */}
      <div className="border-border bg-bg-card mb-8 rounded-2xl border p-6 sm:p-8">
        <PokemonDetailHero pokemon={pokemon} species={species ?? undefined} />

        {/* Species flavor text */}
        {speciesLoading ? (
          <div className="mt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ) : species?.flavorText ? (
          <p className="border-border text-text-secondary mt-6 border-t pt-4 text-sm leading-relaxed italic">
            {species.flavorText}
          </p>
        ) : null}
      </div>

      {/* Content grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Stats */}
        <div className="border-border bg-bg-card rounded-2xl border p-6">
          <PokemonStats stats={pokemon.stats} />
        </div>

        {/* About */}
        <div className="border-border bg-bg-card rounded-2xl border p-6">
          <section aria-label={t("about")}>
            <h2 className="text-text-primary mb-4 text-lg font-bold">{t("about")}</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                {
                  label: t("height"),
                  value: pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : "—",
                },
                {
                  label: t("weight"),
                  value: pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : "—",
                },
                ...(species
                  ? [
                      { label: t("generation"), value: species.generation },
                      { label: t("growthRate"), value: species.growthRate },
                      { label: t("captureRate"), value: String(species.captureRate) },
                      { label: t("habitat"), value: species.habitat ?? "—" },
                      { label: t("eggGroups"), value: species.eggGroups.join(", ") || "—" },
                    ]
                  : []),
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-text-muted text-xs font-medium tracking-wide uppercase">
                    {label}
                  </dt>
                  <dd className="text-text-primary mt-0.5 font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Abilities */}
            <div className="mt-4">
              <p className="text-text-muted mb-2 text-xs font-medium tracking-wide uppercase">
                {t("abilities")}
              </p>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <span
                    key={ability.name}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${
                      ability.isHidden
                        ? "border-border bg-bg-muted text-text-muted"
                        : "border-border bg-bg-secondary text-text-secondary"
                    }`}
                  >
                    {ability.displayName}
                    {ability.isHidden && <span className="ml-1 opacity-60">({t("hidden")})</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Legendary / Mythical badges */}
            {species && (species.isLegendary || species.isMythical || species.isBaby) && (
              <div className="mt-4 flex gap-2">
                {species.isLegendary && (
                  <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {t("legendary")}
                  </span>
                )}
                {species.isMythical && (
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {t("mythical")}
                  </span>
                )}
                {species.isBaby && (
                  <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                    {t("baby")}
                  </span>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Evolution chain */}
      <div className="border-border bg-bg-card mt-6 rounded-2xl border p-6">
        <PokemonEvolutionChain
          chain={chain}
          isLoading={chainLoading || speciesLoading}
          currentId={pokemon.id}
        />
      </div>

      {/* Moves */}
      <div className="border-border bg-bg-card mt-6 rounded-2xl border p-6">
        <PokemonMoves moves={pokemon.moves} />
      </div>

      {/* Navigation to prev/next */}
      <div className="mt-6 flex justify-between gap-4">
        {pokemon.id > 1 && (
          <Link href={`/pokemon/${pokemon.id - 1}`} className="flex-1">
            <Button variant="secondary" className="w-full gap-2">
              <ChevronLeft size={16} />#{String(pokemon.id - 1).padStart(3, "0")}
            </Button>
          </Link>
        )}
        <Link href={`/pokemon/${pokemon.id + 1}`} className="ml-auto flex-1">
          <Button variant="secondary" className="w-full gap-2">
            #{String(pokemon.id + 1).padStart(3, "0")}
            <ChevronLeft size={16} className="rotate-180" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Skeleton className="mb-6 h-5 w-32" />
      <div className="border-border bg-bg-card mb-8 rounded-2xl border p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
          <Skeleton className="h-48 w-48 rounded-full sm:h-64 sm:w-64" />
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
