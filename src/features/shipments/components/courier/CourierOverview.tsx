"use client";

import * as React from "react";
import Link from "next/link";
import {
  Truck,
  PackageCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Navigation,
  MapPin,
  Banknote,
  RotateCw,
  Phone,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCourierShipments } from "../../api/useCourierShipments";
import { CourierStatusActionButtons } from "./CourierStatusActionButtons";
import { cn } from "@/lib/utils";

export function CourierOverview() {
  const { data, isLoading, isRefetching, refetch } = useCourierShipments({
    limit: 100,
  });

  const shipments = data?.shipments ?? [];

  // Compute live metrics from courier consignments
  const metrics = React.useMemo(() => {
    const assignedCount = shipments.filter((s) => s.status === "ASSIGNED").length;
    const outForDeliveryCount = shipments.filter(
      (s) => s.status === "OUT_FOR_DELIVERY"
    ).length;
    const deliveredCount = shipments.filter((s) => s.status === "DELIVERED").length;

    // Total COD cash collected for delivered cash orders
    const codCollectedToday = shipments
      .filter((s) => s.status === "DELIVERED" && s.paymentType === "CASH")
      .reduce((acc, s) => acc + (s.codAmount ?? 0), 0);

    // Pending COD cash for current runs
    const pendingCod = shipments
      .filter((s) => s.status === "OUT_FOR_DELIVERY" && s.paymentType === "CASH")
      .reduce((acc, s) => acc + (s.codAmount ?? 0), 0);

    return {
      assignedCount,
      outForDeliveryCount,
      deliveredCount,
      codCollectedToday,
      pendingCod,
    };
  }, [shipments]);

  // Urgent active runs (OUT_FOR_DELIVERY or ASSIGNED)
  const activeRuns = React.useMemo(() => {
    return shipments
      .filter(
        (s) => s.status === "OUT_FOR_DELIVERY" || s.status === "ASSIGNED"
      )
      .slice(0, 5);
  }, [shipments]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-linear-to-r from-amber-500/10 via-orange-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Truck className="size-3.5" />
              <span>Courier Field Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Courier{" "}
              <span className="bg-linear-to-r from-amber-600 via-orange-600 to-primary bg-clip-text text-transparent">
                Dispatch Console
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Real-time delivery route manifest, recipient drop-offs, OTP handovers, and COD cash management.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="rounded-xl gap-2 cursor-pointer font-medium"
            >
              <RotateCw
                className={cn("size-3.5", isRefetching && "animate-spin text-primary")}
              />
              <span>Sync Fleet</span>
            </Button>

            <Link
              href="/courier/shipments"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "rounded-xl gap-2 font-bold shadow-xs bg-amber-600 hover:bg-amber-700 text-white"
              )}
            >
              <PackageCheck className="size-4" />
              <span>Open Manifest</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Out for Delivery */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Out for Delivery
            </span>
            <div className="size-9 rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Truck className="size-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground tracking-tight font-mono">
              {isLoading ? "—" : metrics.outForDeliveryCount}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Parcels currently on your delivery run
            </p>
          </div>
        </div>

        {/* Ready for Pickup */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              To Pick Up
            </span>
            <div className="size-9 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PackageCheck className="size-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground tracking-tight font-mono">
              {isLoading ? "—" : metrics.assignedCount}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Awaiting sender parcel collection
            </p>
          </div>
        </div>

        {/* Completed Deliveries */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Delivered
            </span>
            <div className="size-9 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground tracking-tight font-mono">
              {isLoading ? "—" : metrics.deliveredCount}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Verified OTP completions recorded
            </p>
          </div>
        </div>

        {/* COD Collected Cash */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              COD Remittance
            </span>
            <div className="size-9 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Banknote className="size-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground tracking-tight font-mono">
              {isLoading ? "—" : `৳${metrics.codCollectedToday.toLocaleString()}`}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Cash collected in hand to remit
            </p>
          </div>
        </div>
      </div>

      {/* Active Priority Runs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Active Priority Runs
            </h2>
            <p className="text-xs text-muted-foreground">
              Consignments currently requiring your action.
            </p>
          </div>

          <Link
            href="/courier/shipments"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>View All ({shipments.length})</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-border/80 bg-card p-8 text-center text-xs text-muted-foreground animate-pulse">
            Loading active route manifest...
          </div>
        ) : activeRuns.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-8 text-center space-y-2">
            <p className="text-sm font-bold text-foreground">
              No Pending Runs
            </p>
            <p className="text-xs text-muted-foreground">
              You currently have no pending pickups or out-for-delivery parcels assigned.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeRuns.map((shipment) => (
              <div
                key={shipment.id}
                className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-border transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-foreground">
                      #{shipment.trackingNumber}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold py-0",
                        shipment.status === "OUT_FOR_DELIVERY"
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                      )}
                    >
                      {shipment.status === "OUT_FOR_DELIVERY"
                        ? "Out for Delivery"
                        : "Ready for Pickup"}
                    </Badge>
                    {shipment.paymentType === "CASH" ? (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        COD: ৳{shipment.codAmount ?? 0}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        Prepaid Card
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="text-foreground font-semibold">
                      To: {shipment.receiverName}
                    </span>
                    <span>•</span>
                    <a
                      href={`tel:${shipment.receiverPhone}`}
                      className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <Phone className="size-3" />
                      <span>{shipment.receiverPhone}</span>
                    </a>
                    <span>•</span>
                    <span className="truncate">
                      <MapPin className="size-3 inline mr-1" />
                      {shipment.receiverAddress} ({shipment.receiverDistrict})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                  <CourierStatusActionButtons
                    shipment={shipment}
                    size="sm"
                    onStatusChanged={() => refetch()}
                  />
                  <Link
                    href={`/courier/shipments/${shipment.id}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "rounded-xl text-xs"
                    )}
                  >
                    <span>Details</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Navigation className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Delivery Manifest
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Access the complete list of assigned consignments, filter by status, and trigger state transitions.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/courier/shipments"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl gap-2 w-full font-semibold"
              )}
            >
              <span>Open Delivery Manifest</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Completed Delivery History
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review completed consignments, confirmed OTP delivery records, and reconciled Cash on Delivery sums.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/courier/history"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-xl gap-2 w-full font-medium"
              )}
            >
              <span>Review Completed Runs</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
