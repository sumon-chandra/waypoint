"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Boxes,
  Truck,
  CheckCircle2,
  Calendar,
  Lock,
  PhoneCall,
  Scale,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceItem, LOGISTICS_SERVICES } from "../data/services-data";
import { ServiceCard } from "./ServiceCard";
import { cn } from "@/lib/utils";

interface ServiceDetailsViewProps {
  service: ServiceItem;
}

export function ServiceDetailsView({ service }: ServiceDetailsViewProps) {
  // Multi-image gallery state
  const allImages = React.useMemo(() => {
    return [service.image, ...service.gallery.filter((img) => img !== service.image)];
  }, [service]);

  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  // Related services (excluding current)
  const relatedServices = React.useMemo(() => {
    return LOGISTICS_SERVICES.filter((s) => s.id !== service.id).slice(0, 4);
  }, [service.id]);

  return (
    <div className="flex flex-col space-y-16 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/services" className="hover:text-foreground transition-colors">
            Services
          </Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-foreground truncate">{service.title}</span>
        </nav>
      </div>

      {/* Main Top Showcase Section: Gallery (Left) + Primary Service Summary (Right) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Multi-Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Image Display */}
            <div className="relative w-full aspect-16/10 rounded-3xl overflow-hidden border border-border/80 bg-muted/60 shadow-lg group">
              <Image
                src={allImages[activeImageIndex] || service.image}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-102"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-background/90 text-foreground backdrop-blur-md border border-border/60 shadow-xs">
                  <Sparkles className="size-3 text-amber-500" />
                  <span>{service.badge}</span>
                </span>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-xs">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>{service.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-white/70 font-normal">
                    ({service.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Bottom Tagline Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <p className="text-sm font-semibold text-white/95 drop-shadow-md">
                  {service.tagline}
                </p>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {allImages.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer shadow-xs",
                        isActive
                          ? "border-primary ring-2 ring-primary/30 scale-102"
                          : "border-border/70 opacity-70 hover:opacity-100 hover:border-primary/40"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`${service.title} thumbnail ${idx + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Service Highlights & Action Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-md backdrop-blur-md space-y-6">
              {/* Category & Badge */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-semibold px-3 py-1 text-primary border-primary/30 bg-primary/5">
                  {service.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Clock className="size-3.5 text-primary" />
                  <span>{service.sla} SLA</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {service.title}
                </h1>
                <p className="text-xs sm:text-sm text-primary font-medium">
                  {service.tagline}
                </p>
              </div>

              {/* Price Banner */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Commercial Rate
                  </p>
                  <p className="text-2xl font-black text-primary font-mono mt-0.5">
                    {service.priceDisplay}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-3.5" />
                    <span>Free Insurance</span>
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Coverage up to ৳5,000
                  </p>
                </div>
              </div>

              {/* Key Highlights Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-border/60">
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Service Inclusions:
                </p>
                <div className="space-y-2">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <Link
                  href={`/customer/book?service=${service.id}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "w-full rounded-2xl h-12 font-bold shadow-md gap-2 cursor-pointer text-sm"
                  )}
                >
                  <span>Book Consignment Now</span>
                  <ArrowRight className="size-4" />
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/pricing"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "default" }),
                      "rounded-xl text-xs font-semibold justify-center"
                    )}
                  >
                    Calculate Fare
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "default" }),
                      "rounded-xl text-xs font-medium justify-center text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Enterprise Quote
                  </Link>
                </div>
              </div>

              {/* Security & Support Guarantee */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                <span className="flex items-center gap-1">
                  <Lock className="size-3 text-emerald-500" />
                  <span>4-Digit Recipient OTP</span>
                </span>
                <span className="flex items-center gap-1">
                  <PhoneCall className="size-3 text-primary" />
                  <span>09612-WAYPOINT</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description & Operational Overview Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Operational Overview & Logistics Flow
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              How Waypoint executes this delivery tier from intake to final drop-off.
            </p>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {service.longDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1.5">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Scale className="size-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground">Intake & Weighbridge</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Automated laser cubing and electronic scale recording ensure fair, exact billing.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1.5">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Truck className="size-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground">Scheduled Linehaul</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Fixed highway departures connect central cross-docks overnight without holding bottlenecks.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1.5">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Lock className="size-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground">OTP Handshake</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Parcels are only released when the recipient provides the unique 4-digit SMS OTP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Information & Specifications Table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Technical Specifications & SLA Parameters
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Guaranteed operational standards enforced across all 64 district facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border/70 p-4 space-y-1 bg-muted/20">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Maximum Weight
              </p>
              <p className="text-sm font-bold text-foreground">{service.specifications.maxWeight}</p>
            </div>

            <div className="rounded-2xl border border-border/70 p-4 space-y-1 bg-muted/20">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Volumetric Formula
              </p>
              <p className="text-sm font-bold text-foreground font-mono">
                {service.specifications.volumetricFormula}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 p-4 space-y-1 bg-muted/20">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Intake Cutoff Time
              </p>
              <p className="text-sm font-bold text-primary font-mono">
                {service.specifications.pickupCutoff}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 p-4 space-y-1 bg-muted/20">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Guaranteed SLA
              </p>
              <p className="text-sm font-bold text-foreground font-mono">
                {service.specifications.transitWindow}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 p-4 space-y-1 bg-muted/20">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Insurance Coverage
              </p>
              <p className="text-sm font-bold text-foreground">
                {service.specifications.insuranceCoverage}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 p-4 space-y-1 bg-muted/20">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Telemetry Frequency
              </p>
              <p className="text-sm font-bold text-foreground">
                {service.specifications.trackingUpdateFreq}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 p-4 space-y-1 bg-muted/20">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Security Protocol
              </p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {service.specifications.securityVerification}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 p-4 space-y-1 bg-muted/20">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Conveyor Handling
              </p>
              <p className="text-sm font-bold text-foreground">
                {service.specifications.handlingType}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Rating Breakdown Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Customer Reviews & Verified Feedback
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Real testimonials from merchants and logistics managers using this service.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-muted/20 border border-border/60">
            <div className="md:col-span-4 text-center md:text-left space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-foreground font-mono">
                {service.rating.toFixed(1)}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on <strong>{service.reviewCount}</strong> verified merchant shipments
              </p>
            </div>

            {/* Score Breakdown Bars */}
            <div className="md:col-span-8 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="w-12 text-right">5 Star</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[92%]" />
                </div>
                <span className="w-8 text-right font-mono">92%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-right">4 Star</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[6%]" />
                </div>
                <span className="w-8 text-right font-mono">6%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-right">3 Star</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[2%]" />
                </div>
                <span className="w-8 text-right font-mono">2%</span>
              </div>
            </div>
          </div>

          {/* Individual Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-border/70 p-5 space-y-3 bg-card/60 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{rev.author}</h4>
                    <p className="text-[11px] text-muted-foreground">{rev.company}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &quot;{rev.comment}&quot;
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3" />
                    <span>Verified Merchant</span>
                  </span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services 4-Card Grid (Conforming to Req 3) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Related Delivery Solutions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Complementary logistics tiers often paired with this service.
            </p>
          </div>

          <Link
            href="/services"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Services</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* 4 Cards Per Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedServices.map((rel) => (
            <ServiceCard key={rel.id} service={rel} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ServiceDetailsView;
