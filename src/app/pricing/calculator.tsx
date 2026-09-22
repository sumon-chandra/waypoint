"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Truck,
  Check,
  Banknote,
  RotateCcw,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sampleDistricts = [
  "Dhaka",
  "Gazipur",
  "Narayanganj",
  "Chittagong",
  "Cox's Bazar",
  "Sylhet",
  "Rajshahi",
  "Bogra",
  "Khulna",
  "Jessore",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Noakhali",
  "Dinajpur",
];

export function RateCalculator() {
  const [origin, setOrigin] = React.useState("Dhaka");
  const [destination, setDestination] = React.useState("Chittagong");
  const [weight, setWeight] = React.useState<number>(1);
  const [speed, setSpeed] = React.useState<"standard" | "express" | "same-day">("express");
  const [isCod, setIsCod] = React.useState(true);
  const [codAmount, setCodAmount] = React.useState<number>(1500);

  const isIntraCity = origin.toLowerCase() === destination.toLowerCase();

  // Price calculations based on Bangladesh logistics standard
  const baseRate = isIntraCity ? 60 : 110;
  
  // Speed surcharge
  const speedSurcharge =
    speed === "same-day"
      ? (isIntraCity ? 70 : 120)
      : speed === "express"
      ? (isIntraCity ? 25 : 35)
      : 0;

  // Additional weight over 1kg: ৳15/kg for intra-city, ৳25/kg for inter-district
  const additionalWeightKg = Math.max(0, weight - 1);
  const weightSurcharge = Math.ceil(additionalWeightKg * (isIntraCity ? 15 : 25));

  // COD fee: 1% of COD amount (min ৳10 if COD enabled)
  const codFee = isCod ? Math.max(10, Math.round(codAmount * 0.01)) : 0;

  const totalCost = baseRate + speedSurcharge + weightSurcharge + codFee;

  const eta =
    speed === "same-day"
      ? "Today (Within 6-8 Hours)"
      : speed === "express"
      ? (isIntraCity ? "Within 12 Hours" : "Tomorrow by 4:00 PM")
      : (isIntraCity ? "Within 24 Hours" : "2 to 3 Business Days");

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calculator className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Interactive Rate Calculator</h3>
            <p className="text-xs text-muted-foreground">
              Calculate instant transparent shipping fare across all 64 districts.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
          Live BDT (৳)
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Origin District
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background/80 px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {sampleDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Destination District
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background/80 px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {sampleDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">Parcel Weight:</span>
              <span className="text-primary font-mono font-bold">{weight} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {[0.5, 1, 2, 5, 10, 20].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeight(w)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                    weight === w
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border/80 bg-muted/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {w} kg
                </button>
              ))}
            </div>
          </div>

          {/* Speed Tier */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Delivery Speed Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSpeed("standard")}
                className={cn(
                  "p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer",
                  speed === "standard"
                    ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary"
                    : "border-border/80 bg-background/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <Clock className="size-4 mb-1 text-primary" />
                <span className="text-xs font-bold text-foreground">Standard</span>
                <span className="text-[10px] text-muted-foreground">48-72h</span>
              </button>

              <button
                type="button"
                onClick={() => setSpeed("express")}
                className={cn(
                  "p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer",
                  speed === "express"
                    ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary"
                    : "border-border/80 bg-background/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <Zap className="size-4 mb-1 text-primary" />
                <span className="text-xs font-bold text-foreground">Express</span>
                <span className="text-[10px] text-muted-foreground">12-24h</span>
              </button>

              <button
                type="button"
                onClick={() => setSpeed("same-day")}
                className={cn(
                  "p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer",
                  speed === "same-day"
                    ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary"
                    : "border-border/80 bg-background/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <Truck className="size-4 mb-1 text-primary" />
                <span className="text-xs font-bold text-foreground">Same-Day</span>
                <span className="text-[10px] text-muted-foreground">Intra-city</span>
              </button>
            </div>
          </div>

          {/* Cash on Delivery (COD) Options */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cod-checkbox"
                  checked={isCod}
                  onChange={(e) => setIsCod(e.target.checked)}
                  className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                />
                <label htmlFor="cod-checkbox" className="text-xs font-semibold text-foreground cursor-pointer">
                  Cash on Delivery (COD) Collection
                </label>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400">
                1% COD Fee
              </Badge>
            </div>

            {isCod && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-[11px] text-muted-foreground">
                  Expected Collection Amount (BDT ৳):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-mono">
                    ৳
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={codAmount}
                    onChange={(e) => setCodAmount(Number(e.target.value) || 0)}
                    className="pl-7 h-9 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Summary Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-primary/15 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Estimated Total Fare
              </span>
              <span className="text-2xl sm:text-3xl font-black text-primary font-mono">
                ৳{totalCost}
              </span>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Base Rate ({isIntraCity ? "Intra-District" : "Inter-District"}):</span>
                <span className="font-mono font-medium text-foreground">৳{baseRate}</span>
              </div>
              {weightSurcharge > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Additional Weight (+{additionalWeightKg}kg):</span>
                  <span className="font-mono font-medium text-foreground">৳{weightSurcharge}</span>
                </div>
              )}
              {speedSurcharge > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Speed Tier Surcharge:</span>
                  <span className="font-mono font-medium text-foreground">৳{speedSurcharge}</span>
                </div>
              )}
              {isCod && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>COD Handling (1%):</span>
                  <span className="font-mono font-medium text-foreground">৳{codFee}</span>
                </div>
              )}
            </div>

            {/* Estimated Arrival Banner */}
            <div className="rounded-xl border border-border/80 bg-background/80 p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Guaranteed Arrival Window
              </span>
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" />
                <span>{eta}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "w-full rounded-xl font-semibold shadow-md gap-2"
              )}
            >
              <span>Ship With This Rate</span>
              <ArrowRight className="size-4" />
            </Link>
            <p className="text-[11px] text-center text-muted-foreground">
              Volume discounts apply automatically for merchants shipping 50+ parcels/month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
