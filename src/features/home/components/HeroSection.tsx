"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SAMPLE_TRACKING_CODES = ["TRK-DHK-8821", "TRK-CTG-4482", "TRK-SYL-1029"];

export function HeroSection() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingCode.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    setError(false);
    router.push(`/track/${encodeURIComponent(trimmed)}`);
  };

  const handleSampleClick = (code: string) => {
    setTrackingCode(code);
    router.push(`/track/${encodeURIComponent(code)}`);
  };

  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-primary/10 via-background to-background pt-12 pb-16 md:pt-16 md:pb-20 lg:min-h-[68vh] lg:max-h-[78vh] flex flex-col justify-between">
      {/* Background decorative grid and glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-auto w-full">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Animated 64-District Operational Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md shadow-xs animate-in fade-in duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-wide">
              Waypoint Logistics &bull; Operating in all 64 Districts
            </span>
            <Sparkles className="size-3.5 text-amber-500" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl text-foreground leading-[1.12]">
            Next-Gen Logistics.{" "}
            <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Every Waypoint
            </span>{" "}
            Accounted For.
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
            Nationwide express parcel delivery, automated hub laser sorting, and
            100% OTP-verified doorstep handshakes engineered for
            Bangladesh&apos;s digital commerce.
          </p>

          {/* Interactive Consignment Tracking Input */}
          <div className="w-full max-w-xl pt-1">
            <form
              onSubmit={handleTrackSubmit}
              className={cn(
                "relative flex items-center rounded-2xl border bg-card/90 p-1.5 shadow-lg backdrop-blur-md transition-all duration-200",
                error
                  ? "border-destructive ring-2 ring-destructive/20"
                  : "border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
              )}
            >
              <div className="pl-3.5 pr-2 text-muted-foreground">
                <Search className="size-4.5 text-primary" />
              </div>
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => {
                  setTrackingCode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter Consignment or Tracking # (e.g. TRK-DHK-8821)"
                aria-label="Track consignment code"
                className="w-full bg-transparent px-2 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer shrink-0"
              >
                <span>Track</span>
                <ArrowRight className="size-3.5" />
              </button>
            </form>

            {/* Quick Sample Tracking Codes Chips */}
            {/* <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 text-[11px] text-muted-foreground">
              <span className="font-medium">Live samples:</span>
              {SAMPLE_TRACKING_CODES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSampleClick(code)}
                  className="rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  {code}
                </button>
              ))}
            </div> */}
          </div>

          {/* Dual Action Buttons with hover micro-animations */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-xl font-semibold shadow-md gap-2 group transition-all duration-200 hover:-translate-y-0.5",
              )}
            >
              <Truck className="size-4" />
              <span>Explore Logistics Catalog</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/customer/book"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl font-medium bg-card/60 backdrop-blur-sm hover:bg-accent transition-all duration-200 hover:-translate-y-0.5",
              )}
            >
              <Zap className="size-4 text-primary" />
              <span>Book Parcel Now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Scroll Cue */}
      <div className="relative pt-4 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70">
          Scroll to Explore Solutions
        </span>
        <ChevronDown className="size-4 text-muted-foreground/70 animate-bounce mt-0.5" />
      </div>
    </section>
  );
}
