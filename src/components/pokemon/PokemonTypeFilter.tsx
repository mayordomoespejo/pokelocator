"use client";

import { useTranslations } from "next-intl";
import { usePokemonTypes } from "@/hooks/usePokemonTypes";
import { TYPE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { capitalize } from "@/lib/utils/formatters";
import { Skeleton } from "@/components/ui/Skeleton";

interface PokemonTypeFilterProps {
  activeType: string | undefined;
  onTypeChange: (type: string | undefined) => void;
}

export function PokemonTypeFilter({ activeType, onTypeChange }: PokemonTypeFilterProps) {
  const t = useTranslations("pokemon.filter");
  const tTypes = useTranslations("pokemon.types");
  const { types, isLoading } = usePokemonTypes();

  if (isLoading) {
    return (
      <div
        className="type-filter-scroll flex gap-2 overflow-x-auto pb-2"
        aria-label={t("loading")}
        aria-busy="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-16 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="type-filter-scroll flex gap-2 overflow-x-auto pb-2"
    >
      {/* "All" chip */}
      <button
        onClick={() => onTypeChange(undefined)}
        aria-pressed={!activeType}
        className={cn(
          "type-filter-chip shrink-0 cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
          !activeType
            ? "bg-text-primary text-bg-primary border-transparent shadow-sm"
            : "border-border bg-bg-card text-text-secondary hover:bg-bg-muted border"
        )}
      >
        {t("all")}
      </button>

      {types.map((type) => {
        const colors = TYPE_COLORS[type];
        const isActive = activeType === type;
        return (
          <button
            key={type}
            onClick={() => onTypeChange(isActive ? undefined : type)}
            aria-pressed={isActive}
            className={cn(
              "type-filter-chip shrink-0 cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              isActive
                ? cn(colors?.bg, colors?.text, "border-transparent shadow-sm")
                : "border-border bg-bg-card text-text-secondary hover:bg-bg-muted"
            )}
          >
            {tTypes.has(type) ? tTypes(type) : capitalize(type)}
          </button>
        );
      })}
    </div>
  );
}
