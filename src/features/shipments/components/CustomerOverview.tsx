"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  ArrowRight,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PayNowButton } from "@/features/payments/components/PayNowButton";
import { useShipments } from "../api/useShipments";
import { getStatusBadge } from "./ShipmentTable";
import type { ShipmentStatus } from "@/types";
import { cn } from "@/lib/utils";

const ACTIVE_STATUS_SET = new Set<ShipmentStatus>([
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "RECEIVED_AT_ORIGIN_HUB",
  "IN_TRANSIT",
  "RECEIVED_AT_DEST_HUB",
  "OUT_FOR_DELIVERY",
]);

export function CustomerOverview() {
  const { data, isLoading, isError, refetch } = useShipments({ limit: 50 });
  const shipments = data?.shipments ?? [];

  // Compute live KPIs
  const kpis = React.useMemo(() => {
    const activeDeliveries = shipments.filter((s) =>
      ACTIVE_STATUS_SET.has(s.status),
    ).length;

    const deliveredParcels = shipments.filter(
      (s) => s.status === "DELIVERED",
    ).length;

    const unpaidShipments = shipments.filter(
      (s) => s.paymentType === "CARD" && s.paymentStatus === "UNPAID",
    );

    const unpaidCount = unpaidShipments.length;

    return {
      activeDeliveries,
      deliveredParcels,
      unpaidCount,
      totalCount: shipments.length,
    };
  }, [shipments]);

  // Up to 4 recent consignments
  const recentShipments = React.useMemo(() => {
    return [...shipments]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 4);
  }, [shipments]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-indigo-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>Customer Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Customer{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Portal
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Real-time consignment telemetry, instant parcel bookings, and
              verified milestone tracking across Bangladesh.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/customer/book"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl gap-2 font-semibold shadow-xs",
              )}
            >
              <PlusCircle className="size-4" />
              <span>Book Consignment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Deliveries */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Active Deliveries
            </span>
            <div className="size-9 rounded-xl border flex items-center justify-center from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
              <Truck className="size-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-md" />
            ) : (
              <p className="text-2xl font-black text-foreground tracking-tight">
                {kpis.activeDeliveries}
              </p>
            )}
            <p className="mt-1 text-[11px] text-muted-foreground">
              In transit across hubs & riders
            </p>
          </div>
        </div>

        {/* Delivered Parcels */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Delivered Parcels
            </span>
            <div className="size-9 rounded-xl border flex items-center justify-center from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/10">
              <Package className="size-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-md" />
            ) : (
              <p className="text-2xl font-black text-foreground tracking-tight">
                {kpis.deliveredParcels}
              </p>
            )}
            <p className="mt-1 text-[11px] text-muted-foreground">
              Confirmed receipt with OTP
            </p>
          </div>
        </div>

        {/* Pending Invoices / Payments */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Pending Card Invoices
            </span>
            <div
              className={cn(
                "size-9 rounded-xl border flex items-center justify-center",
                kpis.unpaidCount > 0
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
              )}
            >
              <CreditCard className="size-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-md" />
            ) : (
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-foreground tracking-tight">
                  {kpis.unpaidCount}
                </p>
                {kpis.unpaidCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] text-amber-600 border-amber-500/30"
                  >
                    Action required
                  </Badge>
                )}
              </div>
            )}
            <p className="mt-1 text-[11px] text-muted-foreground">
              {kpis.unpaidCount > 0
                ? "Awaiting Stripe checkout confirmation"
                : "All card bookings reconciled"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Tracking Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Truck className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Active Order Tracking
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Follow your packages in real time through sorting hubs, highway
              linehaul transports, and neighborhood courier riders.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/customer/tracking"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl gap-2 w-full font-semibold",
              )}
            >
              <span>Open Live Tracking</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Book Parcel Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <PlusCircle className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Book a Consignment
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate digital waypoint waybills with instant QR routing tags
              across all 64 districts in Bangladesh.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/customer/book"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-xl gap-2 w-full font-medium",
              )}
            >
              <Package className="size-4" />
              <span>Book New Parcel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* RECENT CONSIGNMENTS WIDGET */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              <span>Recent Consignments</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Your latest parcel dispatches and waypoint delivery statuses.
            </p>
          </div>

          <Link
            href="/customer/shipments"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "rounded-xl text-xs gap-1.5 font-semibold text-primary hover:text-primary",
            )}
          >
            <span>View All Shipments</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 p-4 space-y-2"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48 rounded-md" />
              </div>
            ))}
          </div>
        ) : recentShipments.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-xs text-muted-foreground">
              No recent parcels found. Create your first shipment to view live
              updates here.
            </p>
            <Link
              href="/customer/book"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl gap-1.5 text-xs font-semibold",
              )}
            >
              <PlusCircle className="size-3.5" />
              <span>Book a Parcel</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentShipments.map((shipment) => {
              const statusBadge = getStatusBadge(shipment.status);
              const isUnpaidCard =
                shipment.paymentType === "CARD" &&
                shipment.paymentStatus === "UNPAID";

              return (
                <div
                  key={shipment.id}
                  className="rounded-2xl border border-border/70 bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-border transition-all"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">
                        #{shipment.trackingNumber}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] py-0",
                          statusBadge.className,
                        )}
                      >
                        {statusBadge.label}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] py-0">
                        {shipment.deliveryType === "LOCAL"
                          ? "Local"
                          : "Inter-District"}
                      </Badge>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">
                        To:{" "}
                        <span className="font-semibold text-foreground">
                          {shipment.receiverName}
                        </span>{" "}
                        ({shipment.receiverPhone}) •{" "}
                        {shipment.receiverDistrict || "Bangladesh"}
                      </p>
                      {shipment.receiverEmail && (
                        <p
                          className="text-[11px] text-muted-foreground truncate"
                          title={shipment.receiverEmail}
                        >
                          {shipment.receiverEmail}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isUnpaidCard && (
                        <PayNowButton
                          shipmentId={shipment.id}
                          label="Pay Now"
                          size="xs"
                          className="rounded-lg text-xs"
                        />
                      )}

                      <Link
                        href={`/customer/tracking?id=${encodeURIComponent(shipment.trackingNumber)}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "rounded-xl gap-1 text-xs font-semibold",
                        )}
                      >
                        <Truck className="size-3.5" />
                        <span>Track</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
