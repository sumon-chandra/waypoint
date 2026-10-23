"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, MapPin, Clock, Boxes, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DIVISIONAL_GATEWAYS = [
  {
    division: "Dhaka",
    hubName: "Tejgaon Central Sorting Gateway",
    code: "DHK-GW01",
    districtCount: "13 Districts",
    address: "Plot 42, Tejgaon Industrial Area, Dhaka-1208",
    capacity: "45,000 / day",
    cutoff: "18:00 (6:00 PM)",
    phone: "01711-001001",
    leadRole: "Automated Laser Sorting & National Airfreight Dispatch",
  },
  {
    division: "Chittagong",
    hubName: "Agrabad Port Terminal Hub",
    code: "CTG-GW01",
    districtCount: "11 Districts",
    address: "Agrabad Commercial Area, Strand Road, Chittagong",
    capacity: "38,000 / day",
    cutoff: "18:00 (6:00 PM)",
    phone: "01711-002001",
    leadRole: "Maritime Freight Terminal & Southern Coastal Corridor",
  },
  {
    division: "Sylhet",
    hubName: "Zindabazar Express Cross-Dock",
    code: "SYL-GW01",
    districtCount: "4 Districts",
    address: "Zindabazar Point, Amberkhana Road, Sylhet",
    capacity: "20,000 / day",
    cutoff: "18:00 (6:00 PM)",
    phone: "01711-003001",
    leadRole: "Northeast Highway Line-Haul & Tea Valley Micro-Depots",
  },
  {
    division: "Rajshahi",
    hubName: "Bogra Highway Junction Gateway",
    code: "RAJ-GW01",
    districtCount: "8 Districts",
    address: "Banani Mor, Rangpur-Dhaka Highway, Bogra",
    capacity: "26,000 / day",
    cutoff: "18:00 (6:00 PM)",
    phone: "01711-004001",
    leadRole: "Northern Highway Linehaul Hub & Agro Distribution Center",
  },
  {
    division: "Khulna",
    hubName: "Shibbari Divisional Gateway",
    code: "KHL-GW01",
    districtCount: "10 Districts",
    address: "Shibbari Mor, KDA Avenue, Khulna",
    capacity: "22,000 / day",
    cutoff: "18:00 (6:00 PM)",
    phone: "01711-005001",
    leadRole: "Southwest Cross-Dock & Benapole Border Forwarding",
  },
];

export function HubsHighlightTabs() {
  const [selectedDiv, setSelectedDiv] = React.useState<string>("Dhaka");

  const current =
    DIVISIONAL_GATEWAYS.find((g) => g.division === selectedDiv) ||
    DIVISIONAL_GATEWAYS[0];

  return (
    <div className="space-y-6">
      {/* Division Selector Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DIVISIONAL_GATEWAYS.map((gateway) => {
          const isSelected = gateway.division === selectedDiv;
          return (
            <button
              key={gateway.division}
              type="button"
              onClick={() => setSelectedDiv(gateway.division)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {gateway.division} Gateway
            </button>
          );
        })}
      </div>

      {/* Active Gateway Showcase Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                {current.code}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                Serving {current.districtCount}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                {current.hubName}
              </h3>
              <p className="text-xs text-primary font-medium flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" />
                <span>{current.address}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {current.leadRole}. Directly linked to regional micro-depots via scheduled overnight transit routes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                  <Boxes className="size-3 text-primary" />
                  <span>Daily Intake</span>
                </span>
                <p className="font-bold text-foreground font-mono">{current.capacity}</p>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                  <Clock className="size-3 text-primary" />
                  <span>Next-Day Cutoff</span>
                </span>
                <p className="font-bold text-foreground font-mono">{current.cutoff}</p>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1 col-span-2 sm:col-span-1">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                  <Phone className="size-3 text-primary" />
                  <span>Direct Hotline</span>
                </span>
                <p className="font-bold text-foreground font-mono">{current.phone}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl bg-muted/40 border border-border/60 p-6 text-center space-y-4">
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="size-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">100% Nationwide Reach</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Counter drop-offs accepted until 18:00 daily across all divisional facilities.
              </p>
            </div>
            <Link
              href="/hubs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Explore 180+ Facilities</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HubsHighlightTabs;
