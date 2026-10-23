"use client";

import * as React from "react";
import { Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BANGLADESH_DIVISIONS } from "../schemas/hubs.schemas";
import { PROMOTIONAL_HUBS } from "../data/promotional-hubs";
import { HubCard } from "./hub-card";

const divisions = ["All", ...BANGLADESH_DIVISIONS];

export function HubsDirectory() {
  const [selectedDivision, setSelectedDivision] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Filter curated promotional hubs with case-insensitive division & text search
  const filteredHubs = React.useMemo(() => {
    return PROMOTIONAL_HUBS.filter((hub) => {
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
  }, [selectedDivision, searchQuery]);

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
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
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
          Showing <strong className="text-foreground">{filteredHubs.length}</strong> facilities across{" "}
          {selectedDivision === "All" ? "all 8 divisions" : `${selectedDivision} division`}
        </span>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All Facilities Normal Operations</span>
        </div>
      </div>

      {/* Empty State */}
      {filteredHubs.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4">
          <div className="size-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <Building2 className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No matching facilities found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No hubs match &quot;{searchQuery || selectedDivision}&quot;. Try clearing filters or searching for another district.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedDivision("All");
              setSearchQuery("");
            }}
            className="rounded-xl text-xs font-medium cursor-pointer"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Live Hubs Grid */}
      {filteredHubs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHubs.map((hub) => (
            <HubCard key={hub.id || hub.code} hub={hub} />
          ))}
        </div>
      )}
    </div>
  );
}
