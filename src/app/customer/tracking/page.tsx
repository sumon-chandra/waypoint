import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { CustomerTrackingView } from "@/features/shipments/components/customer-tracking-view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Live Order Tracking — Customer Portal | Waypoint",
  description:
    "Track your ongoing consignments in real time across all 64 districts in Bangladesh with verified waypoint nodes.",
};

export default function CustomerTrackingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background py-8 sm:py-12 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
                <Sparkles className="size-3.5" />
                <span>Customer Consignment Telemetry</span>
              </div>

              <Link
                href="/customer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-xs gap-1.5 rounded-xl hover:bg-background/80"
                )}
              >
                <ArrowLeft className="size-3.5" />
                <span>Customer Dashboard</span>
              </Link>
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-4xl text-foreground">
              Live Shipment{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Tracking
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Real-time waypoint progression, sorting hub scans, and courier delivery status for your active orders nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content View with Suspense */}
      <main className="flex-1 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
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
      </main>
    </div>
  );
}
