"use client";

import * as React from "react";
import {
  Banknote,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Scale,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
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

export function RevenueMetricCards({ data, isLoading }: RevenueMetricCardsProps) {
  const { summary, codCashFlow } = data;

  const hasCourierRisk = codCashFlow.courierCashInHand > 0;

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
            {isLoading ? "—" : `৳${summary.totalRevenue.toLocaleString()}`}
          </p>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Card: ৳{summary.cardEarnings.toLocaleString()}</span>
            <span>•</span>
            <span>COD: ৳{summary.codEarnings.toLocaleString()}</span>
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
              {isLoading ? "—" : `৳${summary.cardEarnings.toLocaleString()}`}
            </p>
            <Badge
              variant="outline"
              className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
            >
              {summary.cardPercentage}%
            </Badge>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Gateway Fees: ৳{summary.gatewayFees.toLocaleString()}</span>
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
              {isLoading ? "—" : `৳${summary.codEarnings.toLocaleString()}`}
            </p>
            <Badge
              variant="outline"
              className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
            >
              {summary.codPercentage}%
            </Badge>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Shipping Fees + 1% Commission</span>
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
              {isLoading ? "—" : `৳${codCashFlow.courierCashInHand.toLocaleString()}`}
            </p>
            {hasCourierRisk && (
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/15"
              >
                Unremitted Float
              </Badge>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {hasCourierRisk
                ? "Active courier street liability"
                : "All courier cash remitted to hubs"}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 5: COD Settlement & Escrow Reconciliation */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Escrow Reconciliation
          </span>
          <div className="size-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Scale className="size-4" />
          </div>
        </div>

        <div>
          <p className="text-2xl font-black text-foreground font-mono tracking-tight">
            {isLoading ? "—" : `৳${codCashFlow.grossCodCollected.toLocaleString()}`}
          </p>
          <div className="mt-2 pt-2 border-t border-border/50 space-y-1 text-[11px] text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Remitted to Hubs:</span>
              <span className="font-mono font-semibold text-foreground">
                ৳{codCashFlow.remittedToHubs.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Merchant Payables:</span>
              <span className="font-mono font-semibold text-foreground">
                ৳{codCashFlow.pendingMerchantPayables.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
