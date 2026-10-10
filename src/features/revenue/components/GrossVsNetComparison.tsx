"use client";

import * as React from "react";
import { Scale } from "lucide-react";
import type { CodCashFlow, RevenueSummary } from "@/types";
import { Badge } from "@/components/ui/badge";

interface GrossVsNetComparisonProps {
  codCashFlow?: CodCashFlow;
  summary?: RevenueSummary;
}

export function GrossVsNetComparison({
  codCashFlow,
  summary,
}: GrossVsNetComparisonProps) {
  const gross = codCashFlow?.grossCodCollected || 1;
  const netEarnings = summary?.codEarnings ?? 0;
  const takeRate = ((netEarnings / gross) * 100).toFixed(1);

  const remitted = codCashFlow?.remittedToHubs ?? 0;
  const payables = codCashFlow?.pendingMerchantPayables ?? 0;
  const settled = codCashFlow?.settledToMerchants ?? 0;
  const grossDisplay = codCashFlow?.grossCodCollected ?? 0;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Scale className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Gross Cash Handled vs Real Platform Earnings
            </h3>
            <p className="text-xs text-muted-foreground">
              Total physical liquidity processed versus net captured revenue
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className="text-xs font-mono font-bold text-primary border-primary/30 bg-primary/10"
        >
          {takeRate}% Platform Take Rate
        </Badge>
      </div>

      {/* Visual Volume Comparison Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Cash Flow Composition</span>
          <span className="font-mono text-foreground">
            Total Handled: ৳{grossDisplay.toLocaleString()}
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-4 w-full rounded-full bg-muted/60 overflow-hidden flex">
          {/* Remitted to Hubs */}
          <div
            className="bg-emerald-500 transition-all"
            style={{
              width: `${Math.min(100, (remitted / gross) * 100)}%`,
            }}
            title={`Remitted to Hubs: ৳${remitted.toLocaleString()}`}
          />
          {/* Merchant Payables */}
          <div
            className="bg-blue-500 transition-all"
            style={{
              width: `${Math.min(100, (payables / gross) * 100)}%`,
            }}
            title={`Pending Merchant Payables: ৳${payables.toLocaleString()}`}
          />
          {/* Real Platform Earning */}
          <div
            className="bg-amber-500 transition-all"
            style={{
              width: `${Math.min(100, (netEarnings / gross) * 100)}%`,
            }}
            title={`Captured Platform Margin: ৳${netEarnings.toLocaleString()}`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Remitted to Hubs (৳{remitted.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-blue-500 shrink-0" />
            <span>Merchant Escrow (৳{payables.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>Platform Take (৳{netEarnings.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Reconciliation Card Footnote */}
      <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1.5 text-xs">
        <div className="flex items-center justify-between font-bold text-foreground">
          <span>Total Merchant Settlements Released:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">
            ৳{settled.toLocaleString()}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Recipients pay full COD amounts at the door, which are held in escrow
          at sorting hubs until reconciled and disbursed directly to merchants.
        </p>
      </div>
    </div>
  );
}
