"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Truck,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CreditCard,
  Copy,
  Check,
  RotateCcw,
  Ban,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayNowButton } from "@/features/payments/components/PayNowButton";
import { CancelDialog } from "./CancelDialog";
import { useShipments } from "../api/useShipments";
import type { Shipment, ShipmentStatus } from "@/types";
import { cn } from "@/lib/utils";

/** Human readable labels and color tokens strictly matching AGENTS.md Section 8 */
export function getStatusBadge(status: ShipmentStatus) {
  switch (status) {
    case "PENDING":
      return {
        label: "Order Placed",
        className:
          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      };
    case "ASSIGNED":
      return {
        label: "Courier Assigned",
        className:
          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
      };
    case "PICKED_UP":
      return {
        label: "Parcel Collected",
        className:
          "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
      };
    case "RECEIVED_AT_ORIGIN_HUB":
      return {
        label: "In Origin Hub",
        className:
          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      };
    case "IN_TRANSIT":
      return {
        label: "In Transit",
        className:
          "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
      };
    case "RECEIVED_AT_DEST_HUB":
      return {
        label: "At Dest Hub",
        className:
          "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
      };
    case "OUT_FOR_DELIVERY":
      return {
        label: "Out for Delivery",
        className:
          "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30",
      };
    case "DELIVERED":
      return {
        label: "Delivered",
        className:
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        className:
          "bg-destructive/10 text-destructive border-destructive/30",
      };
    default:
      return {
        label: status,
        className: "bg-muted text-muted-foreground border-border",
      };
  }
}

const ACTIVE_STATUS_SET = new Set<ShipmentStatus>([
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "RECEIVED_AT_ORIGIN_HUB",
  "IN_TRANSIT",
  "RECEIVED_AT_DEST_HUB",
  "OUT_FOR_DELIVERY",
]);

export function ShipmentTable() {
  const { data, isLoading, isError, error, refetch } = useShipments({ limit: 100 });
  const shipments = data?.shipments ?? [];

  // Filter and Search states
  const [activeTab, setActiveTab] = React.useState<"all" | "active" | "delivered" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Cancel dialog state
  const [selectedForCancel, setSelectedForCancel] = React.useState<Shipment | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);

  // Tracking copy states
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber);
    setCopiedId(trackingNumber);
    toast.success("Tracking number copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered dataset
  const filteredShipments = React.useMemo(() => {
    return shipments.filter((item) => {
      // Tab filter
      if (activeTab === "active" && !ACTIVE_STATUS_SET.has(item.status)) return false;
      if (activeTab === "delivered" && item.status !== "DELIVERED") return false;
      if (activeTab === "cancelled" && item.status !== "CANCELLED") return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesTracking = item.trackingNumber.toLowerCase().includes(query);
        const matchesReceiver = item.receiverName.toLowerCase().includes(query);
        const matchesDistrict =
          item.receiverDistrict?.toLowerCase().includes(query) ||
          item.senderDistrict?.toLowerCase().includes(query);
        if (!matchesTracking && !matchesReceiver && !matchesDistrict) return false;
      }

      return true;
    });
  }, [shipments, activeTab, searchQuery]);

  // Counts for tabs
  const counts = React.useMemo(() => {
    const total = shipments.length;
    const active = shipments.filter((s) => ACTIVE_STATUS_SET.has(s.status)).length;
    const delivered = shipments.filter((s) => s.status === "DELIVERED").length;
    const cancelled = shipments.filter((s) => s.status === "CANCELLED").length;
    return { total, active, delivered, cancelled };
  }, [shipments]);

  return (
    <div className="space-y-6">
      {/* Top Controls: Tabs and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">
              All ({counts.total})
            </TabsTrigger>
            <TabsTrigger value="active">
              In Transit ({counts.active})
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Delivered ({counts.delivered})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({counts.cancelled})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Input
            placeholder="Search tracking #, recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* ERROR STATE */}
      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-3">
          <div className="mx-auto size-12 rounded-full bg-destructive/20 text-destructive flex items-center justify-center">
            <AlertCircle className="size-6" />
          </div>
          <p className="text-sm font-semibold text-destructive">
            Failed to load consignments: {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/70 bg-card p-5 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-64 rounded-md" />
              <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-8 w-24 rounded-xl" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !isError && filteredShipments.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-8 sm:p-12 text-center space-y-4">
          <div className="mx-auto size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Package className="size-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-foreground">
              {searchQuery ? "No matching consignments" : "No consignments registered"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {searchQuery
                ? `No shipments found matching "${searchQuery}". Try searching with a different term.`
                : "You haven't booked any shipments yet. Generate a digital waybill and start tracking right away."}
            </p>
          </div>
          <div>
            <Link
              href="/customer/book"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl gap-2 font-semibold shadow-xs"
              )}
            >
              <PlusCircle className="size-4" />
              <span>Book New Parcel</span>
            </Link>
          </div>
        </div>
      )}

      {/* SHIPMENTS LIST / CARDS */}
      {!isLoading && !isError && filteredShipments.length > 0 && (
        <div className="space-y-3">
          {filteredShipments.map((shipment) => {
            const statusConfig = getStatusBadge(shipment.status);
            const isUnpaidCard =
              shipment.paymentType === "CARD" && shipment.paymentStatus === "UNPAID";
            const canCancel = shipment.status === "PENDING";

            return (
              <div
                key={shipment.id}
                className="group rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:border-border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Consignment Overview */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm sm:text-base font-bold text-foreground tracking-wide">
                      #{shipment.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(shipment.trackingNumber)}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Copy Tracking #"
                    >
                      {copiedId === shipment.trackingNumber ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>

                    {/* Status Badge */}
                    <Badge
                      variant="outline"
                      className={cn("text-[11px] font-semibold border px-2.5 py-0.5", statusConfig.className)}
                    >
                      {statusConfig.label}
                    </Badge>

                    {/* Classification */}
                    <Badge variant="secondary" className="text-[10px] py-0">
                      {shipment.deliveryType === "LOCAL" ? "Local" : "Inter-District"}
                    </Badge>
                  </div>

                  {/* Route & Recipient */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-medium text-foreground">Recipient:</span>
                      <span className="truncate">
                        {shipment.receiverName} ({shipment.receiverPhone})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">Route:</span>
                      <span>
                        {shipment.senderDistrict || "Hub"} → {shipment.receiverDistrict || "Hub"}
                      </span>
                    </div>
                  </div>

                  {/* Weight & Payment Pill */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-lg bg-muted/60 px-2 py-0.5 font-medium text-foreground">
                      Weight: {shipment.weightKg} kg
                    </span>

                    {shipment.paymentType === "CARD" ? (
                      <span
                        className={cn(
                          "rounded-lg px-2 py-0.5 font-semibold border",
                          shipment.paymentStatus === "PAID"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                        )}
                      >
                        Card: {shipment.paymentStatus}
                      </span>
                    ) : (
                      <span className="rounded-lg bg-muted/60 px-2 py-0.5 font-semibold text-foreground border border-border/60">
                        COD: ৳{shipment.codAmount?.toLocaleString() ?? 0}
                      </span>
                    )}

                    <span className="text-muted-foreground">
                      {new Date(shipment.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
                  {/* PAY NOW BUTTON FOR UNPAID CARDS */}
                  {isUnpaidCard && (
                    <PayNowButton
                      shipmentId={shipment.id}
                      label="Pay Now"
                      size="sm"
                      className="rounded-xl"
                    />
                  )}

                  {/* LIVE TRACK BUTTON */}
                  <Link
                    href={`/customer/tracking?id=${encodeURIComponent(shipment.trackingNumber)}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "rounded-xl gap-1.5 font-semibold"
                    )}
                  >
                    <Truck className="size-3.5" />
                    <span>Track</span>
                  </Link>

                  {/* CANCEL BUTTON FOR PENDING SHIPMENTS */}
                  {canCancel && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedForCancel(shipment);
                        setCancelModalOpen(true);
                      }}
                      className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive text-xs gap-1 font-medium cursor-pointer"
                    >
                      <Ban className="size-3.5" />
                      <span>Cancel</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CANCEL SHIPMENT MODAL */}
      <CancelDialog
        shipment={selectedForCancel}
        open={cancelModalOpen}
        onOpenChange={(open) => {
          setCancelModalOpen(open);
          if (!open) setSelectedForCancel(null);
        }}
      />
    </div>
  );
}
