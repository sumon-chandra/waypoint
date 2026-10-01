"use client";

import * as React from "react";
import { Search, RotateCcw, AlertCircle, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHubs } from "../api/hubs.api";
import { BANGLADESH_DIVISIONS } from "../schemas/hubs.schemas";
import { HubCard } from "./hub-card";
import { HubCardSkeleton } from "./hub-card-skeleton";

const divisions = ["All", ...BANGLADESH_DIVISIONS];

export function HubsDirectory() {
  const [selectedDivision, setSelectedDivision] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const {
    data: hubs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useHubs();

  // Filter hubs client-side with case-insensitive division & text search
  const filteredHubs = React.useMemo(() => {
    return hubs.filter((hub) => {
      // Normalize division comparison (e.g. DHAKA vs Dhaka)
      const matchesDivision =
        selectedDivision === "All" ||
        hub.division.toUpperCase() === selectedDivision.toUpperCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        hub.name.toLowerCase().includes(q) ||
        hub.district.toLowerCase().includes(q) ||
        (hub.upazila && hub.upazila.toLowerCase().includes(q)) ||
        hub.code.toLowerCase().includes(q) ||
        hub.address.toLowerCase().includes(q);

      return matchesDivision && matchesSearch;
    });
  }, [hubs, selectedDivision, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Division Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {divisions.map((div) => {
            const isSelected = selectedDivision === div;
            return (
              <button
                key={div}
                type="button"
                onClick={() => setSelectedDivision(div)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {div}
              </button>
            );
          })}
        </div>

        {/* Real-time Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="pointer-events-none absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search district, upazila, or hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Result Status Banner */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/60 pb-3">
        <span>
          Showing{" "}
          <strong className="text-foreground">
            {isLoading ? "..." : filteredHubs.length}
          </strong>{" "}
          hubs across{" "}
          {selectedDivision === "All"
            ? "all 8 divisions"
            : `${selectedDivision} division`}
        </span>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All Facilities Normal Operations</span>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <HubCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
          <div className="size-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertCircle className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              Unable to load hubs directory
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {(error as Error)?.message ||
                "Failed to fetch operational hubs from the database. Please check your network connection or sign in."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 rounded-xl font-medium"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredHubs.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4">
          <div className="size-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <Building2 className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              No matching facilities found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || selectedDivision !== "All"
                ? `No hubs match "${searchQuery || selectedDivision}". Try clearing filters or searching for another district.`
                : "No operational facilities found in the system."}
            </p>
          </div>
          {(searchQuery || selectedDivision !== "All") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDivision("All");
                setSearchQuery("");
              }}
              className="rounded-xl text-xs font-medium"
            >
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {/* Live Hubs Grid */}
      {!isLoading && !isError && filteredHubs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHubs.map((hub) => (
            <HubCard key={hub.id || hub.code} hub={hub} />
          ))}
        </div>
      )}
    </div>
  );
}
