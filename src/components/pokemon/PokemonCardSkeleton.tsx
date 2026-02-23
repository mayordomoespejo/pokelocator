import { Skeleton } from "@/components/ui/Skeleton";

export function PokemonCardSkeleton() {
  return (
    <div
      className="border-border bg-bg-card flex flex-col items-center rounded-2xl border p-4"
      aria-hidden="true"
    >
      {/* Dex number */}
      <Skeleton className="mb-2 h-3 w-10" />
      {/* Sprite */}
      <Skeleton className="mb-3 h-24 w-24 rounded-full" />
      {/* Name */}
      <Skeleton className="mb-3 h-5 w-28" />
      {/* Type badges */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  );
}
