import Link from "next/link";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Truck,
  Sparkles,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-28 lg:py-32">
        {/* Background decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Waypoint Logistics Operating in all 64 Districts</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Intelligent Logistics.{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Every Waypoint
              </span>{" "}
              Accounted For.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              End-to-end consignment tracking, automated hub routing, and rapid
              courier dispatch built specifically for the high-velocity demands
              of Bangladesh&apos;s digital economy.
            </p>

            {/* Quick Consignment Tracking Bar */}
            <div className="w-full max-w-xl">
              <form
                action="/tracking"
                method="GET"
                className="relative flex items-center p-1.5 rounded-2xl border border-border bg-card/90 shadow-xl backdrop-blur-md transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              >
                <div className="flex items-center pl-3 text-muted-foreground pointer-events-none">
                  <Search className="size-5" />
                </div>
                <input
                  type="text"
                  name="id"
                  placeholder="Enter Tracking ID (e.g. WP-DAC-98214)"
                  className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <Button
                  type="submit"
                  size="default"
                  className="gap-1.5 shrink-0 rounded-xl px-5"
                >
                  <span>Track Parcel</span>
                  <ArrowRight className="size-4" />
                </Button>
              </form>
              <div className="mt-2.5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>Try sample IDs:</span>
                <Link
                  href="/tracking?id=WP-DAC-98214"
                  className="underline hover:text-foreground font-mono"
                >
                  WP-DAC-98214
                </Link>
                <span>&bull;</span>
                <Link
                  href="/tracking?id=WP-CTG-44102"
                  className="underline hover:text-foreground font-mono"
                >
                  WP-CTG-44102
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/customer"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "rounded-xl font-semibold shadow-md gap-1.5",
                )}
              >
                <span>Open Customer Portal</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/courier"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl font-medium",
                )}
              >
                Courier Partner Portal
              </Link>
            </div>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:mt-20">
            <div className="rounded-2xl border border-border/70 bg-card/60 p-5 text-center shadow-xs backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                64
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                Districts Connected
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/60 p-5 text-center shadow-xs backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                99.4%
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                On-Time Delivery SLA
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/60 p-5 text-center shadow-xs backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                2.4M+
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                Consignments Fulfilled
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/60 p-5 text-center shadow-xs backdrop-blur-xs">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                24/7
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                Live Support & Dispatch
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="w-full border-t border-border/60 py-16 sm:py-24 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Engineered for Speed, Precision, and Scale
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Waypoint provides merchants and couriers with tools to automate
              fulfillment, eliminate transit blind spots, and guarantee
              reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Waypoint Node Tracking
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Detailed scan-point updates at every dispatch hub, transit
                sorting facility, and rider delivery checkpoint.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Truck className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Smart Fleet Routing
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dynamic route allocation ensuring couriers receive optimized
                parcel batches for fast city and interstate drop-offs.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Guaranteed COD & Invoicing
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Secure Cash on Delivery collection, instant settlement
                notifications, and transparent payment reconciliation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
