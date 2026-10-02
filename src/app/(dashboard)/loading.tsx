import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in-0 duration-300">
      {/* Top Banner Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-8 backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-44 rounded-full" />
            <Skeleton className="h-9 w-72 rounded-xl" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          </div>

          <div className="shrink-0">
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="size-9 rounded-xl" />
            </div>
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-7 w-20 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-8 space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <Skeleton className="size-12 rounded-2xl" />
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>

            <div className="pt-2">
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
