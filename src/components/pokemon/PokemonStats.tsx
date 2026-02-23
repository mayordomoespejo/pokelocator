"use client";

import { useTranslations } from "next-intl";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { PokemonStat } from "@/types/models";

interface PokemonStatsProps {
  stats: PokemonStat[];
}

export function PokemonStats({ stats }: PokemonStatsProps) {
  const t = useTranslations("pokemon.detail.stats");
  const total = stats.reduce((sum, s) => sum + s.baseStat, 0);
  const getStatLabel = (name: string, fallback: string) =>
    t.has(`labels.${name}`) ? t(`labels.${name}`) : fallback;

  return (
    <section aria-label={t("title")}>
      <h2 className="text-text-primary mb-4 text-lg font-bold">{t("title")}</h2>
      <dl className="flex flex-col gap-3">
        {stats.map((stat, i) => (
          <div key={stat.name}>
            <dt className="sr-only">{getStatLabel(stat.name, stat.displayName)}</dt>
            <dd>
              <ProgressBar
                value={stat.baseStat}
                label={getStatLabel(stat.name, stat.displayName)}
                delay={i * 0.07}
              />
            </dd>
          </div>
        ))}
        <div className="border-border mt-2 border-t pt-3">
          <ProgressBar value={total} max={600} label={t("total")} delay={stats.length * 0.07} />
        </div>
      </dl>
    </section>
  );
}
