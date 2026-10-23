"use client";

import * as React from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Clock, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DISTRICTS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Bogra",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Jessore",
  "Cox's Bazar",
];

export function FareEstimatorWidget() {
  const [weight, setWeight] = React.useState<number>(2);
  const [origin, setOrigin] = React.useState<string>("Dhaka");
  const [destination, setDestination] = React.useState<string>("Chittagong");
  const [serviceTier, setServiceTier] = React.useState<"express" | "same-day" | "freight">("express");

  const isIntraCity = origin === destination;

  // Real-time calculation logic
  const calculatedFare = React.useMemo(() => {
    if (serviceTier === "same-day") {
      // Same-day metro
      if (!isIntraCity) return null; // Only available intra-city
      return 120 + Math.max(0, weight - 1) * 35;
    }

    if (serviceTier === "freight") {
      // Bulk Freight (50kg min or heavy)
      const baseFreight = isIntraCity ? 250 : 380;
      return baseFreight + weight * 15;
    }

    // Standard Express
    if (isIntraCity) {
      return 60 + Math.max(0, weight - 1) * 20;
    } else {
      return 110 + Math.max(0, weight - 1) * 35;
    }
  }, [weight, origin, destination, serviceTier, isIntraCity]);

  const estimatedSLA = React.useMemo(() => {
    if (serviceTier === "same-day") return "4 - 8 Hours Rush";
    if (isIntraCity) return "12 - 18 Hours";
    return "18 - 24 Hours Nationwide";
  }, [serviceTier, isIntraCity]);

  return (
    <div className="rounded-3xl border border-primary/20 bg-card/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-2 text-xs font-bold text-primary mb-6">
        <Sparkles className="size-4" />
        <span>Instant Shipping Fare & SLA Estimator</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Controls Column */}
        <div className="md:col-span-7 space-y-5">
          {/* Service Tier Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Service Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setServiceTier("express")}
                className={cn(
                  "p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center",
                  serviceTier === "express"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/50 border-border/70 text-muted-foreground hover:text-foreground"
                )}
              >
                Express Next-Day
              </button>
              <button
                type="button"
                onClick={() => setServiceTier("same-day")}
                className={cn(
                  "p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center",
                  serviceTier === "same-day"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/50 border-border/70 text-muted-foreground hover:text-foreground"
                )}
              >
                Same-Day Rush
              </button>
              <button
                type="button"
                onClick={() => setServiceTier("freight")}
                className={cn(
                  "p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center",
                  serviceTier === "freight"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/50 border-border/70 text-muted-foreground hover:text-foreground"
                )}
              >
                Heavy Freight
              </button>
            </div>
          </div>

          {/* Origin & Destination Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <MapPin className="size-3 text-primary" />
                <span>Pickup District</span>
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer font-medium"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <MapPin className="size-3 text-emerald-500" />
                <span>Delivery District</span>
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer font-medium"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Weight Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Consignment Gross Weight:</span>
              <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {weight} kg
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>1 kg</span>
              <span>10 kg</span>
              <span>20 kg</span>
              <span>30 kg</span>
            </div>
          </div>
        </div>

        {/* Calculated Result Card Column */}
        <div className="md:col-span-5 rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-background to-sky-500/5 p-6 space-y-5 text-center sm:text-left">
          {serviceTier === "same-day" && !isIntraCity ? (
            <div className="space-y-2 py-4">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Same-Day is for Intra-City Only
              </p>
              <p className="text-[11px] text-muted-foreground">
                Origin and Destination must be the same metro area for same-day rush couriers. Please select Express Next-Day for inter-district consignments.
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Estimated Shipping Rate
                </p>
                <div className="flex items-baseline gap-1 mt-1 justify-center sm:justify-start">
                  <span className="text-3xl sm:text-4xl font-black text-primary font-mono">
                    ৳{calculatedFare?.toLocaleString() ?? 0}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">BDT</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    <span>Estimated SLA:</span>
                  </span>
                  <strong className="text-foreground">{estimatedSLA}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                    <span>Transit Insurance:</span>
                  </span>
                  <strong className="text-emerald-600 dark:text-emerald-400">Included (Free)</strong>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/customer/book?origin=${origin}&destination=${destination}&weight=${weight}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "default" }),
                    "w-full rounded-xl font-bold shadow-md gap-1.5 text-xs justify-center cursor-pointer"
                  )}
                >
                  <span>Book Consignment Now</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FareEstimatorWidget;
