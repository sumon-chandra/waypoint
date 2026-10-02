import type { Metadata } from "next";
import Link from "next/link";
import { MapPinOff, LayoutDashboard, Truck, Package, ArrowLeft, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard Resource Not Found | Waypoint",
  description: "The requested operational resource or dashboard module could not be found.",
};

export default function DashboardNotFound() {
  return (
    <div className="flex h-full min-h-[calc(100vh-8rem)] w-full items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="relative mx-auto size-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-lg shadow-primary/10">
          <MapPinOff className="size-8" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span>404 — Module Unindexed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Resource Not Found
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            The consignment, hub telemetry, or operational sub-route you navigated to does not exist or may have been archived.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "w-full sm:w-auto rounded-xl gap-2 font-semibold shadow-xs"
            )}
          >
            <LayoutDashboard className="size-4" />
            <span>Command Center</span>
          </Link>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full sm:w-auto rounded-xl gap-2 font-medium"
            )}
          >
            <Home className="size-4" />
            <span>Home Page</span>
          </Link>

          <Link
            href="/customer/tracking"
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "w-full sm:w-auto rounded-xl gap-2 text-xs text-muted-foreground hover:text-foreground"
            )}
          >
            <Truck className="size-4" />
            <span>Live Tracking</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
