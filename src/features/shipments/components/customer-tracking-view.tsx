"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  MapPin,
  Clock,
  Truck,
  AlertCircle,
  Phone,
  Printer,
  ShieldCheck,
  User,
  Copy,
  Check,
  ChevronRight,
  PackageCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayNowButton } from "@/features/payments/components/PayNowButton";
import { useAuth } from "@/hooks/use-auth";
import {
  useActiveShipments,
  useShipmentByTrackingNumber,
} from "../api/shipment.api";
import { getStatusBadge } from "./ShipmentTable";
import type {
  ShipmentDetail,
  ShipmentStatus,
  DeliveryType,
  ShipmentTrackingLog,
} from "@/types";
import { cn } from "@/lib/utils";

/** FSM milestones for LOCAL (intra-district) deliveries */
const LOCAL_STEPS: { status: ShipmentStatus; label: string; sub: string }[] = [
  { status: "PENDING", label: "Order Placed", sub: "Waybill Manifested" },
  { status: "ASSIGNED", label: "Courier Assigned", sub: "Rider Dispatched" },
  { status: "PICKED_UP", label: "Parcel Collected", sub: "In Courier Custody" },
  { status: "RECEIVED_AT_ORIGIN_HUB", label: "In Origin Hub", sub: "Sorted & Scanned" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", sub: "Final Mile Delivery" },
  { status: "DELIVERED", label: "Delivered", sub: "Handover Verified" },
];

/** FSM milestones for INTER_DISTRICT (nationwide line-haul) deliveries */
const INTER_DISTRICT_STEPS: { status: ShipmentStatus; label: string; sub: string }[] = [
  { status: "PENDING", label: "Order Placed", sub: "Waybill Manifested" },
  { status: "ASSIGNED", label: "Courier Assigned", sub: "Rider Dispatched" },
  { status: "PICKED_UP", label: "Parcel Collected", sub: "In Courier Custody" },
  { status: "RECEIVED_AT_ORIGIN_HUB", label: "In Origin Hub", sub: "Origin Sorting Hub" },
  { status: "IN_TRANSIT", label: "In Transit", sub: "Highway Line-Haul" },
  { status: "RECEIVED_AT_DEST_HUB", label: "At Dest Hub", sub: "Destination Sorting" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", sub: "Final Mile Delivery" },
  { status: "DELIVERED", label: "Delivered", sub: "Handover Verified" },
];

export function CustomerTrackingView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: shipments = [], isLoading: isShipmentsLoading } =
    useActiveShipments();

  // Query individual shipment if direct ?id=... was supplied and not already in active list
  const shouldQuerySingle = Boolean(
    queryId &&
      !shipments.some(
        (s) =>
          s.trackingNumber.toLowerCase() === queryId.trim().toLowerCase()
      )
  );
  const { data: singleShipment, isLoading: isSingleLoading } =
    useShipmentByTrackingNumber(shouldQuerySingle ? queryId : null);

  const [copied, setCopied] = React.useState(false);

  // Determine active shipment based on query param or first active order
  const activeShipment = React.useMemo(() => {
    if (queryId) {
      const found = shipments.find(
        (s) =>
          s.trackingNumber.toLowerCase() === queryId.trim().toLowerCase()
      );
      if (found) return found;
      if (singleShipment) return singleShipment;
    }
    return shipments[0] ?? singleShipment ?? null;
  }, [shipments, queryId, singleShipment]);

  const handleSelectShipment = (trackingNumber: string) => {
    router.push(
      `/customer/tracking?id=${encodeURIComponent(trackingNumber)}`,
      { scroll: false }
    );
  };

  const handleCopyLink = () => {
    if (!activeShipment) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/customer/tracking?id=${encodeURIComponent(
        activeShipment.trackingNumber
      )}`
    );
    setCopied(true);
    toast.success("Tracking link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Loading state ---
  if (
    isShipmentsLoading ||
    isAuthLoading ||
    (shouldQuerySingle && isSingleLoading)
  ) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <div className="h-12 w-72 rounded-2xl bg-muted/60 animate-pulse" />
        <div className="h-44 rounded-3xl bg-muted/40 animate-pulse border border-border/60" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 rounded-3xl bg-muted/40 animate-pulse border border-border/60" />
          <div className="lg:col-span-4 h-96 rounded-3xl bg-muted/40 animate-pulse border border-border/60" />
        </div>
      </div>
    );
  }

  // --- Empty State ---
  if (!activeShipment) {
    return (
      <div className="mx-auto max-w-2xl py-12 px-4 sm:px-6">
        <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 text-center shadow-md backdrop-blur-md space-y-6">
          <div className="mx-auto size-14 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center">
            <PackageCheck className="size-7" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground">
              {queryId ? "Consignment Not Found" : "No Active Consignments"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {queryId
                ? `We could not find any active shipment matching "${queryId}". Please verify the tracking number or check your shipment history.`
                : "You do not have any parcels currently in transit. All past consignments have been successfully completed, or no new shipments have been manifested yet."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/customer/book"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-xl gap-2 shadow-xs font-semibold"
              )}
            >
              <Package className="size-4" />
              <span>Book New Parcel</span>
            </Link>
            <Link
              href="/customer/shipments"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl font-medium"
              )}
            >
              <span>View My Shipments</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMultiple = shipments.length > 1;
  const statusConfig = getStatusBadge(activeShipment.status);
  const isCancelled = activeShipment.status === "CANCELLED";
  const isUnpaidCard =
    activeShipment.paymentType === "CARD" &&
    activeShipment.paymentStatus === "UNPAID";

  // Determine FSM stepper definition based on deliveryType
  const steps =
    activeShipment.deliveryType === "LOCAL"
      ? LOCAL_STEPS
      : INTER_DISTRICT_STEPS;

  const currentStepIdx = steps.findIndex(
    (s) => s.status === activeShipment.status
  );

  // Cancellation reason if present
  const cancelLog = activeShipment.trackingLogs?.find(
    (l) => l.toStatus === "CANCELLED"
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Multi-Order Tab Switcher */}
      {isMultiple && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Consignments ({shipments.length} on the way)
            </p>
            <span className="text-xs text-muted-foreground">
              Click to switch tracking view
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {shipments.map((shipment) => {
              const isSelected =
                activeShipment.trackingNumber === shipment.trackingNumber;
              const badge = getStatusBadge(shipment.status);

              return (
                <button
                  key={shipment.id}
                  type="button"
                  onClick={() =>
                    handleSelectShipment(shipment.trackingNumber)
                  }
                  className={cn(
                    "shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer text-left",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20"
                      : "border-border/80 bg-card hover:border-border hover:bg-muted/40"
                  )}
                >
                  <span className="relative flex size-2 shrink-0">
                    {isSelected && (
                      <span className="absolute inline-flex size-full rounded-full bg-primary opacity-75 animate-ping" />
                    )}
                    <span
                      className={cn(
                        "relative inline-flex size-2 rounded-full",
                        isSelected ? "bg-primary" : "bg-muted-foreground/60"
                      )}
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {shipment.trackingNumber}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] px-1.5 py-0", badge.className)}
                      >
                        {badge.label}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                      {shipment.receiverDistrict ?? shipment.receiverAddress ?? "Bangladesh"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Shipment Overview Header Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                #{activeShipment.trackingNumber}
              </span>
              <Badge
                variant="outline"
                className={cn("text-xs px-3 py-1 font-semibold", statusConfig.className)}
              >
                {statusConfig.label}
              </Badge>
              <Badge variant="secondary" className="text-xs px-2.5 py-0.5">
                {activeShipment.deliveryType === "LOCAL"
                  ? "Intra-Hub Local Delivery"
                  : "Inter-District Line-Haul"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Origin:{" "}
              <span className="font-semibold text-foreground">
                {activeShipment.senderDistrict ?? "Hub"}
              </span>{" "}
              → Destination:{" "}
              <span className="font-semibold text-foreground">
                {activeShipment.receiverDistrict ?? "Bangladesh"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="rounded-xl text-xs gap-1.5 cursor-pointer"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>{copied ? "Copied" : "Share"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="rounded-xl text-xs gap-1.5 cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print</span>
            </Button>
          </div>
        </div>

        {/* UNPAID CARD ALERT WITH PAY NOW ACTION */}
        {isUnpaidCard && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="size-4" />
                <span>Payment Awaiting Authorization</span>
              </span>
              <p className="text-xs text-muted-foreground">
                This consignment is currently marked Unpaid. Complete Stripe card payment to ensure expedited line-haul dispatch.
              </p>
            </div>
            <PayNowButton
              shipmentId={activeShipment.id}
              label="Pay with Stripe"
              size="default"
              className="rounded-xl shrink-0"
            />
          </div>
        )}

        {/* Core Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Origin District
            </span>
            <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span className="truncate">
                {activeShipment.senderDistrict ?? "Registered Hub"}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Destination District
            </span>
            <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">
                {activeShipment.receiverDistrict ?? "Bangladesh"}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Weight
            </span>
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {activeShipment.weightKg} kg
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Payment & Status
            </span>
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {activeShipment.paymentType === "CARD"
                ? `Card (${activeShipment.paymentStatus})`
                : `COD: ৳${activeShipment.codAmount?.toLocaleString() ?? 0}`}
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC FSM STEPPER (LOCAL 5-step vs INTER_DISTRICT 8-step) */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Truck className="size-5 text-primary" />
              <span>Waybill Telemetry Stepper</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {activeShipment.deliveryType === "LOCAL"
                ? "5-stage intra-district route pipeline."
                : "8-stage nationwide line-haul routing pipeline."}
            </p>
          </div>
        </div>

        {/* CANCELLED TERMINAL VIEW (AGENTS.md Section 8) */}
        {isCancelled ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-3">
            <div className="mx-auto size-12 rounded-full bg-destructive/20 text-destructive flex items-center justify-center">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-destructive">
                Consignment Cancelled
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {cancelLog?.notes
                  ? `Reason: "${cancelLog.notes}"`
                  : "This consignment was cancelled prior to hub collection."}
              </p>
              {cancelLog?.createdAt && (
                <p className="text-[11px] font-mono text-muted-foreground pt-1">
                  Cancelled on: {new Date(cancelLog.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* ACTIVE PROGRESSION STEPPER */
          <div className="relative pt-2">
            {/* Desktop Horizontal Stepper */}
            <div className="hidden md:grid md:grid-flow-col md:auto-cols-fr gap-2 relative">
              {steps.map((step, idx) => {
                const isCompleted =
                  currentStepIdx >= 0 && idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.status} className="relative flex flex-col items-center text-center space-y-2 group">
                    {/* Node Circle */}
                    <div
                      className={cn(
                        "size-9 rounded-full flex items-center justify-center font-bold text-xs transition-all relative z-10",
                        isCompleted &&
                          "bg-emerald-500 text-white shadow-xs",
                        isCurrent &&
                          "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse",
                        !isCompleted &&
                          !isCurrent &&
                          "bg-muted text-muted-foreground border border-border"
                      )}
                    >
                      {isCompleted ? <Check className="size-4" /> : idx + 1}
                    </div>

                    {/* Step Text */}
                    <div className="space-y-0.5 max-w-[110px]">
                      <p
                        className={cn(
                          "text-xs font-bold leading-tight",
                          isCurrent
                            ? "text-primary"
                            : isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 leading-tight">
                        {step.sub}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="md:hidden space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {steps.map((step, idx) => {
                const isCompleted =
                  currentStepIdx >= 0 && idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.status} className="relative pl-10 flex items-start gap-3">
                    <div
                      className={cn(
                        "absolute left-2.5 top-0 size-7 -translate-x-1/2 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                        isCompleted && "bg-emerald-500 text-white",
                        isCurrent &&
                          "bg-primary text-primary-foreground ring-4 ring-primary/20",
                        !isCompleted &&
                          !isCurrent &&
                          "bg-muted text-muted-foreground border border-border"
                      )}
                    >
                      {isCompleted ? <Check className="size-3.5" /> : idx + 1}
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-xs font-bold",
                          isCurrent
                            ? "text-primary"
                            : isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {step.sub}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Tracking History Timeline and Consignment Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tracking Logs List */}
        <div className="lg:col-span-8 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-foreground pb-4 border-b border-border/60 flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <span>Milestone Activity Audit</span>
          </h3>

          {activeShipment.trackingLogs && activeShipment.trackingLogs.length > 0 ? (
            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
              {activeShipment.trackingLogs.map(
                (log: ShipmentTrackingLog, idx: number) => {
                  const isLatest = idx === 0;
                  return (
                    <div key={log.id} className="relative pl-9 space-y-1.5">
                      <span
                        className={cn(
                          "absolute left-1.5 top-1.5 size-4 -translate-x-1/2 rounded-full border-2 transition-all",
                          isLatest
                            ? "border-primary bg-primary ring-4 ring-primary/20 animate-pulse"
                            : "border-emerald-500 bg-emerald-500 text-white"
                        )}
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">
                            {log.action}
                          </span>
                          {isLatest && (
                            <Badge
                              variant="default"
                              className="text-[10px] px-1.5 py-0"
                            >
                              Latest
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {log.location && (
                        <p className="text-xs font-medium text-primary flex items-center gap-1">
                          <MapPin className="size-3" />
                          <span>{log.location}</span>
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px]">
                          {getStatusBadge(log.toStatus).label}
                        </Badge>
                        {log.fromStatus && (
                          <span>from {getStatusBadge(log.fromStatus).label}</span>
                        )}
                      </div>

                      {log.notes && (
                        <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-xl border border-border/40">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <AlertCircle className="size-8 text-muted-foreground mx-auto" />
              <p className="text-xs text-muted-foreground">
                No tracking event records available yet. Scans will populate as the courier rider and sorting hubs check in your parcel.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Courier & Consignment Specs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Assigned Courier Card */}
          {activeShipment.courier ? (
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Truck className="size-4 text-primary" />
                <span>Assigned Courier Rider</span>
              </h4>

              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  {activeShipment.courier.name}
                </p>
                {activeShipment.courier.email && (
                  <p className="text-xs text-muted-foreground">
                    {activeShipment.courier.email}
                  </p>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground/80 leading-relaxed border-t border-border/40 pt-3">
                The courier will verify your 4-digit SMS OTP prior to parcel handover.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-6 shadow-xs space-y-2 text-center">
              <Truck className="size-6 text-muted-foreground mx-auto" />
              <h4 className="text-xs font-bold text-foreground">
                Awaiting Courier Rider
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                A localized delivery rider will be assigned once your parcel reaches the target delivery hub.
              </p>
            </div>
          )}

          {/* Consignment Specs */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Package className="size-4 text-primary" />
              <span>Consignment Specs</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {activeShipment.receiverName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-semibold text-foreground">
                  {activeShipment.receiverPhone}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-semibold text-foreground">
                  {activeShipment.weightKg} kg
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Classification</span>
                <span className="font-semibold text-foreground">
                  {activeShipment.deliveryType === "LOCAL" ? "Intra-District" : "Inter-District"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-semibold text-foreground">
                  {activeShipment.paymentType === "CARD" ? "Card (Stripe)" : "Cash on Delivery"}
                </span>
              </div>
              {activeShipment.paymentType === "CASH" && (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">COD Payable</span>
                  <span className="font-bold text-foreground">
                    ৳{activeShipment.codAmount?.toLocaleString() ?? 0}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/customer/shipments"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full rounded-xl justify-between text-xs font-semibold"
                )}
              >
                <span>View in Consignments</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
