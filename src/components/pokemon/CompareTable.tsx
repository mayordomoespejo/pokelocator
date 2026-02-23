"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { PokemonDetail } from "@/types/models";

interface CompareTableProps {
  pokemonA: PokemonDetail;
  pokemonB: PokemonDetail;
}

/** Build a map of stat name -> baseStat for O(1) lookup. */
function statsByName(pokemon: PokemonDetail): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of pokemon.stats) {
    map.set(s.name, s.baseStat);
  }
  return map;
}

export function CompareTable({ pokemonA, pokemonB }: CompareTableProps) {
  const t = useTranslations("pokemon.compare");
  const tStats = useTranslations("pokemon.detail.stats");

  const statsA = statsByName(pokemonA);
  const statsB = statsByName(pokemonB);
  const namesA = new Set(pokemonA.stats.map((s) => s.name));
  const statNames = [
    ...pokemonA.stats.map((s) => s.name),
    ...pokemonB.stats.map((s) => s.name).filter((name) => !namesA.has(name)),
  ];

  const statRows = statNames.map((name) => {
    const displayName =
      pokemonA.stats.find((s) => s.name === name)?.displayName ??
      pokemonB.stats.find((s) => s.name === name)?.displayName ??
      name;
    return {
      key: name,
      label: tStats.has(`labels.${name}`) ? tStats(`labels.${name}`) : displayName,
    };
  });

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
          {statRows.map((stat) => {
            const statA = statsA.get(stat.key) ?? 0;
            const statB = statsB.get(stat.key) ?? 0;
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
