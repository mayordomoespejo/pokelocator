"use client";

import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils/cn";
import { capitalize } from "@/lib/utils/formatters";
import type { FavoriteItem } from "@/types/models";

interface FavoritesButtonProps {
  item: FavoriteItem;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function FavoritesButton({ item, size = "md", showLabel = false }: FavoritesButtonProps) {
  const t = useTranslations("pokemon.favorites");
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const active = hydrated && isFavorite(item.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  }

  const label = active
    ? t("remove", { name: capitalize(item.name) })
    : t("add", { name: capitalize(item.name) });

  if (showLabel) {
    return (
      <button
        onClick={handleClick}
        aria-label={label}
        aria-pressed={active}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
          active
            ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900"
            : "border-border bg-bg-card text-text-secondary hover:bg-bg-muted hover:text-text-primary"
        )}
      >
        <Heart
          size={16}
          aria-hidden="true"
          className={cn("transition-all", active && "fill-red-500 text-red-500")}
        />
        {active ? t("saved") : t("save")}
      </button>
    );
  }

  return (
    <Button
      variant="icon"
      size={size === "sm" ? "sm" : "md"}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={active}
      className="relative"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active ? "filled" : "empty"}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            size={size === "sm" ? 14 : 18}
            aria-hidden="true"
            className={cn(
              "transition-colors",
              active ? "fill-red-500 text-red-500" : "text-text-muted"
            )}
          />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
