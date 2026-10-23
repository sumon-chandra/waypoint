import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Truck,
  Sparkles,
  Clock,
  Boxes,
  CheckCircle2,
  Snowflake,
  Bot,
  Zap,
  Building2,
  Layers,
  PhoneCall,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HeroSection,
  FareEstimatorWidget,
  FaqAccordion,
  HubsHighlightTabs,
} from "@/features/home";
import { getFeaturedServices } from "@/features/services/data/services-data";
import { ServiceCard } from "@/features/services/components/ServiceCard";

export default function Home() {
  const featuredServices = getFeaturedServices();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* SECTION 1: Hero Section (with constrained height, interactive tracking input, CTAs) */}
      <HeroSection />

      {/* SECTION 2: Live Telemetry Metrics Banner */}
      <section className="w-full border-y border-border/70 bg-card/60 backdrop-blur-md py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/50 border border-border/50 shadow-2xs">
              <div className="flex items-center gap-1.5 text-primary mb-1">
                <MapPin className="size-4" />
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  64
                </span>
              </div>
              <p className="text-xs font-bold text-foreground">
                Districts Connected
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                100% Nationwide Upazila Reach
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/50 border border-border/50 shadow-2xs">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
                <ShieldCheck className="size-4" />
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  99.4%
                </span>
              </div>
              <p className="text-xs font-bold text-foreground">
                On-Time Delivery SLA
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Guaranteed Line-Haul Dispatch
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/50 border border-border/50 shadow-2xs">
              <div className="flex items-center gap-1.5 text-primary mb-1">
                <Boxes className="size-4" />
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  2.4M+
                </span>
              </div>
              <p className="text-xs font-bold text-foreground">
                Parcels Fulfilled
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Zero Lost Consignments Guarantee
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/50 border border-border/50 shadow-2xs">
              <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                <Clock className="size-4" />
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  18:00
                </span>
              </div>
              <p className="text-xs font-bold text-foreground">
                Daily Hub Cutoff
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Same-Day Highway Linehaul Departure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Featured Logistics Solutions (Strict 4-card grid conforming to Req 3) */}
      <section className="w-full py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
                <Sparkles className="size-3.5" />
                <span>Featured Logistics Solutions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                Engineered for Bangladesh&apos;s Digital Economy
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
                Curated parcel dispatch, temperature-sensitive cold chain, and
                heavy linehaul freight with guaranteed arrival windows and
                transparent pricing.
              </p>
            </div>

            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl font-semibold gap-1.5 self-start md:self-auto shrink-0 hover:bg-primary hover:text-primary-foreground transition-all",
              )}
            >
              <span>Explore All 8 Solutions</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Strict 4-card grid matching Req 3: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                priority={index < 2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Platform Core Capabilities & Technology Features */}
      <section className="w-full py-16 sm:py-24 bg-muted/20 border-y border-border/70 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <Zap className="size-3.5" />
              <span>Technology & Operational Edge</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Built to Eliminate Logistics Blind Spots
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              From laser automated hub sorting to 4-digit recipient OTP codes,
              Waypoint sets a new standard for transport reliability in
              Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4 hover:border-primary/40 transition-colors">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Boxes className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Automated Laser Sorting
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our central Tejgaon gateway sorts up to 45,000 packages per hour
                using omnidirectional barcode scanners, reducing sorting error
                rates to zero.
              </p>
              <div className="pt-2 text-xs font-semibold text-primary flex items-center gap-1">
                <span>45,000 parcels/hour intake</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4 hover:border-primary/40 transition-colors">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Truck className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Highway Line-Haul Corridors
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Dedicated GPS-monitored fleet departures linking Dhaka,
                Chittagong, Sylhet, Bogra, and Khulna cross-dock terminals every
                evening.
              </p>
              <div className="pt-2 text-xs font-semibold text-primary flex items-center gap-1">
                <span>Nightly line-haul schedules</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4 hover:border-primary/40 transition-colors">
              <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                1% COD & Next-Day BEFTN
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Transparent 1% Cash on Delivery collection fee. Remittances are
                settled the following business day via bank BEFTN or merchant
                mobile wallets.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>Automated 24h bank settlement</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4 hover:border-primary/40 transition-colors">
              <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                4-Digit Delivery OTP Handshake
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Parcels are only marked delivered when the courier inputs the
                recipient&apos;s unique 4-digit SMS code, eliminating false
                claims and misdeliveries.
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-500 flex items-center gap-1">
                <span>Zero false-drop guarantees</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4 hover:border-primary/40 transition-colors">
              <div className="size-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Snowflake className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Calibrated Cold-Chain Vaults
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Precision active thermal containers maintaining 2°C to 8°C for
                biomedical and perishable freight across all division cross-dock
                hubs.
              </p>
              <div className="pt-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <span>Continuous thermal telemetry</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4 hover:border-primary/40 transition-colors">
              <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Bot className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Waypoint AI Logistics Copilot
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Instant natural-language routing guidance, rate calculations,
                and consignment status inquiries powered by our specialized
                domain model.
              </p>
              <div className="pt-2 text-xs font-semibold text-indigo-500 flex items-center gap-1">
                <span>Available 24/7 across the site</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Interactive 4-Step Consignment Workflow Stepper */}
      <section className="w-full py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <Layers className="size-3.5" />
              <span>Full Custody Lifecycle</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How Consignments Move Through Waypoint
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Every parcel moves through a rigid 9-stage finite state machine
              logged across physical scan points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                title: "Consignment Booking",
                badge: "Merchant Portal",
                desc: "Create shipping manifests, generate compliant barcode thermal labels, and declare COD amounts.",
              },
              {
                step: "02",
                title: "Hub Intake & Sorting",
                badge: "Origin Node Scan",
                desc: "Parcels are collected by dispatch riders, weighed, scanned, and routed into destination highway cages.",
              },
              {
                step: "03",
                title: "Highway Line-Haul",
                badge: "Inter-District",
                desc: "GPS-monitored linehaul fleet departures travel overnight connecting divisional cross-docks by morning.",
              },
              {
                step: "04",
                title: "OTP Delivery & Settlement",
                badge: "Secure Handshake",
                desc: "Courier collects cash, verifies recipient 4-digit SMS OTP code, and triggers instant payout credit.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center space-y-3"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-black text-primary shadow-xs border border-primary/20 relative z-10 font-mono">
                  {item.step}
                </div>
                {/* Connecting Line (desktop only) */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border/80 -z-0" />
                )}
                <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {item.badge}
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed px-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: AI Smart Route & Fare Estimator Widget */}
      <section className="w-full py-16 sm:py-24 bg-muted/30 border-y border-border/70 relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <Sparkles className="size-3.5" />
              <span>Transparent Shipping Calculator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Calculate Shipping Rates & SLAs Instantly
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Adjust package weight and select origin/destination districts for
              real-time fare quotes.
            </p>
          </div>

          <FareEstimatorWidget />
        </div>
      </section>

      {/* SECTION 7: Nationwide 64-District Hub Network Highlights */}
      <section className="w-full py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
                <Building2 className="size-3.5" />
                <span>64-District Hub Network</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Nationwide Gateway Infrastructure
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
                Strategically positioned divisional cross-docks and district
                intake centers guaranteeing standard 18:00 daily cutoff times.
              </p>
            </div>

            <Link
              href="/hubs"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl font-semibold gap-1.5 self-start md:self-auto shrink-0 hover:bg-primary hover:text-primary-foreground transition-all",
              )}
            >
              <span>View All 64 Hub Details</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <HubsHighlightTabs />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="w-full py-16 sm:py-24 bg-muted/20 border-t border-border/70">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <Sparkles className="size-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Everything you need to know about delivery OTP verification, COD
              settlement schedules, and 64-district pickup cutoffs.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* Enterprise Dispatch Partner Signup CTA Banner */}
      <section className="w-full py-20 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-primary/30 bg-linear-to-br from-primary/15 via-card to-background p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-xl overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 size-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Waypoint Enterprise & Commercial Fleet</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground max-w-3xl mx-auto">
              Ready to Upgrade Your Delivery Velocity?
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of retailers, corporate suppliers, and independent
              dispatch riders operating on Bangladesh&apos;s most reliable
              waypoint logistics network.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "rounded-xl font-bold shadow-lg gap-2 w-full sm:w-auto px-8",
                )}
              >
                <span>Create Merchant Account</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl font-semibold w-full sm:w-auto px-8 bg-card/60 backdrop-blur-sm hover:bg-accent",
                )}
              >
                <PhoneCall className="size-4 text-primary" />
                <span>Contact Enterprise Sales</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
