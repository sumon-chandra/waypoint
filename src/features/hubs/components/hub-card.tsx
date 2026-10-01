"use client";

import * as React from "react";
import {
  MapPin,
  Clock,
  Boxes,
  Phone,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Hub } from "../schemas/hubs.schemas";

interface HubCardProps {
  hub: Hub;
}

export function HubCard({ hub }: HubCardProps) {
  // Format capacity nicely
  const formattedCapacity =
    typeof hub.capacity === "number"
      ? `${hub.capacity.toLocaleString()} / day`
      : `${hub.capacity} / day`;

  // Format division display for consistency (e.g. DHAKA -> Dhaka)
  const displayDivision =
    hub.division.charAt(0).toUpperCase() + hub.division.slice(1).toLowerCase();

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all">
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {hub.code}
          </span>
          <Badge
            variant={hub.isGateway ? "default" : "outline"}
            className="text-[10px]"
          >
            {hub.isGateway ? "Gateway Terminal" : displayDivision}
          </Badge>
        </div>

        {/* Hub Name & Geographic Hierarchy */}
        <div>
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
            {hub.name}
          </h3>
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="size-3 text-primary shrink-0" />
            <span>
              {hub.upazila ? `${hub.upazila}, ` : ""}
              {hub.district} District, {displayDivision}
            </span>
          </p>
        </div>

        {/* Physical Address */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {hub.address}
        </p>

        {/* Operational Telemetry Details */}
        <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              <span>Cutoff Time:</span>
            </span>
            <span className="font-semibold text-foreground">{hub.cutoff}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Boxes className="size-3.5 text-primary" />
              <span>Daily Capacity:</span>
            </span>
            <span className="font-semibold text-foreground font-mono">
              {formattedCapacity}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Contact & Real-time Node Status */}
      <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs">
        <a
          href={`tel:${hub.phone}`}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary font-medium transition-colors"
        >
          <Phone className="size-3" />
          <span>{hub.phone}</span>
        </a>

        {hub.status === "MAINTENANCE" ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-3" />
            <span>Maintenance</span>
          </span>
        ) : hub.status === "INACTIVE" ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
            <XCircle className="size-3" />
            <span>Inactive</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3" />
            <span>Active</span>
          </span>
        )}
      </div>
    </div>
  );
}
