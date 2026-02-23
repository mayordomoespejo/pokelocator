import { PokemonCardSkeleton } from "@/components/pokemon/PokemonCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Search skeleton */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-11 w-full max-w-lg rounded-xl" />
      </div>

      {/* Filter chips skeleton */}
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-16 rounded-full" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
