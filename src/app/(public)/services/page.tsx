import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Clock, Zap, Building2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ServicesCatalogView } from "@/features/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Logistics Services & Delivery Solutions Catalog — Waypoint",
  description:
    "Explore Waypoint's comprehensive parcel delivery tiers across Bangladesh: Same-Day Rush, Next-Day Express, Cold Chain, Bulk Freight Linehaul, and 1% Automated COD.",
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header Banner */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background py-16 sm:py-20 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Full-Spectrum Supply Chain Solutions Across All 64 Districts</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              Logistics Services &{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Delivery Catalog
              </span>
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed">
              Explore Waypoint&apos;s engineered courier and freight services. From rapid intra-city rush transit to heavy inter-district highway linehauls with automated 1% Cash on Delivery reconciliation.
            </p>
          </div>

          {/* Quick SLA Highlights */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-4xl mx-auto">
            <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 text-center shadow-2xs backdrop-blur-xs">
              <p className="text-lg font-bold text-foreground font-mono">4 - 8 Hours</p>
              <p className="text-[11px] font-medium text-muted-foreground">Same-Day Metro SLA</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 text-center shadow-2xs backdrop-blur-xs">
              <p className="text-lg font-bold text-primary font-mono">12 - 24 Hours</p>
              <p className="text-[11px] font-medium text-muted-foreground">Next-Day Nationwide</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 text-center shadow-2xs backdrop-blur-xs">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">1% Flat Fee</p>
              <p className="text-[11px] font-medium text-muted-foreground">Automated COD Remittance</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 text-center shadow-2xs backdrop-blur-xs">
              <p className="text-lg font-bold text-foreground font-mono">100% Insured</p>
              <p className="text-[11px] font-medium text-muted-foreground">Zero Blind-Spot Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Core Listing & Interactive Filter Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Explore Available Shipping Tiers
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Filter by vehicle category, price tier, delivery speed, or geographical reach to find your optimal fulfillment solution.
            </p>
          </div>

          {/* Catalog View Component */}
          <ServicesCatalogView />
        </div>
      </section>

      {/* Bottom Dispatch Partnership CTA */}
      <section className="py-14 bg-muted/20 border-t border-border/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Building2 className="size-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Need a Custom High-Volume Freight Contract?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Managing more than 500 consignments daily or moving heavy containerized pallets? Speak directly with our corporate logistics specialists for tailored enterprise SLAs and dedicated account management.
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
              Contact Enterprise Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
