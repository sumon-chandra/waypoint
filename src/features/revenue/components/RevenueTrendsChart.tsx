"use client";

import * as React from "react";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Banknote,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminRevenueTrends } from "../api/useAdminRevenueTrends";
import type { TrendInterval, RevenueTrendPoint } from "@/types";
import { cn } from "@/lib/utils";

export function RevenueTrendsChart() {
  const [interval, setInterval] = React.useState<TrendInterval>("week");
  const [hoveredPoint, setHoveredPoint] =
    React.useState<RevenueTrendPoint | null>(null);

  const { data: trendData = [], isLoading } = useAdminRevenueTrends(interval);

  // Active point: hovered point if user is interacting, or latest point by default
  const activePoint =
    hoveredPoint ??
    (trendData.length > 0 ? trendData[trendData.length - 1] : null);

  // Maximum value for scaling the stacked bars
  const maxEarnings = React.useMemo(() => {
    if (trendData.length === 0) return 10000;
    return Math.max(...trendData.map((d) => d.totalEarnings)) * 1.15;
  }, [trendData]);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6 flex flex-col justify-between">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BarChart3 className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Revenue Time-Series Trends
            </h3>
            <p className="text-xs text-muted-foreground">
              Stacked Card vs COD earnings distribution
            </p>
          </div>
        </div>

        {/* Interval Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted/60 border border-border/60 self-start sm:self-auto">
          {(["week", "month"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setInterval(tab)}
              className={cn(
                "px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer",
                interval === tab
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Detail Readout */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            <span>Card Earnings</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span>COD Platform Yield</span>
          </div>
        </div>

        {activePoint ? (
          <div className="flex items-center gap-2">
            <div className="font-mono text-xs font-bold bg-muted/50 px-3 py-1 rounded-xl border border-border/60">
              <span className="text-foreground">{activePoint.date}: </span>
              <span className="text-emerald-500">
                ৳{(activePoint.cardEarnings ?? 0).toLocaleString()}
              </span>{" "}
              +{" "}
              <span className="text-amber-500">
                ৳{(activePoint.codEarnings ?? 0).toLocaleString()}
              </span>{" "}
              ={" "}
              <span className="text-foreground">
                ৳{(activePoint.totalEarnings ?? 0).toLocaleString()}
              </span>{" "}
              <span className="text-muted-foreground font-sans text-[11px] font-normal">
                ({activePoint.shipmentCount ?? 0} pkgs)
              </span>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-[11px]">
            Loading trend overview...
          </span>
        )}
      </div>

      {/* Stacked Chart Canvas */}
      <div className="h-56 pt-6 flex items-end justify-between gap-2 sm:gap-4 border-b border-border/60 pb-2">
        {isLoading ? (
          <div className="size-full flex items-center justify-center text-xs text-muted-foreground animate-pulse">
            Loading revenue trends...
          </div>
        ) : (
          trendData.map((point) => {
            const cardHeightPercent = (point.cardEarnings / maxEarnings) * 100;
            const codHeightPercent = (point.codEarnings / maxEarnings) * 100;

            const isHovered = hoveredPoint?.date === point.date;

            return (
              <div
                key={point.date}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Stacked Bar Container */}
                <div
                  className={cn(
                    "w-full max-w-10 rounded-2xl overflow-hidden flex flex-col justify-end transition-all duration-300",
                    isHovered
                      ? "ring-2 ring-primary scale-105 shadow-md"
                      : "opacity-90 hover:opacity-100",
                  )}
                  style={{
                    height: `${Math.max(12, cardHeightPercent + codHeightPercent)}%`,
                  }}
                >
                  {/* COD (Top) */}
                  <div
                    className="w-full bg-amber-500 transition-all"
                    style={{
                      height: `${(point.codEarnings / (point.totalEarnings || 1)) * 100}%`,
                    }}
                  />
                  {/* Card (Bottom) */}
                  <div
                    className="w-full bg-emerald-500 transition-all"
                    style={{
                      height: `${(point.cardEarnings / (point.totalEarnings || 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Date Label */}
                <span
                  className={cn(
                    "mt-2 text-[10px] font-mono transition-colors",
                    isHovered
                      ? "text-primary font-bold"
                      : "text-muted-foreground",
                  )}
                >
                  {point.date}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
