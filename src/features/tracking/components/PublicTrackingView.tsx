"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Share2,
  Search,
  Phone,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Lock,
  Boxes,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useShipmentByTrackingNumber } from "@/features/shipments/api/shipment.api";
import { DeliveryStepper } from "@/components/common/delivery-stepper";
import type { ShipmentStatus, DeliveryType } from "@/types";
import { cn } from "@/lib/utils";

interface PublicTrackingViewProps {
  trackingNumber: string;
}

export function PublicTrackingView({ trackingNumber }: PublicTrackingViewProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const [newTrackingQuery, setNewTrackingQuery] = React.useState("");

  const {
    data: shipment,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useShipmentByTrackingNumber(trackingNumber);

  const handleCopyTrackingNumber = () => {
    if (typeof navigator !== "undefined" && trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      toast.success("Tracking number copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Live tracking link copied to clipboard!");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = newTrackingQuery.trim().toUpperCase();
    if (q) {
      router.push(`/track/${encodeURIComponent(q)}`);
      setNewTrackingQuery("");
    }
  };

  // Mask phone number for privacy: e.g. 01712345678 -> 017****5678
  const maskPhone = (phone?: string | null) => {
    if (!phone) return "Protected";
    if (phone.length >= 11) {
      return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
    }
    return phone;
  };

  // Format date helper
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Quick Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">Waypoint Telemetry System</span>
            <span>• 64 Districts Live</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-72">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Track another WP-..."
                value={newTrackingQuery}
                onChange={(e) => setNewTrackingQuery(e.target.value)}
                className="pl-8 h-8 text-xs font-mono uppercase bg-background"
              />
            </div>
            <Button type="submit" size="sm" variant="default" className="h-8 text-xs px-3 rounded-lg cursor-pointer">
              Track
            </Button>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm text-center space-y-6 animate-pulse">
            <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Package className="size-8 animate-bounce" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <div className="h-6 w-48 rounded-lg bg-muted/80 mx-auto" />
              <div className="h-4 w-72 rounded bg-muted/60 mx-auto" />
            </div>
            <div className="h-24 w-full rounded-2xl bg-muted/40 max-w-2xl mx-auto" />
          </div>
        )}

        {/* Error / Not Found State */}
        {!isLoading && (isError || !shipment) && (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 sm:p-12 shadow-sm text-center space-y-6">
            <div className="size-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <XCircle className="size-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-foreground">Consignment Not Found</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We could not locate any active consignment matching code{" "}
                <strong className="font-mono text-foreground font-bold">&quot;{trackingNumber}&quot;</strong>.
                Please verify that the tracking code was typed correctly as provided in your notification email or SMS.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>Retry Search</span>
              </Button>
              <Link
                href="/services"
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-xl text-xs font-semibold")}
              >
                Browse Services
              </Link>
            </div>
          </div>
        )}

        {/* Success / Active Tracking Data Available */}
        {!isLoading && shipment && (
          <div className="space-y-8">
            {/* Header Telemetry Banner */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm backdrop-blur-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Consignment Waybill:</span>
                    <span className="font-mono text-base sm:text-lg font-black text-primary tracking-wider">
                      {shipment.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTrackingNumber}
                      title="Copy tracking number"
                      aria-label="Copy tracking number"
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleShareLink}
                      title="Share live link"
                      aria-label="Share live tracking link"
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Share2 className="size-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Booked on {formatDate(shipment.createdAt)} • Managed by Waypoint Logistics BD
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold px-3 py-1",
                      shipment.deliveryType === "LOCAL"
                        ? "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5"
                        : "border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5"
                    )}
                  >
                    {shipment.deliveryType === "LOCAL" ? "Intra-Hub Local" : "Inter-District Linehaul"}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    title="Refresh live status"
                    aria-label="Refresh status"
                    className="size-8 rounded-lg cursor-pointer"
                  >
                    <RefreshCw className={cn("size-3.5 text-muted-foreground", isFetching && "animate-spin")} />
                  </Button>
                </div>
              </div>

              {/* ⭐ HIGHLIGHTED SINGLE CURRENT ACTIVE STAGE (User Requirement 1) */}
              <div
                className={cn(
                  "rounded-2xl p-5 border relative overflow-hidden transition-all",
                  shipment.status === "OUT_FOR_DELIVERY"
                    ? "bg-amber-500/10 border-amber-500/30"
                    : shipment.status === "DELIVERED"
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : shipment.status === "IN_TRANSIT"
                    ? "bg-indigo-500/10 border-indigo-500/30"
                    : shipment.status === "CANCELLED"
                    ? "bg-destructive/10 border-destructive/30"
                    : "bg-primary/5 border-primary/20"
                )}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="relative flex size-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                      </span>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        Single Current Active Stage
                      </p>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-foreground capitalize tracking-tight">
                      {shipment.status.replace(/_/g, " ").toLowerCase()}
                    </h3>

                    {/* Stage Context Messages */}
                    {shipment.status === "OUT_FOR_DELIVERY" && (
                      <div className="space-y-2 pt-1">
                        <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                          Your consignment is currently with our delivery courier for final drop-off.
                          Please prepare your <strong>4-digit secure OTP</strong> to verify handover.
                        </p>
                        {shipment.paymentType === "CASH" && (
                          <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-200">
                            <span>Cash on Delivery to Collect:</span>
                            <span className="font-mono text-sm">৳{shipment.codAmount?.toLocaleString() ?? 0}</span>
                          </div>
                        )}
                        {shipment.paymentType === "CARD" && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="size-3.5" />
                            <span>Prepaid Online (No Cash Required)</span>
                          </span>
                        )}
                      </div>
                    )}

                    {shipment.status === "IN_TRANSIT" && (
                      <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                        Consignment is moving across dedicated highway line-haul between central cross-dock facilities.
                      </p>
                    )}

                    {shipment.status === "RECEIVED_AT_ORIGIN_HUB" && (
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                        Consignment has been checked in and scanned at the origin sorting facility ({shipment.originHub?.name || "Hub"}).
                      </p>
                    )}

                    {shipment.status === "RECEIVED_AT_DEST_HUB" && (
                      <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                        Consignment arrived safely at your regional destination hub ({shipment.destinationHub?.name || "Hub"}). Preparing rider route assignment.
                      </p>
                    )}

                    {shipment.status === "DELIVERED" && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="size-4" />
                        <span>Consignment successfully delivered and verified with 4-digit recipient OTP handshake.</span>
                      </p>
                    )}

                    {shipment.status === "CANCELLED" && (
                      <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                        <AlertTriangle className="size-4" />
                        <span>This shipment was cancelled prior to completion.</span>
                      </p>
                    )}
                  </div>

                  {/* Courier Contact Card (if assigned) */}
                  {shipment.courier && (
                    <div className="shrink-0 p-3 rounded-xl bg-background/90 border border-border/80 shadow-xs space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Assigned Courier</p>
                      <p className="text-xs font-bold text-foreground">{shipment.courier.name}</p>
                      <p className="text-[11px] text-muted-foreground">{maskPhone(shipment.courier.email)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FSM Milestone Stepper */}
            <DeliveryStepper
              status={shipment.status}
              deliveryType={shipment.deliveryType}
              showHeader={true}
            />

            {/* Consignment Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Origin */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1 shadow-2xs">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="size-3 text-primary" />
                  <span>Dispatch Origin</span>
                </p>
                <p className="text-xs font-bold text-foreground">
                  {shipment.senderUpazila ? `${shipment.senderUpazila}, ` : ""}
                  {shipment.senderDistrict || "Dhaka"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Hub: {shipment.originHub?.name || "Tejgaon Gateway"}
                </p>
              </div>

              {/* Destination */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1 shadow-2xs">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="size-3 text-emerald-500" />
                  <span>Delivery Destination</span>
                </p>
                <p className="text-xs font-bold text-foreground">
                  {shipment.receiverUpazila ? `${shipment.receiverUpazila}, ` : ""}
                  {shipment.receiverDistrict || "District"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Recipient: {shipment.receiverName} ({maskPhone(shipment.receiverPhone)})
                </p>
              </div>

              {/* Package Weight & SLA */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1 shadow-2xs">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Boxes className="size-3 text-primary" />
                  <span>Package Weight</span>
                </p>
                <p className="text-xs font-bold text-foreground font-mono">
                  {shipment.weightKg} kg gross
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Transit: {shipment.deliveryType === "LOCAL" ? "Same-Day / 24h" : "Next-Day Nationwide"}
                </p>
              </div>

              {/* Payment Info */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1 shadow-2xs">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="size-3 text-primary" />
                  <span>Payment Settlement</span>
                </p>
                <p className="text-xs font-bold text-foreground">
                  {shipment.paymentType === "CASH" ? "Cash on Delivery (COD)" : "Prepaid Online"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Status: <strong className="text-foreground">{shipment.paymentStatus}</strong>
                </p>
              </div>
            </div>

            {/* Waypoint Node Telemetry Timeline (Scan Logs) */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Waypoint Physical Scan Telemetry</h3>
                <p className="text-xs text-muted-foreground">
                  Chronological barcode scan records from physical dispatch facilities and riders.
                </p>
              </div>

              {shipment.trackingLogs && shipment.trackingLogs.length > 0 ? (
                <div className="relative pl-6 space-y-6 border-l-2 border-border/80 ml-2">
                  {[...shipment.trackingLogs].reverse().map((log, index) => (
                    <div key={log.id || index} className="relative group">
                      {/* Checkpoint Dot */}
                      <span
                        className={cn(
                          "absolute -left-[31px] top-1 size-3.5 rounded-full border-2 border-background",
                          index === 0 ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/60"
                        )}
                      />

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-bold text-foreground capitalize">
                            {log.action || log.toStatus.replace(/_/g, " ").toLowerCase()}
                          </p>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {formatDate(log.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Location: <strong className="text-foreground">{log.location || "Central Regional Sorting Gateway"}</strong>
                          {log.notes ? ` • ${log.notes}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-muted/30 text-center text-xs text-muted-foreground">
                  Initial consignment scan registered at booking. Further node telemetry updates will appear as the parcel moves through sorting facilities.
                </div>
              )}
            </div>

            {/* Recipient Help / Support Inquiries */}
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="size-4" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Need Urgent Consignment Assistance?</p>
                  <p className="text-muted-foreground">
                    Our 24/7 delivery operations desk is available at <strong>09612-WAYPOINT</strong>.
                  </p>
                </div>
              </div>

              <a
                href="tel:0961292976468"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl font-semibold gap-1.5 shrink-0")}
              >
                <span>Call Hotline</span>
                <ArrowRight className="size-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicTrackingView;
