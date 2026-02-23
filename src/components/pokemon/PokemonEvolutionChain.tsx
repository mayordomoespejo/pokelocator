"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { capitalize } from "@/lib/utils/formatters";
import type { EvolutionNode } from "@/types/models";

interface PokemonEvolutionChainProps {
  chain: EvolutionNode | undefined;
  isLoading: boolean;
  currentId: number;
}

function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function EvolutionStep({
  node,
  currentId,
  currentLabel,
}: {
  node: EvolutionNode;
  currentId: number;
  currentLabel: string;
}) {
  const isCurrent = node.speciesId === currentId;
  const spriteUrl = getSpriteUrl(node.speciesId);

  return (
    <Link
      href={`/pokemon/${node.speciesId}`}
      className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl p-3 transition-colors ${
        isCurrent ? "bg-brand-light ring-brand ring-2" : "hover:bg-bg-muted"
      }`}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={`${capitalize(node.speciesName)}${isCurrent ? ` (${currentLabel})` : ""}`}
    >
      <div className="relative h-16 w-16">
        <Image
          src={spriteUrl}
          alt={capitalize(node.speciesName)}
          fill
          sizes="64px"
          className="object-contain drop-shadow-md"
        />
      </div>
      <span className="text-text-primary text-xs font-medium capitalize">{node.speciesName}</span>
    </Link>
  );
}

function EvolutionArrow({ node }: { node: EvolutionNode }) {
  const label = node.triggerName
    ? node.minLevel
      ? `Lv. ${node.minLevel}`
      : node.item
        ? capitalize(node.item.replace(/-/g, " "))
        : capitalize(node.triggerName.replace(/-/g, " "))
    : null;

  return (
    <div className="flex flex-col items-center gap-0.5 px-1">
      <ChevronRight size={20} className="text-text-muted" aria-hidden="true" />
      {label && (
        <span className="text-text-muted max-w-16 text-center text-[10px] leading-tight font-medium">
          {label}
        </span>
      )}
    </div>
  );
}

function renderChain(
  node: EvolutionNode,
  currentId: number,
  currentLabel: string
): React.ReactNode {
  return (
    <div key={node.speciesId} className="flex flex-wrap items-center justify-center gap-1">
      <EvolutionStep node={node} currentId={currentId} currentLabel={currentLabel} />
      {node.evolvesTo.length > 0 && (
        <div className="flex flex-col items-center gap-3">
          {node.evolvesTo.map((child) => (
            <div key={child.speciesId} className="flex items-center gap-1">
              <EvolutionArrow node={child} />
              {renderChain(child, currentId, currentLabel)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PokemonEvolutionChain({ chain, isLoading, currentId }: PokemonEvolutionChainProps) {
  const t = useTranslations("pokemon.detail.evolution");

  if (isLoading) {
    return (
      <section aria-label={t("title")} aria-busy="true">
        <h2 className="text-text-primary mb-4 text-lg font-bold">{t("title")}</h2>
        <div className="flex items-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <Skeleton className="h-4 w-4" />}
              <Skeleton className="h-20 w-20 rounded-2xl" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!chain) return null;

  // Check if it's a single-stage pokemon (no evolutions)
  const hasEvolutions =
    chain.evolvesTo.length > 0 || chain.evolvesTo.some((n) => n.evolvesTo.length > 0);

  return (
    <section aria-label={t("title")}>
      <h2 className="text-text-primary mb-4 text-lg font-bold">
        {t("title")}
        {!hasEvolutions && ` (${t("noEvolution")})`}
      </h2>
      {/* overflow-x-auto en wrapper externo; py en el interior para que el ring del elemento activo no se corte */}
      <div className="overflow-x-auto">
        <div className="flex min-w-fit flex-wrap items-center justify-center gap-2 py-2">
          {renderChain(chain, currentId, t("current"))}
        </div>
      </div>
    </section>
  );
}
