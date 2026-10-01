"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function HubCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>

        {/* Title & Location */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-44 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        {/* Address */}
        <Skeleton className="h-8 w-full rounded-md" />

        {/* Specs lines */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    </div>
  );
}
