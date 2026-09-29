"use client";

import * as React from "react";
import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import { useActiveShipments } from "@/features/shipments/api/use-active-shipments";
import { cn } from "@/lib/utils";

interface ActiveShipmentsBadgeProps {
  variant?: "desktop" | "mobile" | "drawer";
  className?: string;
  onClick?: () => void;
}

export function ActiveShipmentsBadge({
  variant = "desktop",
  className,
  onClick,
}: ActiveShipmentsBadgeProps) {
  const { data: shipments = [], isLoading } = useActiveShipments();
  const count = shipments.length;

  // If loading or no active shipments, render nothing in the navbar
  if (isLoading || count === 0) {
    return null;
  }

  // Option C: "1 Active Order" or "X Active Orders"
  const label = count === 1 ? "1 Active Order" : `${count} Active Orders`;

  if (variant === "drawer") {
    return (
      <Link
        href="/customer/tracking"
        onClick={onClick}
        className={cn(
          "flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 transition-all text-emerald-700 dark:text-emerald-300",
          className
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold">{label}</p>
            <p className="text-[11px] text-muted-foreground">
              Tap to track live waypoint movement
            </p>
          </div>
        </div>
        <ArrowRight className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      </Link>
    );
  }

  if (variant === "mobile") {
    return (
      <Link
        href="/customer/tracking"
        onClick={onClick}
        aria-label={`${label}, view live tracking`}
        title={label}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs hover:bg-emerald-500/20 active:scale-95 transition-all",
          className
        )}
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <Truck className="size-3.5" />
        <span className="text-xs font-bold">{count}</span>
      </Link>
    );
  }

  // Desktop default
  return (
    <Link
      href="/customer/tracking"
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs hover:border-emerald-500/50 hover:bg-emerald-500/15 active:scale-95 transition-all cursor-pointer",
        className
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <Truck className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
      <span>{label}</span>
    </Link>
  );
}
