"use client";

import * as React from "react";
import { CreditCard, Banknote, PieChart, ShieldCheck } from "lucide-react";
import type { RevenueSummary } from "@/types";
import { cn } from "@/lib/utils";

interface RevenueCompositionChartProps {
  summary: RevenueSummary;
}

export function RevenueCompositionChart({ summary }: RevenueCompositionChartProps) {
  const cardPct = summary.cardPercentage;
  const codPct = summary.codPercentage;

  // Donut geometry constants
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const cardOffset = 0;
  const cardDash = (cardPct / 100) * circumference;

  const codDash = (codPct / 100) * circumference;
  const codOffset = -cardDash;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <PieChart className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Revenue Stream Mix</h3>
            <p className="text-xs text-muted-foreground">Prepaid Card vs Cash on Delivery Share</p>
          </div>
        </div>
      </div>

      {/* SVG Donut Illustration */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        <div className="relative size-44 flex items-center justify-center shrink-0">
          <svg className="size-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-muted/40 fill-none"
              strokeWidth={strokeWidth}
            />

            {/* Card Slice (Emerald) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
              strokeWidth={strokeWidth}
              strokeDasharray={`${cardDash} ${circumference}`}
              strokeDashoffset={cardOffset}
              strokeLinecap="round"
            />

            {/* COD Slice (Amber) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-amber-500 fill-none transition-all duration-1000 ease-out"
              strokeWidth={strokeWidth}
              strokeDasharray={`${codDash} ${circumference}`}
              strokeDashoffset={codOffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Stat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Net Total
            </span>
            <span className="text-lg font-black font-mono text-foreground">
              ৳{(summary.totalRevenue / 1000).toFixed(1)}k
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              {summary.netMargin}% Margin
            </span>
          </div>
        </div>

        {/* Legend & Breakdown stats */}
        <div className="w-full sm:w-auto flex-1 space-y-3 text-xs">
          {/* Card Stream */}
          <div className="p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CreditCard className="size-3.5" />
                <span>Card (Stripe)</span>
              </div>
              <span className="font-mono text-foreground font-black">{cardPct}%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Earnings: ৳{summary.cardEarnings.toLocaleString()}</span>
              <span>Online Escrow</span>
            </div>
          </div>

          {/* COD Stream */}
          <div className="p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Banknote className="size-3.5" />
                <span>COD Yield</span>
              </div>
              <span className="font-mono text-foreground font-black">{codPct}%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Earnings: ৳{summary.codEarnings.toLocaleString()}</span>
              <span>1% Fee + Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
