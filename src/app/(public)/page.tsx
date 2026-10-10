import Link from "next/link";
import { ArrowRight, ShieldCheck, MapPin, Truck, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-linear-to-b from-primary/5 via-background to-background py-20 md:py-28 lg:py-32">
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

      {/* How it Works Section */}
      <section className="w-full py-16 sm:py-24 bg-background relative overflow-hidden">
        {/* Ambient background blob */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Seamless Delivery Workflow
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              From order creation to final drop-off, our platform ensures
              complete transparency and efficiency every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Book Parcel",
                desc: "Merchants create a shipment request via the intuitive dashboard.",
              },
              {
                step: "02",
                title: "Hub Processing",
                desc: "Parcels are collected, scanned, and routed through our smart hubs.",
              },
              {
                step: "03",
                title: "Live Transit",
                desc: "Real-time GPS tracking keeps both sender and receiver informed.",
              },
              {
                step: "04",
                title: "Secure Delivery",
                desc: "OTP-verified handoffs and instant COD settlement.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center space-y-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary shadow-sm border border-primary/20 relative z-10">
                  {item.step}
                </div>
                {/* Connecting Line (hidden on mobile) */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border/70 -z-10" />
                )}
                <h3 className="text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed px-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 sm:py-24 bg-muted/30 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trusted by Top Merchants
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              See what our partners are saying about the Waypoint experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Waypoint completely transformed our e-commerce fulfillment. The live tracking gives our customers peace of mind, and the COD settlements are lightning fast.",
                name: "Sarah Ahmed",
                role: "Founder, TechGear BD",
              },
              {
                quote:
                  "As a courier, the app makes my day so much easier. The routed lists and easy OTP verification mean I spend less time waiting and more time delivering.",
                name: "Rafiqul Islam",
                role: "Top Tier Rider",
              },
              {
                quote:
                  "The hub infrastructure is incredibly robust. Even during peak Eid seasons, we rarely see any bottlenecks or lost parcels. A true game changer.",
                name: "Tanzim Hasan",
                role: "Operations Manager, FashioNova",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs relative"
              >
                <div className="text-4xl text-primary/20 font-serif absolute top-4 left-4">
                  "
                </div>
                <p className="text-sm text-foreground leading-relaxed relative z-10 mt-4 italic">
                  {testimonial.quote}
                </p>
                <div className="mt-6 pt-4 border-t border-border/50">
                  <p className="text-sm font-bold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-primary/5 -z-10" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Ready to upgrade your logistics?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses and independent riders who rely on
            Waypoint for seamless, secure, and rapid deliveries every single
            day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-xl font-bold shadow-lg gap-2 w-full sm:w-auto px-8",
              )}
            >
              <span>Create an Account</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl font-semibold w-full sm:w-auto px-8 bg-background/50 backdrop-blur-sm",
              )}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
