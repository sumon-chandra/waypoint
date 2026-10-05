"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Package, ArrowLeft, RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PayNowButton } from "@/features/payments/components/PayNowButton";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("shipment_id");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-radial from-amber-500/10 via-background to-background">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand header */}
        <div className="flex justify-center mb-2">
          <Logo />
        </div>

        {/* Cancellation Notice Card */}
        <div className="rounded-3xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-xl backdrop-blur-xl text-center space-y-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="mx-auto size-20 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30 animate-in zoom-in-50 duration-300">
            <AlertCircle className="size-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Checkout Not Completed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Payment Incomplete
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              You chose to cancel or abandon the checkout process. Don&apos;t worry — your consignment booking is preserved and remains safely registered in your account as Unpaid.
            </p>
          </div>

          {/* Retry / Pay Now Section if shipmentId is present */}
          {shipmentId ? (
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-5 text-center space-y-3">
              <p className="text-xs text-muted-foreground">
                Would you like to try making the payment again?
              </p>
              <div className="flex justify-center">
                <PayNowButton
                  shipmentId={shipmentId}
                  label="Retry Payment Now"
                  size="default"
                  className="rounded-xl px-6"
                />
              </div>
            </div>
          ) : null}

          {/* Navigation Action Buttons */}
          <div className="space-y-3 pt-2">
            <Link
              href="/customer/shipments"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full rounded-xl gap-2 font-bold shadow-xs"
              )}
            >
              <Package className="size-4" />
              <span>Go to My Shipments</span>
            </Link>

            <Link
              href="/customer"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "w-full rounded-xl gap-1.5 font-medium"
              )}
            >
              <ArrowLeft className="size-4" />
              <span>Back to Customer Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="size-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
