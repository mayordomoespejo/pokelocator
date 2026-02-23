"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { TYPE_COLORS } from "@/lib/constants";
import { capitalize } from "@/lib/utils/formatters";
import type { PokemonTypeName } from "@/types/models";

interface TypeBadgeProps {
  type: PokemonTypeName | string;
  size?: "sm" | "md";
  className?: string;
}

export function TypeBadge({ type, size = "md", className }: TypeBadgeProps) {
  const tTypes = useTranslations("pokemon.types");
  const colors = TYPE_COLORS[type] ?? { bg: "bg-gray-400", text: "text-white" };
  const typeKey = String(type);
  const label = tTypes.has(typeKey) ? tTypes(typeKey) : capitalize(typeKey);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs",
        colors.bg,
        colors.text,
        className
      )}
    >
      {label}
    </span>
  );
}
