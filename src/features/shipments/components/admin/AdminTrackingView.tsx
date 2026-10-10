"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Boxes,
  Truck,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  Building2,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
  RotateCw,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  PackageCheck,
  Activity,
  History,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminShipments } from "../../api/useAdminShipments";
import { useShipmentByTrackingNumber } from "../../api/shipment.api";
import { useUsers } from "@/features/users/api/useUsers";
import { AssignCourierModal } from "./AssignCourierModal";
import { HubCheckinActions } from "./HubCheckinActions";
import type { Shipment, ShipmentStatus, ShipmentDetail, User as UserType } from "@/types";
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

const STATUS_BADGES: Record<
  ShipmentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Order Placed",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  ASSIGNED: {
    label: "Courier Assigned",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  PICKED_UP: {
    label: "Parcel Collected",
    className: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  RECEIVED_AT_ORIGIN_HUB: {
    label: "In Origin Hub",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  IN_TRANSIT: {
    label: "Line-Haul Transit",
    className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  RECEIVED_AT_DEST_HUB: {
    label: "At Destination Hub",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function AdminTrackingView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryTrackingNumber = searchParams.get("id")?.trim() || "";
  const [searchInput, setSearchInput] = React.useState(queryTrackingNumber);
  const [copied, setCopied] = React.useState(false);
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);

  // 1. Fetch active shipments for the admin switcher toolbar
  const {
    data: adminShipmentsData,
    isLoading: isAdminShipmentsLoading,
    refetch: refetchAdminShipments,
  } = useAdminShipments({ limit: 40 });

  const shipmentsList = adminShipmentsData?.shipments ?? [];

  // Determine active tracking number: query param, or first available shipment
  const activeTrackingNumber =
    queryTrackingNumber || shipmentsList[0]?.trackingNumber || "";

  // 2. Fetch full shipment details including logs, hubs, courier, and customer
  const {
    data: shipmentDetail,
    isLoading: isDetailLoading,
    isRefetching: isDetailRefetching,
    refetch: refetchDetail,
  } = useShipmentByTrackingNumber(activeTrackingNumber || null);

  // 3. Fetch couriers for resolving courier info if needed
  const { data: couriersData } = useUsers({ role: "COURIER", limit: 100 });
  const courierMap = React.useMemo(() => {
    const map = new Map<string, UserType>();
    couriersData?.users?.forEach((c) => map.set(c.id, c));
    return map;
  }, [couriersData]);

  // Sync search input if URL changes
  React.useEffect(() => {
    if (queryTrackingNumber) {
      setSearchInput(queryTrackingNumber);
    }
  }, [queryTrackingNumber]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/admin/tracking?id=${encodeURIComponent(searchInput.trim())}`);
  };

  const handleSelectShipment = (trackingNo: string) => {
    setSearchInput(trackingNo);
    router.push(`/admin/tracking?id=${encodeURIComponent(trackingNo)}`);
  };

  const handleCopyTrackingNumber = () => {
    if (!activeTrackingNumber) return;
    navigator.clipboard.writeText(activeTrackingNumber);
    setCopied(true);
    toast.success("Tracking number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const activeShipment = shipmentDetail;
  const isCancelled = activeShipment?.status === "CANCELLED";
  const isDelivered = activeShipment?.status === "DELIVERED";

  // Select FSM steps
  const steps =
    activeShipment?.deliveryType === "LOCAL"
      ? LOCAL_STEPS
      : INTER_DISTRICT_STEPS;

  const currentStepIdx = steps.findIndex(
    (s) => s.status === activeShipment?.status
  );

  const assignedCourier =
    activeShipment?.courier ||
    (activeShipment?.courierId ? courierMap.get(activeShipment.courierId) : null);

  const cancelLog = activeShipment?.trackingLogs?.find(
    (l) => l.toStatus === "CANCELLED"
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search & Direct Consignment Lookup Bar */}
      <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 flex items-center gap-2 max-w-xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Enter tracking number (e.g. WAY-12345678)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 rounded-2xl h-11 text-xs sm:text-sm font-mono font-medium"
              />
            </div>
            <Button
              type="submit"
              className="rounded-2xl h-11 px-5 text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
            >
              <Truck className="size-4" />
              <span>Track Parcel</span>
            </Button>
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                refetchDetail();
                refetchAdminShipments();
              }}
              disabled={isDetailLoading || isDetailRefetching}
              className="rounded-2xl size-11 cursor-pointer"
              title="Refresh telemetry"
            >
              <RotateCw
                className={cn(
                  "size-4",
                  (isDetailLoading || isDetailRefetching) && "animate-spin text-primary"
                )}
              />
            </Button>

            <Link
              href="/admin/shipments"
              className="inline-flex items-center gap-1.5 px-4 h-11 rounded-2xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <Boxes className="size-4" />
              <span>All Shipments</span>
            </Link>
          </div>
        </div>

        {/* Quick Shipment Chips Carousel */}
        {shipmentsList.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-border/50">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold px-1">
              <span>Recent Consignments across Network</span>
              <span className="hidden sm:inline">Click to inspect</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {shipmentsList.map((s) => {
                const isSelected = s.trackingNumber === activeTrackingNumber;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectShipment(s.trackingNumber)}
                    className={cn(
                      "shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/30"
                        : "border-border/70 bg-card hover:bg-muted/50 text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        s.status === "DELIVERED"
                          ? "bg-emerald-500"
                          : s.status === "CANCELLED"
                          ? "bg-destructive"
                          : "bg-primary"
                      )}
                    />
                    <span>{s.trackingNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Consignment Telemetry View */}
      {isDetailLoading ? (
        <div className="rounded-3xl border border-border/80 bg-card p-16 text-center text-xs text-muted-foreground animate-pulse space-y-4">
          <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p>Acquiring live telemetry data from nationwide hubs...</p>
        </div>
      ) : !activeShipment ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-4">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <PackageCheck className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              Consignment Not Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {activeTrackingNumber
                ? `No shipment was found matching tracking number "${activeTrackingNumber}". Please check the ID or search from Global Shipments.`
                : "Enter a consignment tracking number above to inspect full route telemetry."}
            </p>
          </div>
          <Link
            href="/admin/shipments"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
          >
            <span>Open Global Shipments Directory</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Card with Telemetry Status */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-muted text-foreground border border-border">
                    <Boxes className="size-3.5 text-primary" />
                    <span>{activeShipment.trackingNumber}</span>
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyTrackingNumber}
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy tracking number"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>

                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-bold py-1 px-3",
                      STATUS_BADGES[activeShipment.status]?.className
                    )}
                  >
                    {STATUS_BADGES[activeShipment.status]?.label || activeShipment.status}
                  </Badge>

                  {/* Delivery Route Badge */}
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold py-1 px-2.5 bg-primary/10 text-primary border border-primary/20"
                  >
                    {activeShipment.deliveryType === "LOCAL"
                      ? "Intra-Hub Local Delivery"
                      : "Inter-District Line-Haul"}
                  </Badge>

                  {/* Telemetry Status Indicator */}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <span className="relative flex size-2">
                      <span className="animate-ping absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    <span>Live Telemetry</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {activeShipment.receiverDistrict || "Consignment"} Transit Telemetry
                </h2>

                <p className="text-xs text-muted-foreground">
                  Manifested on{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {new Date(activeShipment.createdAt).toLocaleString()}
                  </span>{" "}
                  • Weight:{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {activeShipment.weightKg} kg
                  </span>
                </p>
              </div>

              {/* Admin Actions */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <HubCheckinActions
                  shipment={activeShipment}
                  onSuccess={() => refetchDetail()}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignModalOpen(true)}
                  className="rounded-xl text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <User className="size-3.5" />
                  <span>{assignedCourier ? "Reassign Courier" : "Assign Courier"}</span>
                </Button>

                <Link
                  href={`/track/${activeShipment.trackingNumber}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span>Public View</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Automated Delivery Confirmation Notice if Delivered */}
          {isDelivered && (
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-md space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="size-4.5" />
                <span>Delivery Completed & Cryptographically Verified</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                Automated delivery confirmation with parcel waybill, handover timestamps, and digital receipt has been dispatched to both sender and receiver email addresses.
              </p>
            </div>
          )}

          {/* Cancellation Notice if Cancelled */}
          {isCancelled && (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-5 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <AlertCircle className="size-4.5" />
                <span>Consignment Cancelled</span>
              </div>
              <p className="text-xs text-destructive/90 leading-relaxed">
                This consignment was terminated prior to delivery.
                {cancelLog?.notes && (
                  <span className="block mt-1 font-mono font-medium">
                    Reason: {cancelLog.notes}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Dynamic FSM Waypoint Stepper */}
          {!isCancelled && (
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-foreground">
                    Milestone Progression & Route Stepper
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Enforcing backend 9-stage Finite State Machine ({activeShipment.deliveryType})
                  </p>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono">
                  Stage {Math.max(1, currentStepIdx + 1)} of {steps.length}
                </Badge>
              </div>

              {/* Stepper Graphic */}
              <div className="relative pt-4 pb-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {steps.map((step, idx) => {
                    const isPassed = currentStepIdx > idx;
                    const isCurrent = currentStepIdx === idx;

                    return (
                      <div
                        key={step.status}
                        className={cn(
                          "relative flex flex-col items-start p-3.5 rounded-2xl border transition-all",
                          isCurrent
                            ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20"
                            : isPassed
                            ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
                            : "border-border/60 bg-muted/20 opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={cn(
                              "size-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                              isCurrent
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : isPassed
                                ? "bg-emerald-500 text-white"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {isPassed ? (
                              <Check className="size-3.5 stroke-[3]" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span className="text-[10px] font-bold font-mono text-muted-foreground">
                            STEP {idx + 1}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-foreground line-clamp-1">
                          {step.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">
                          {step.sub}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Participant Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Sender Details */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="size-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <User className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Sender Information
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    {activeShipment.customer?.name || "Merchant"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{activeShipment.customer?.email || "—"}</span>
                </div>
                {activeShipment.customer?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-3.5 shrink-0" />
                    <span>{activeShipment.customer.phone}</span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0 mt-0.5" />
                  <span>
                    {activeShipment.senderAddress || "Pickup Address Not Specified"}
                    {activeShipment.senderUpazila && `, ${activeShipment.senderUpazila}`}
                    {activeShipment.senderDistrict && `, ${activeShipment.senderDistrict}`}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Recipient Details (with receiver email below name and phone) */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <PackageCheck className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Consignee / Recipient
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    {activeShipment.receiverName}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-foreground font-mono font-semibold">
                  <Phone className="size-3.5 text-primary shrink-0" />
                  <span>{activeShipment.receiverPhone}</span>
                </div>
                {/* Receiver email prominently displayed below name and phone as required */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5 text-indigo-500 shrink-0" />
                  <span className="font-medium text-foreground">
                    {activeShipment.receiverEmail || "receiver@email.com"}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0 mt-0.5" />
                  <span>
                    {activeShipment.receiverAddress || "Delivery Address"}
                    {activeShipment.receiverUpazila && `, ${activeShipment.receiverUpazila}`}
                    {activeShipment.receiverDistrict && `, ${activeShipment.receiverDistrict}`}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Assigned Courier Details */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="size-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Truck className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Assigned Courier Rider
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    {assignedCourier ? assignedCourier.name : "Unassigned"}
                  </p>
                </div>
              </div>

              {assignedCourier ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-3.5 shrink-0" />
                    <span className="truncate">{assignedCourier.email}</span>
                  </div>
                  {assignedCourier.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-3.5 shrink-0" />
                      <span>{assignedCourier.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3.5" />
                    <span>Courier Fleet Active</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">
                    No courier has been assigned to this consignment yet.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setAssignModalOpen(true)}
                    className="w-full rounded-xl text-xs font-bold text-primary border-primary/30 cursor-pointer"
                  >
                    Assign Available Rider
                  </Button>
                </div>
              )}
            </div>

            {/* 4. Origin & Destination Hubs */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="size-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Transit Sorting Hubs
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    Facility Node Route
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Origin Sorting Facility
                  </p>
                  <p className="font-semibold text-foreground">
                    {activeShipment.originHub
                      ? `${activeShipment.originHub.code} — ${activeShipment.originHub.name}`
                      : "Direct Courier Ingestion"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Destination Sorting Facility
                  </p>
                  <p className="font-semibold text-foreground">
                    {activeShipment.destinationHub
                      ? `${activeShipment.destinationHub.code} — ${activeShipment.destinationHub.name}`
                      : "Direct Hub Handover"}
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Settlement & Billing */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="size-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Banknote className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Settlement & Financial Telemetry
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    {activeShipment.paymentType === "CASH"
                      ? "Cash on Delivery (COD)"
                      : "Prepaid Card (Stripe)"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {/* Platform Delivery Fee */}
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">Platform Delivery Fee:</span>
                  <span className="font-mono font-bold text-foreground">
                    ৳{activeShipment.deliveryFee ?? (activeShipment.deliveryType === "LOCAL" ? 120 : 180)}
                  </span>
                </div>

                {/* COD Item Value or Card Total */}
                {activeShipment.paymentType === "CASH" ? (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <span className="text-muted-foreground">COD Item Value:</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        ৳{activeShipment.codAmount ?? 0}
                      </span>
                    </div>

                    {/* Platform Commission */}
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <span className="text-muted-foreground">Platform COD Commission (1%):</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ৳{activeShipment.codCommissionFee ?? Math.round((activeShipment.codAmount ?? 0) * 0.01)}
                      </span>
                    </div>

                    {/* Live Remittance Status */}
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <span className="text-muted-foreground">Courier Remittance Status:</span>
                      <div>
                        {activeShipment.remittanceStatus === "COLLECTED_BY_COURIER" && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0.5 font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          >
                            Cash with Courier
                          </Badge>
                        )}
                        {activeShipment.remittanceStatus === "REMITTED_TO_HUB" && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0.5 font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          >
                            Remitted to Hub
                          </Badge>
                        )}
                        {activeShipment.remittanceStatus === "SETTLED_TO_MERCHANT" && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0.5 font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          >
                            Settled to Merchant
                          </Badge>
                        )}
                        {(!activeShipment.remittanceStatus ||
                          activeShipment.remittanceStatus === "PENDING_COLLECTION") && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0.5 font-medium text-muted-foreground"
                          >
                            Pending Collection
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <span className="text-muted-foreground">Stripe Gateway Processing:</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        <ShieldCheck className="size-3.5" />
                        <span>Prepaid Online</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <span className="text-muted-foreground">Estimated Gateway Cost:</span>
                      <span className="font-mono text-muted-foreground text-xs">
                        ৳{Math.round(((activeShipment.deliveryFee ?? (activeShipment.deliveryType === "LOCAL" ? 120 : 180)) * 0.029) + 3)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <span className="text-muted-foreground">Settlement Status:</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      >
                        Settled via Card
                      </Badge>
                    </div>
                  </>
                )}

                {/* Overall Payment Status */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Invoice Status:</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {activeShipment.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 6. Handover Verification */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="size-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Handover Security
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    OTP Verification Protocol
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Final handover is protected by a 4-digit cryptographically verified delivery OTP.
                </p>
                <div className="p-2.5 rounded-xl bg-muted/40 font-mono text-[11px] space-y-1">
                  <p className="text-foreground font-semibold">
                    State: {activeShipment.status}
                  </p>
                  <p>
                    {isDelivered
                      ? "OTP successfully verified upon handover."
                      : "Recipient must disclose OTP to courier upon parcel arrival."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Audit Trail / Event History */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <History className="size-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Consignment Waypoint Audit Trail
                </h3>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {activeShipment.trackingLogs?.length || 0} audit events recorded
              </span>
            </div>

            {activeShipment.trackingLogs && activeShipment.trackingLogs.length > 0 ? (
              <div className="space-y-3 pt-2">
                {activeShipment.trackingLogs
                  .slice()
                  .reverse()
                  .map((log, idx) => (
                    <div
                      key={log.id || `log-${idx}`}
                      className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/60 bg-muted/20 text-xs"
                    >
                      <div className="size-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-mono font-bold text-[10px] mt-0.5">
                        {idx + 1}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-foreground">
                            {log.action}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          {log.fromStatus && (
                            <span>
                              From <Badge variant="outline" className="text-[10px]">{log.fromStatus}</Badge>
                            </span>
                          )}
                          <span>
                            To <Badge variant="default" className="text-[10px]">{log.toStatus}</Badge>
                          </span>
                          {log.location && <span>• Location: {log.location}</span>}
                        </div>

                        {log.notes && (
                          <p className="text-[11px] text-foreground font-mono bg-card p-2 rounded-xl border border-border/40 mt-1">
                            {log.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No intermediate audit log records have been committed for this consignment yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Courier Assignment Dialog */}
      {assignModalOpen && activeShipment && (
        <AssignCourierModal
          shipment={activeShipment}
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          onSuccess={() => {
            setAssignModalOpen(false);
            refetchDetail();
            refetchAdminShipments();
          }}
        />
      )}
    </div>
  );
}
