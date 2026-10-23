"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Package,
  MapPin,
  Truck,
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AiSearchSuggestion {
  id: string;
  type: "tracking" | "service" | "location" | "help";
  title: string;
  subtitle: string;
  href: string;
  badge: string;
  icon: typeof Zap;
}

interface AiSearchSuggestionsProps {
  query: string;
  onSelectSuggestion?: (suggestion: AiSearchSuggestion) => void;
  className?: string;
}

export function AiSearchSuggestions({
  query,
  onSelectSuggestion,
  className,
}: AiSearchSuggestionsProps) {
  const trimmed = query.trim().toLowerCase();

  const suggestions = React.useMemo<AiSearchSuggestion[]>(() => {
    if (!trimmed) return [];

    const list: AiSearchSuggestion[] = [];

    // 1. Detect Tracking Number Pattern
    const trackingMatch = trimmed.match(/^wp-?\d*/i) || /^\d{4,}/.test(trimmed);
    if (trackingMatch) {
      const code = trimmed.toUpperCase().startsWith("WP-")
        ? trimmed.toUpperCase()
        : `WP-${trimmed.replace(/\D/g, "")}`;

      list.push({
        id: "track-direct",
        type: "tracking",
        title: `Track Consignment ${code}`,
        subtitle: "View live waypoint scans and active delivery stage",
        href: `/track/${code}`,
        badge: "Live Telemetry",
        icon: Package,
      });
    }

    // 2. Detect Service Intent
    if (trimmed.includes("same") || trimmed.includes("fast") || trimmed.includes("rush") || trimmed.includes("today") || trimmed.includes("hour")) {
      list.push({
        id: "service-sameday",
        type: "service",
        title: "Same-Day City Transit (4 - 8 Hours)",
        subtitle: "On-demand rush point-to-point courier from ৳120",
        href: "/services/same-day",
        badge: "Ultra Fast",
        icon: Clock,
      });
    }

    if (trimmed.includes("express") || trimmed.includes("next") || trimmed.includes("regular") || trimmed.includes("parcel")) {
      list.push({
        id: "service-express",
        type: "service",
        title: "Express Parcel Delivery (12 - 24 Hours)",
        subtitle: "Guaranteed next-day delivery nationwide from ৳60",
        href: "/services/express",
        badge: "Most Popular",
        icon: Zap,
      });
    }

    if (trimmed.includes("cold") || trimmed.includes("pharma") || trimmed.includes("medicine") || trimmed.includes("perish") || trimmed.includes("food") || trimmed.includes("frozen")) {
      list.push({
        id: "service-cold",
        type: "service",
        title: "Cold-Chain & Perishable Cargo (-18°C to +4°C)",
        subtitle: "Refrigerated transport for sensitive pharmaceuticals and food",
        href: "/services/cold-chain",
        badge: "Temperature Controlled",
        icon: ShieldCheck,
      });
    }

    if (trimmed.includes("heavy") || trimmed.includes("freight") || trimmed.includes("bulk") || trimmed.includes("cargo") || trimmed.includes("truck") || trimmed.includes("50kg")) {
      list.push({
        id: "service-freight",
        type: "service",
        title: "Hub-to-Hub Linehaul Freight (50kg+)",
        subtitle: "Containerized highway transport between all 8 divisional gateways",
        href: "/services/freight",
        badge: "Heavy Cargo",
        icon: Truck,
      });
    }

    // 3. Detect Geographic Intent
    const divisions = [
      { name: "Dhaka", hub: "Tejgaon Central Sorting Gateway" },
      { name: "Chittagong", hub: "Agrabad Port Terminal Hub" },
      { name: "Sylhet", hub: "Zindabazar Express Terminal" },
      { name: "Rajshahi", hub: "Bogra Highway Cross-Dock" },
      { name: "Khulna", hub: "Shibbari Divisional Gateway" },
      { name: "Barishal", hub: "Sadhanar Mor River Terminal" },
      { name: "Rangpur", hub: "Jahangirabad Northern Depot" },
      { name: "Mymensingh", hub: "Ganginarpar Hub" },
    ];

    for (const div of divisions) {
      if (div.name.toLowerCase().includes(trimmed) || trimmed.includes(div.name.toLowerCase())) {
        list.push({
          id: `geo-${div.name}`,
          type: "location",
          title: `${div.name} Division Dispatch Hub`,
          subtitle: `${div.hub} • Next-Day Cutoff: 18:00`,
          href: `/services?location=${div.name.toLowerCase()}`,
          badge: "64-District Network",
          icon: MapPin,
        });
      }
    }

    return list.slice(0, 4);
  }, [trimmed]);

  if (!trimmed || suggestions.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/20 bg-card/95 p-2 shadow-xl backdrop-blur-md animate-in fade-in-50 duration-150",
        className
      )}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-primary">
        <Sparkles className="size-3" />
        <span>AI Smart Recommendations</span>
      </div>

      <div className="space-y-1 mt-1">
        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => onSelectSuggestion?.(item)}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-accent/60 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{item.subtitle}</p>
                </div>
              </div>

              <ArrowRight className="size-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default AiSearchSuggestions;
