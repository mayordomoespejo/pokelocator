"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { PokemonDetail } from "@/types/models";

interface CompareTableProps {
  pokemonA: PokemonDetail;
  pokemonB: PokemonDetail;
}

export function CompareTable({ pokemonA, pokemonB }: CompareTableProps) {
  const t = useTranslations("pokemon.compare");
  const tStats = useTranslations("pokemon.detail.stats");
  const statRows = pokemonA.stats.map((stat) => ({
    key: stat.name,
    label: tStats.has(`labels.${stat.name}`) ? tStats(`labels.${stat.name}`) : stat.displayName,
  }));

  return (
    <div className="border-border bg-bg-card overflow-x-auto rounded-2xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className="text-text-muted w-28 px-4 py-3 text-left text-xs font-medium tracking-wide uppercase">
              {t("stat")}
            </th>
            <th className="text-text-primary px-4 py-3 text-center font-semibold capitalize">
              {pokemonA.name}
            </th>
            <th className="text-text-primary px-4 py-3 text-center font-semibold capitalize">
              {pokemonB.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {statRows.map((stat, i) => {
            const statA = pokemonA.stats[i]?.baseStat ?? 0;
            const statB = pokemonB.stats[i]?.baseStat ?? 0;
            const aWins = statA > statB;
            const bWins = statB > statA;
            return (
              <tr key={stat.key} className="border-border border-b last:border-0">
                <td className="text-text-muted px-4 py-3 text-xs font-medium">{stat.label}</td>
                <td
                  className={cn(
                    "px-4 py-3 text-center font-semibold",
                    aWins ? "text-green-500" : bWins ? "text-red-400" : "text-text-primary"
                  )}
                >
                  {statA}
                  {aWins && " ▲"}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-center font-semibold",
                    bWins ? "text-green-500" : aWins ? "text-red-400" : "text-text-primary"
                  )}
                >
                  {statB}
                  {bWins && " ▲"}
                </td>
              </tr>
            );
          })}

          {/* Total */}
          <tr className="bg-bg-secondary">
            <td className="text-text-muted px-4 py-3 text-xs font-bold tracking-wide uppercase">
              {t("total")}
            </td>
            {[pokemonA, pokemonB].map((p) => {
              const total = p.stats.reduce((s, stat) => s + stat.baseStat, 0);
              const other = (p === pokemonA ? pokemonB : pokemonA).stats.reduce(
                (s, stat) => s + stat.baseStat,
                0
              );
              return (
                <td
                  key={p.id}
                  className={cn(
                    "px-4 py-3 text-center text-base font-bold",
                    total > other
                      ? "text-green-500"
                      : total < other
                        ? "text-red-400"
                        : "text-text-primary"
                  )}
                >
                  {total}
                  {total > other && " ▲"}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
