"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const shipmentId = searchParams.get("shipment_id");

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!sessionId) return;
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-radial from-emerald-500/10 via-background to-background">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand header */}
        <div className="flex justify-center mb-2">
          <Logo />
        </div>

        {/* Success Card */}
        <div className="rounded-3xl border border-emerald-500/30 bg-card p-6 sm:p-8 shadow-xl backdrop-blur-xl text-center space-y-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="mx-auto size-20 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="size-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>Stripe Payment Confirmed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Payment Successful!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your transaction has been securely authorized and verified. Your consignment is marked as prepaid and scheduled for hub dispatch.
            </p>
          </div>

          {/* Session Details */}
          {sessionId && (
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 text-left space-y-1.5 text-xs">
              <span className="font-semibold text-muted-foreground">Stripe Session ID</span>
              <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-foreground bg-background/80 p-2 rounded-xl border border-border/60">
                <span className="truncate">{sessionId}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Copy session ID"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="space-y-3 pt-2">
            <Link
              href={
                shipmentId
                  ? `/customer/tracking?id=${encodeURIComponent(shipmentId)}`
                  : "/customer/tracking"
              }
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full rounded-xl gap-2 font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
              )}
            >
              <Truck className="size-4" />
              <span>Track Consignment</span>
              <ArrowRight className="size-4" />
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/customer/shipments"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "rounded-xl gap-1.5 font-medium"
                )}
              >
                <Package className="size-4" />
                <span>My Shipments</span>
              </Link>

              <Link
                href="/customer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "rounded-xl gap-1.5 font-medium"
                )}
              >
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
