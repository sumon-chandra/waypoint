import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, MapPin, Building2, Truck, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HubsDirectory } from "./hubs-directory";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "64-District Hub Network & Cross-Dock Facilities — Waypoint",
  description:
    "Explore Waypoint's nationwide logistics infrastructure. Directory of 180+ physical sorting facilities and distribution hubs covering all 64 districts in Bangladesh.",
};

const divisionStats = [
  { division: "Dhaka", count: "13 Districts", hubs: "42 Facilities", lead: "Central Sorting Gateway (Tejgaon)" },
  { division: "Chittagong", count: "11 Districts", hubs: "34 Facilities", lead: "Port Terminal Hub (Agrabad)" },
  { division: "Sylhet", count: "4 Districts", hubs: "16 Facilities", lead: "Zindabazar Express Terminal" },
  { division: "Rajshahi", count: "8 Districts", hubs: "24 Facilities", lead: "Bogra Crossdock & Shaheb Bazar" },
  { division: "Khulna", count: "10 Districts", hubs: "26 Facilities", lead: "Shibbari Divisional Gateway" },
  { division: "Barishal", count: "6 Districts", hubs: "14 Facilities", lead: "Sadhanar Mor River Terminal" },
  { division: "Rangpur", count: "8 Districts", hubs: "18 Facilities", lead: "Jahangirabad Northern Depot" },
  { division: "Mymensingh", count: "4 Districts", hubs: "12 Facilities", lead: "Ganginarpar Hub" },
];

export default function HubsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>100% Geographic Coverage Across Bangladesh</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Nationwide Hub Network &{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                64-District Presence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Waypoint operates 180+ sorting facilities, cross-dock terminals, and localized micro-depots
              interconnected by dedicated highway linehauls.
            </p>
          </div>
        </div>
      </section>

      {/* Network Overview Summary Cards */}
      <section className="py-12 bg-muted/20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">64 / 64</span>
              <p className="text-xs font-semibold text-primary mt-1">Districts Connected</p>
              <p className="text-[11px] text-muted-foreground">Every upazila and union reachable</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">180+</span>
              <p className="text-xs font-semibold text-primary mt-1">Operational Facilities</p>
              <p className="text-[11px] text-muted-foreground">Cross-dock, sorting, and micro-hubs</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">8</span>
              <p className="text-xs font-semibold text-primary mt-1">Divisional Gateways</p>
              <p className="text-[11px] text-muted-foreground">High-speed overnight sorting lanes</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">99.4%</span>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">SLA Accuracy</p>
              <p className="text-[11px] text-muted-foreground">Monitored 24/7 by dispatch telemetry</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hubs Directory Filter & Search */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Regional Facility Directory
            </h2>
            <p className="text-sm text-muted-foreground">
              Find contact coordinates, daily parcel intake cutoff times, and sorting capacities for any district.
            </p>
          </div>

          <HubsDirectory />
        </div>
      </section>

      {/* Drop-off Call to Action */}
      <section className="py-14 sm:py-18 bg-muted/20 border-t border-border/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Building2 className="size-6" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground">
              Direct Counter Drop-Offs Welcome
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Need to send a parcel right away? Drop off directly at any of our regional hubs before
              the cutoff time for guaranteed next-day dispatch.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl shadow-xs font-semibold gap-1.5"
              )}
            >
              <span>Calculate Shipping Fare</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-xl font-medium"
              )}
            >
              Contact Operations Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
