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
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  useActiveShipments,
  useShipmentByTrackingNumber,
} from "../api/use-active-shipments";
import { ShipmentData, TrackingLog } from "../schemas/shipment.schemas";
import { cn } from "@/lib/utils";

/** Maps raw status enums to user-friendly labels */
function formatStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Pending Assignment",
    BOOKED: "Booking Confirmed",
    PICKED_UP: "Picked Up by Courier",
    IN_TRANSIT: "In Linehaul Transit",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Successfully Delivered",
    CANCELLED: "Consignment Cancelled",
    RETURNED: "Returned to Sender",
  };
  return map[status] ?? status;
}

/** Badge variant mapping by shipment status */
function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "DELIVERED":
      return "success";
    case "OUT_FOR_DELIVERY":
      return "warning";
    case "IN_TRANSIT":
      return "default";
    case "BOOKED":
    case "PICKED_UP":
      return "info";
    default:
      return "secondary";
  }
}

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
    const url = `${window.location.origin}/customer/tracking?id=${activeShipment.trackingNumber}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Tracking link copied to clipboard");
    setTimeout(() => setCopied(false), 2500);
  };

  // --- Auth gate ---
  if (!isAuthLoading && !isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl text-center py-16 px-4">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-lg space-y-4">
          <div className="mx-auto size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <User className="size-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Sign In Required
          </h2>
          <p className="text-sm text-muted-foreground">
            Customer shipment tracking is securely connected to your verified
            account. Please sign in to view your live orders.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full rounded-xl"
              )}
            >
              Sign In to Waypoint
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                "rounded-xl gap-2 shadow-sm font-semibold"
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
              <span>View Shipment History</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMultiple = shipments.length > 1;
  const statusLabel = formatStatus(activeShipment.status);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Multi-Order Tab Switcher */}
      {isMultiple && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Active Consignment ({shipments.length} on the way)
            </p>
            <span className="text-xs text-muted-foreground">
              Click to switch tracking view
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {shipments.map((shipment) => {
              const isSelected =
                activeShipment.trackingNumber === shipment.trackingNumber;
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
                      ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20"
                      : "border-border/80 bg-card/80 hover:bg-accent/40 hover:border-border"
                  )}
                >
                  <span className="relative flex size-2 shrink-0">
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full rounded-full opacity-75",
                        isSelected
                          ? "animate-ping bg-primary"
                          : "bg-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex size-2 rounded-full",
                        isSelected
                          ? "bg-primary"
                          : "bg-muted-foreground/60"
                      )}
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {shipment.trackingNumber}
                      </span>
                      <Badge
                        variant={getStatusBadgeVariant(shipment.status)}
                        size="sm"
                        className="text-[10px]"
                      >
                        {formatStatus(shipment.status)}
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
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {activeShipment.trackingNumber}
              </span>
              <Badge
                variant={getStatusBadgeVariant(activeShipment.status)}
                className="text-xs px-3 py-1 font-semibold"
              >
                {statusLabel}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Delivery Type:{" "}
              <span className="font-semibold text-foreground capitalize">
                {activeShipment.deliveryType.toLowerCase().replace("_", " ")}
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

        {/* Core Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Origin Hub
            </span>
            <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span className="truncate">
                {activeShipment.originHub?.name ?? "Awaiting Assignment"}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Destination
            </span>
            <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">
                {activeShipment.destinationHub?.name ??
                  activeShipment.receiverDistrict ??
                  "Bangladesh"}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Receiver District
            </span>
            <p className="text-xs sm:text-sm font-semibold text-primary flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" />
              <span>
                {activeShipment.receiverDistrict ?? "Pending Dispatch"}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Payment & COD
            </span>
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              ৳{activeShipment.codAmount?.toLocaleString() ?? 0} (
              <span className="capitalize">
                {activeShipment.paymentStatus
                  .toLowerCase()
                  .replace("_", " ")}
              </span>
              )
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Timeline (8 cols) and Logistics Details (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tracking Log Timeline */}
        <div className="lg:col-span-8 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
          <h3 className="text-base font-bold text-foreground pb-6 border-b border-border/60 flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <span>Shipment Tracking History</span>
          </h3>

          {activeShipment.trackingLogs.length > 0 ? (
            <div className="mt-6 space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
              {activeShipment.trackingLogs.map(
                (log: TrackingLog, idx: number) => {
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
                          {formatStatus(log.toStatus)}
                        </Badge>
                        {log.fromStatus && (
                          <span>from {formatStatus(log.fromStatus)}</span>
                        )}
                      </div>

                      {log.notes && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="mt-6 text-center py-8 space-y-2">
              <AlertCircle className="size-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                No tracking logs available yet. Logs will appear as your
                shipment progresses through waypoints.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Courier & Consignment Specs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Assigned Courier Card */}
          {activeShipment.courier && (
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Truck className="size-4 text-primary" />
                <span>Assigned Courier Rider</span>
              </h4>

              <div className="space-y-2">
                <p className="text-sm font-bold text-foreground">
                  {activeShipment.courier.name}
                </p>
                {activeShipment.courier.phone && (
                  <p className="text-xs font-mono text-muted-foreground">
                    {activeShipment.courier.phone}
                  </p>
                )}
              </div>

              {activeShipment.courier.phone && (
                <a
                  href={`tel:${activeShipment.courier.phone}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full rounded-xl gap-2 text-xs font-semibold"
                  )}
                >
                  <Phone className="size-3.5 text-primary" />
                  <span>Call Delivery Courier</span>
                </a>
              )}

              <p className="text-[11px] text-muted-foreground/80 leading-relaxed border-t border-border/40 pt-3">
                Courier will request your SMS OTP verification upon parcel
                handover.
              </p>
            </div>
          )}

          {/* Consignment Specs */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Package className="size-4 text-primary" />
              <span>Consignment Specs</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Receiver Name</span>
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {activeShipment.receiverName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Receiver Phone</span>
                <span className="font-semibold text-foreground">
                  {activeShipment.receiverPhone}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Package Weight</span>
                <span className="font-semibold text-foreground">
                  {activeShipment.weightKg} kg
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">COD Payable</span>
                <span className="font-semibold text-foreground">
                  ৳{activeShipment.codAmount?.toLocaleString() ?? 0}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">
                  Destination Hub
                </span>
                <span className="font-semibold text-foreground truncate max-w-[140px]">
                  {activeShipment.destinationHub?.name ?? "Not Assigned"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/customer/shipments"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full rounded-xl justify-between text-xs"
                )}
              >
                <span>View in Customer Shipments</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
