"use client";

import { useCallback, useEffect, useRef } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { PokemonCard } from "./PokemonCard";
import { PokemonCardSkeleton } from "./PokemonCardSkeleton";
import { Button } from "@/components/ui/Button";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { PokemonListItem } from "@/types/models";

interface PokemonGridProps {
  pokemon: PokemonListItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void | Promise<unknown>;
  onRetry?: () => void;
}

const SKELETON_COUNT = 24;

export function PokemonGrid({
  pokemon,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onRetry,
}: PokemonGridProps) {
  const t = useTranslations("pokemon.grid");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchLockRef = useRef(false);
  const { isIntersecting } = useIntersectionObserver(sentinelRef, {
    rootMargin: "300px 0px",
    enabled: hasNextPage,
  });

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || fetchLockRef.current) return;

    fetchLockRef.current = true;
    Promise.resolve(fetchNextPage()).finally(() => {
      fetchLockRef.current = false;
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isIntersecting) return;
    loadMore();
  }, [isIntersecting, pokemon.length, loadMore]); // keep trying while sentinel is in view

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        aria-busy="true"
        aria-label="Loading Pokémon"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError && pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <AlertCircle size={40} className="text-text-muted" aria-hidden="true" />
        <div>
          <p className="text-text-primary text-lg font-semibold">{t("error")}</p>
          <p className="text-text-secondary mt-1 text-sm">{error?.message ?? t("errorMessage")}</p>
        </div>
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            <RefreshCw size={16} aria-hidden="true" />
            {t("retry")}
          </Button>
        )}
      </div>
    );
  }

  if (!isLoading && pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <span className="text-5xl" aria-hidden="true">
          🔍
        </span>
        <p className="text-text-primary text-lg font-semibold">{t("empty")}</p>
        <p className="text-text-secondary text-sm">{t("emptyHint")}</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        role="list"
        aria-label="Pokémon list"
      >
        {pokemon.map((p) => (
          <div key={p.id} role="listitem">
            <PokemonCard pokemon={p} />
          </div>
        ))}
      </div>

      {/* Fetch-next-page skeletons */}
      {isFetchingNextPage && (
        <div
          className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          aria-busy="true"
          aria-label="Loading more Pokémon"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* IntersectionObserver sentinel */}
      <div ref={sentinelRef} className="mt-4 h-10" aria-hidden="true" />
    </div>
  );
}
