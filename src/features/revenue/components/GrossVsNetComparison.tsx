"use client";

import * as React from "react";
import { Scale, ArrowRight, ShieldCheck, Banknote, AlertTriangle } from "lucide-react";
import type { CodCashFlow, RevenueSummary } from "@/types";
import { Badge } from "@/components/ui/badge";

interface GrossVsNetComparisonProps {
  codCashFlow: CodCashFlow;
  summary: RevenueSummary;
}

export function GrossVsNetComparison({ codCashFlow, summary }: GrossVsNetComparisonProps) {
  const gross = codCashFlow.grossCodCollected || 1;
  const netEarnings = summary.codEarnings;
  const takeRate = ((netEarnings / gross) * 100).toFixed(1);

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

        <Badge variant="outline" className="text-xs font-mono font-bold text-primary border-primary/30 bg-primary/10">
          {takeRate}% Platform Take Rate
        </Badge>
      </div>

      {/* Visual Volume Comparison Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Cash Flow Composition</span>
          <span className="font-mono text-foreground">
            Total Handled: ৳{codCashFlow.grossCodCollected.toLocaleString()}
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-4 w-full rounded-full bg-muted/60 overflow-hidden flex">
          {/* Remitted to Hubs */}
          <div
            className="bg-emerald-500 transition-all"
            style={{
              width: `${(codCashFlow.remittedToHubs / gross) * 100}%`,
            }}
            title={`Remitted to Hubs: ৳${codCashFlow.remittedToHubs.toLocaleString()}`}
          />
          {/* Merchant Payables */}
          <div
            className="bg-indigo-500 transition-all"
            style={{
              width: `${(codCashFlow.pendingMerchantPayables / gross) * 100}%`,
            }}
            title={`Merchant Payables: ৳${codCashFlow.pendingMerchantPayables.toLocaleString()}`}
          />
          {/* Courier Float */}
          <div
            className="bg-amber-500 transition-all"
            style={{
              width: `${(codCashFlow.courierCashInHand / gross) * 100}%`,
            }}
            title={`Courier Float: ৳${codCashFlow.courierCashInHand.toLocaleString()}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Remitted to Hubs (৳{codCashFlow.remittedToHubs.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-indigo-500" />
            <span>Merchant Payables (৳{codCashFlow.pendingMerchantPayables.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            <span>Courier Street Float (৳{codCashFlow.courierCashInHand.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Comparative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Gross Physical Cash Handled
          </span>
          <p className="text-xl font-black font-mono text-foreground">
            ৳{codCashFlow.grossCodCollected.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Recipient doorstep currency handled by couriers and sorting hubs.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Retained Platform Earnings
          </span>
          <p className="text-xl font-black font-mono text-primary">
            ৳{summary.codEarnings.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Delivery fees + 1% COD handling commission retained after merchant escrow.
          </p>
        </div>
      </div>
    </div>
  );
}
