import * as React from "react";

export function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col justify-between h-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-16/10 bg-muted/70 shrink-0">
        {/* Floating chip skeleton */}
        <div className="absolute top-3 left-3 h-5 w-20 rounded-full bg-muted/90" />
        <div className="absolute top-3 right-3 h-5 w-14 rounded-full bg-muted/90" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-5 space-y-4 justify-between">
        <div className="space-y-2">
          {/* Title */}
          <div className="h-5 w-3/4 rounded-lg bg-muted/80" />
          {/* Description lines */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full rounded bg-muted/60" />
            <div className="h-3.5 w-5/6 rounded bg-muted/60" />
          </div>
        </div>

        {/* Meta Skeleton */}
        <div className="pt-3 border-t border-border/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-muted/70" />
            <div className="h-4 w-16 rounded bg-muted/60" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-28 rounded bg-muted/60" />
            <div className="h-3.5 w-20 rounded bg-muted/60" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="pt-2">
          <div className="h-9 w-full rounded-xl bg-muted/80" />
        </div>
      </div>
    </div>
  );
}

export function ServiceGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default ServiceCardSkeleton;
