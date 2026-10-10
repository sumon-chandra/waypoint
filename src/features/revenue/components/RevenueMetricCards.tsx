"use client";

import * as React from "react";
import {
  Banknote,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Building2,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AdminRevenueDetail } from "@/types";
import { cn } from "@/lib/utils";

interface RevenueMetricCardsProps {
  data: AdminRevenueDetail;
  isLoading?: boolean;
}

export function RevenueMetricCards({
  data,
  isLoading,
}: RevenueMetricCardsProps) {
  const summary = data?.summary || {
    totalRevenue: 0,
    cardEarnings: 0,
    codEarnings: 0,
    cardPercentage: 50,
    codPercentage: 50,
    gatewayFees: 0,
    netMargin: 93,
  };

  const codCashFlow = data?.codCashFlow || {
    grossCodCollected: 0,
    courierCashInHand: 0,
    remittedToHubs: 0,
    pendingMerchantPayables: 0,
    settledToMerchants: 0,
  };

  const hasCourierRisk = (codCashFlow.courierCashInHand ?? 0) > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* CARD 1: Total Platform Earnings */}
      <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-card p-5 shadow-xs space-y-3 transition-all hover:border-primary/40 hover:shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Net Earnings
          </span>
          <div className="size-9 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
            <TrendingUp className="size-4" />
          </div>
        </div>

        <div>
          <p className="text-2xl font-black text-foreground font-mono tracking-tight">
            {isLoading ? "—" : `৳${(summary.totalRevenue ?? 0).toLocaleString()}`}
          </p>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Card: ৳{(summary.cardEarnings ?? 0).toLocaleString()}</span>
            <span>•</span>
            <span>COD: ৳{(summary.codEarnings ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Earnings from Card (Stripe) */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Prepaid Card (Stripe)
          </span>
          <div className="size-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CreditCard className="size-4" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-foreground font-mono tracking-tight">
              {isLoading ? "—" : `৳${(summary.cardEarnings ?? 0).toLocaleString()}`}
            </p>
            <Badge
              variant="outline"
              className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
            >
              {summary.cardPercentage ?? 50}%
            </Badge>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Gateway Fees: ৳{(summary.gatewayFees ?? 0).toLocaleString()}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Instant Escrow
            </span>
          </div>
        </div>
      </div>

      {/* CARD 3: Earnings from COD */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            COD Platform Yield
          </span>
          <div className="size-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Banknote className="size-4" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-foreground font-mono tracking-tight">
              {isLoading ? "—" : `৳${(summary.codEarnings ?? 0).toLocaleString()}`}
            </p>
            <Badge
              variant="outline"
              className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
            >
              {summary.codPercentage ?? 50}%
            </Badge>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Delivery Fees + 1% Comm.</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
              Post-Delivery
            </span>
          </div>
        </div>
      </div>

      {/* CARD 4: Courier Cash-in-Hand Risk Float */}
      <div
        className={cn(
          "rounded-3xl border p-5 shadow-xs space-y-3 transition-all hover:shadow-md",
          hasCourierRisk
            ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
            : "border-border/80 bg-card hover:border-border"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Courier Cash-in-Hand
          </span>
          <div
            className={cn(
              "size-9 rounded-2xl flex items-center justify-center border",
              hasCourierRisk
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            <AlertTriangle className="size-4" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-foreground font-mono tracking-tight">
              {isLoading
                ? "—"
                : `৳${(codCashFlow.courierCashInHand ?? 0).toLocaleString()}`}
            </p>
            {hasCourierRisk && (
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/15 animate-pulse"
              >
                Risk Float
              </Badge>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Door Cash with Riders</span>
            <span
              className={cn(
                "font-semibold",
                hasCourierRisk
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              )}
            >
              {hasCourierRisk ? "Pending Hub Deposit" : "All Remitted"}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 5: COD Settlement & Escrow Reconciliation */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            COD Cash Escrow
          </span>
          <div className="size-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Building2 className="size-4" />
          </div>
        </div>

        <div>
          <p className="text-2xl font-black text-foreground font-mono tracking-tight">
            {isLoading
              ? "—"
              : `৳${(codCashFlow.grossCodCollected ?? 0).toLocaleString()}`}
          </p>
          <div className="mt-2 pt-2 border-t border-border/50 space-y-1 text-[11px] text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Remitted to Hubs:</span>
              <span className="font-mono font-semibold text-foreground">
                ৳{(codCashFlow.remittedToHubs ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Merchant Payables:</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                ৳{(codCashFlow.pendingMerchantPayables ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
