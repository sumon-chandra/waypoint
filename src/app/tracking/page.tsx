import { Suspense } from "react";
import type { Metadata } from "next";
import { TrackingClient } from "./tracking-client";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Track Consignment & Waypoint Progression — Waypoint",
  description:
    "Real-time parcel tracking across all 64 districts in Bangladesh. Check waypoint scan nodes, linehaul progress, and courier delivery status.",
};

export default function TrackingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-14 sm:py-20 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Real-Time Node Telemetry</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              Consignment Waypoint{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Tracking
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Follow your package&apos;s journey through every sorting hub, linehaul highway vehicle,
              and last-mile delivery rider across Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tracking Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            }
          >
            <TrackingClient />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
