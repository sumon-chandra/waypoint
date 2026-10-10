import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Truck, ArrowLeft } from "lucide-react";
import { AdminTrackingView } from "@/features/shipments/components/admin";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Consignment Telemetry & Live Tracking",
  description:
    "Monitor nationwide live consignment telemetry, waypoint steppers, sorting hub scans, and courier delivery status across Bangladesh.",
};

export default function AdminTrackingPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-indigo-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Truck className="size-3.5" />
              <span>Real-Time Logistics Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Consignment{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Telemetry & Live Tracking
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Supervise parcel transit status, inspect line-haul milestone completions, audit sorting hub check-ins, and manage courier assignments nationwide.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl gap-1.5 hover:bg-background/80 font-medium"
              )}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Command Center</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Live Tracking View with Suspense */}
      <React.Suspense
        fallback={
          <div className="rounded-3xl border border-border/80 bg-card p-16 text-center text-xs text-muted-foreground animate-pulse space-y-4">
            <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p>Loading live consignment telemetry...</p>
          </div>
        }
      >
        <AdminTrackingView />
      </React.Suspense>
    </div>
  );
}
