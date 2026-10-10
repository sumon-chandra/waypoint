"use client";

import * as React from "react";
import { Navigation, MapPin, Layers, ArrowUpRight, Boxes } from "lucide-react";
import type { BreakdownByDeliveryType } from "@/types";
import { Badge } from "@/components/ui/badge";

interface RouteYieldWidgetProps {
  breakdown: BreakdownByDeliveryType;
}

export function RouteYieldWidget({ breakdown }: RouteYieldWidgetProps) {
  const { local, interDistrict } = breakdown;
  const totalVolume = (local.volume + interDistrict.volume) || 1;

  const localVolumePct = Math.round((local.volume / totalVolume) * 100);
  const interVolumePct = 100 - localVolumePct;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Route Yield & Delivery Type Split</h3>
            <p className="text-xs text-muted-foreground">Local intra-hub versus nationwide line-haul economics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Local Deliveries */}
        <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 text-xs">
              <MapPin className="size-3.5" />
              <span>Intra-Hub Local</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold border-blue-500/30 text-blue-600 dark:text-blue-400">
              {localVolumePct}% Volume
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-black font-mono text-foreground">
              ৳{local.earnings.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {local.volume.toLocaleString()} delivered parcels
            </p>
          </div>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground text-[11px]">Avg Platform Yield:</span>
            <span className="font-mono text-foreground">৳{local.averageYield} / parcel</span>
          </div>
        </div>

        {/* Inter-District Deliveries */}
        <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400 text-xs">
              <Navigation className="size-3.5" />
              <span>Inter-District Line-Haul</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold border-purple-500/30 text-purple-600 dark:text-purple-400">
              {interVolumePct}% Volume
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-black font-mono text-foreground">
              ৳{interDistrict.earnings.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {interDistrict.volume.toLocaleString()} delivered parcels
            </p>
          </div>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground text-[11px]">Avg Platform Yield:</span>
            <span className="font-mono text-foreground">৳{interDistrict.averageYield} / parcel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
