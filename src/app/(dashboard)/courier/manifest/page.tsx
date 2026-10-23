import type { Metadata } from "next";
import Link from "next/link";
import { Truck, ArrowLeft, Layers, ShieldCheck, MapPin } from "lucide-react";
import { CourierManifestList } from "@/features/shipments/components/courier";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Active Delivery Manifest — Courier Operations",
  description:
    "Live delivery run sheet, stops sequence, and OTP handovers for active parcels on route.",
};

export default function CourierActiveManifestPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-linear-to-r from-amber-500/10 via-orange-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Truck className="size-3.5" />
              <span>Live Run Sheet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Active Delivery{" "}
              <span className="bg-linear-to-r from-amber-600 via-orange-600 to-primary bg-clip-text text-transparent">
                Manifest
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Track stops currently loaded on your vehicle, verify receiver OTPs, and record COD collections directly during delivery handovers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/courier/shipments"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl gap-1.5 hover:bg-background/80 font-medium"
              )}
            >
              <Layers className="size-3.5" />
              <span>Assigned Queue</span>
            </Link>
            <Link
              href="/courier"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "rounded-xl gap-1.5 hover:bg-background/80 font-medium"
              )}
            >
              <ArrowLeft className="size-3.5" />
              <span>Overview</span>
            </Link>
          </div>
        </div>

        {/* Operational Guidelines Chips */}
        <div className="mt-6 pt-5 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span>4-Digit SMS OTP Handshake Required</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-amber-500 shrink-0" />
            <span>Geofenced Drop-off Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-primary shrink-0" />
            <span>Instant Digital COD Receipting</span>
          </div>
        </div>
      </div>

      {/* Manifest List with Filters & Action Buttons */}
      <CourierManifestList />
    </div>
  );
}
