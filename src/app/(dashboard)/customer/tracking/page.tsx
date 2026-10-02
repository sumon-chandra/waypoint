import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { CustomerTrackingView } from "@/features/shipments/components/customer-tracking-view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Live Order Tracking",
  description:
    "Track your ongoing consignments in real time across all 64 districts in Bangladesh with verified waypoint nodes.",
};

export default function CustomerTrackingPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-indigo-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>Customer Consignment Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Live Shipment{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Tracking
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Real-time waypoint progression, sorting hub scans, and courier delivery status for your active orders nationwide.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/customer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl gap-1.5 hover:bg-background/80"
              )}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Overview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content View with Suspense */}
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        }
      >
        <CustomerTrackingView />
      </Suspense>
    </div>
  );
}
