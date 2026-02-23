"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { capitalize } from "@/lib/utils/formatters";
import type { PokemonMove } from "@/types/models";

interface PokemonMovesProps {
  moves: PokemonMove[];
}

export function PokemonMoves({ moves }: PokemonMovesProps) {
  const t = useTranslations("pokemon.detail.moves");
  const [filter, setFilter] = useState<string>("level-up");

  const METHOD_KEYS: Record<string, string> = {
    "level-up": t("methods.levelUp"),
    machine: t("methods.machine"),
    tutor: t("methods.tutor"),
    egg: t("methods.egg"),
  };

  const methodCounts = moves.reduce(
    (acc, move) => {
      acc[move.learnMethod] = (acc[move.learnMethod] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const methods = Object.keys(methodCounts).filter((m) => methodCounts[m] > 0);
  const filteredMoves = moves
    .filter((m) => m.learnMethod === filter)
    .sort((a, b) => a.levelLearnedAt - b.levelLearnedAt)
    .slice(0, 20);

  return (
    <section aria-label="Moves">
      <h2 className="text-text-primary mb-4 text-lg font-bold">{t("title")}</h2>

      {/* Method filter tabs */}
      <div role="tablist" aria-label="Move learn methods" className="mb-4 flex flex-wrap gap-2">
        {methods.map((method) => (
          <button
            key={method}
            role="tab"
            aria-selected={filter === method}
            onClick={() => setFilter(method)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === method
                ? "bg-brand text-white"
                : "bg-bg-muted text-text-secondary hover:bg-bg-secondary"
            }`}
          >
            {METHOD_KEYS[method] ?? capitalize(method)}
            <span className="ml-1.5 opacity-70">({methodCounts[method]})</span>
          </button>
        ))}
      </div>

      {/* Moves list */}
      {filteredMoves.length === 0 ? (
        <p className="text-text-muted text-sm">{t("empty")}</p>
      ) : (
        <div role="tabpanel" className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {filteredMoves.map((move) => (
            <div
              key={move.name}
              className="border-border bg-bg-card flex items-center gap-2 rounded-lg border px-3 py-2"
            >
              {filter === "level-up" && move.levelLearnedAt > 0 && (
                <span className="text-brand w-6 shrink-0 text-center text-xs font-bold">
                  {move.levelLearnedAt}
                </span>
              )}
              <span className="text-text-primary truncate text-sm capitalize">
                {move.displayName}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
