"use client";

import * as React from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RevenueMetricCards } from "./RevenueMetricCards";
import { RevenueCompositionChart } from "./RevenueCompositionChart";
import { RevenueTrendsChart } from "./RevenueTrendsChart";
import { GrossVsNetComparison } from "./GrossVsNetComparison";
import { RouteYieldWidget } from "./RouteYieldWidget";
import { useAdminRevenue } from "../api/useAdminRevenue";
import { useQueryClient } from "@tanstack/react-query";
import { revenueKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

export function AdminRevenueDashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading, isRefetching, refetch } = useAdminRevenue();

  const handleRefresh = async () => {
    await refetch();
    queryClient.invalidateQueries({ queryKey: revenueKeys.all });
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">
            Multi-Stream Financial Command
          </h2>
          <p className="text-xs text-muted-foreground">
            Reconcile prepaid online revenue, door cash collections, and courier
            liabilities nationwide.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefetching}
            className="rounded-2xl h-10 px-4 text-xs font-bold gap-1.5 cursor-pointer"
          >
            <RotateCw
              className={cn(
                "size-3.5",
                isRefetching && "animate-spin text-primary"
              )}
            />
            <span>Refresh Ledger</span>
          </Button>
        </div>
      </div>

      {/* Feature 2: 5 Financial Metric Cards */}
      {data ? (
        <RevenueMetricCards data={data} isLoading={isLoading} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-32 rounded-3xl bg-muted/40 animate-pulse border border-border/60"
            />
          ))}
        </div>
      )}

      {/* Feature 3: Visualizations */}
      {data && (
        <>
          {/* Main Visualizations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Stacked Time-Series Chart */}
            <div className="lg:col-span-7">
              <RevenueTrendsChart />
            </div>

            {/* Donut Chart: Revenue Mix */}
            <div className="lg:col-span-5">
              <RevenueCompositionChart summary={data.summary} />
            </div>
          </div>

          {/* Secondary Row: Gross vs Net Reconciliation & Route Yield Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <GrossVsNetComparison
                codCashFlow={data.codCashFlow}
                summary={data.summary}
              />
            </div>
            <div className="lg:col-span-5">
              <RouteYieldWidget breakdown={data.breakdownByDeliveryType} />
            </div>
          </div>

          {/* Unit Economics Summary Pill */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Consolidated Unit Economics
              </span>
              <p className="text-sm font-semibold text-foreground">
                Avg Platform Yield per Delivered Consignment:{" "}
                <span className="font-mono text-primary font-bold">
                  ৳{data.unitEconomics?.averageRevenuePerShipment ?? 145}
                </span>{" "}
                across {data.unitEconomics?.deliveredShipmentCount ?? 0} completed
                orders
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <Badge variant="outline" className="px-3 py-1">
                Avg Delivery Fee: ৳{data.unitEconomics?.averageDeliveryFee ?? 135}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Avg Commission: ৳{data.unitEconomics?.averageCodCommission ?? 25}
              </Badge>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
