"use client";

import * as React from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  Building2,
  Boxes,
  Users,
  TrendingUp,
  RotateCw,
  ArrowRight,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Package,
  Layers,
  Banknote,
  DollarSign,
  Activity,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminShipments } from "@/features/shipments";
import { useHubs } from "@/features/hubs";
import { useUsers } from "@/features/users";
import { AssignCourierModal } from "@/features/shipments/components/admin/AssignCourierModal";
import { shipmentKeys, hubKeys, userKeys } from "@/lib/query-keys";
import type { Shipment, Hub, User, ShipmentStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_COLOR_CONFIG: Record<
  ShipmentStatus,
  { label: string; barColor: string; textColor: string; dotColor: string }
> = {
  PENDING: {
    label: "Pending",
    barColor: "bg-amber-500",
    textColor: "text-amber-500",
    dotColor: "bg-amber-500",
  },
  ASSIGNED: {
    label: "Assigned",
    barColor: "bg-blue-500",
    textColor: "text-blue-500",
    dotColor: "bg-blue-500",
  },
  PICKED_UP: {
    label: "Picked Up",
    barColor: "bg-sky-500",
    textColor: "text-sky-500",
    dotColor: "bg-sky-500",
  },
  RECEIVED_AT_ORIGIN_HUB: {
    label: "Origin Hub",
    barColor: "bg-amber-600",
    textColor: "text-amber-600",
    dotColor: "bg-amber-600",
  },
  IN_TRANSIT: {
    label: "Line-Haul",
    barColor: "bg-indigo-500",
    textColor: "text-indigo-500",
    dotColor: "bg-indigo-500",
  },
  RECEIVED_AT_DEST_HUB: {
    label: "Dest Hub",
    barColor: "bg-purple-500",
    textColor: "text-purple-500",
    dotColor: "bg-purple-500",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    barColor: "bg-orange-500",
    textColor: "text-orange-500",
    dotColor: "bg-orange-500",
  },
  DELIVERED: {
    label: "Delivered",
    barColor: "bg-emerald-500",
    textColor: "text-emerald-500",
    dotColor: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    barColor: "bg-destructive",
    textColor: "text-destructive",
    dotColor: "bg-destructive",
  },
};

export function AdminDashboardOverview() {
  const queryClient = useQueryClient();

  // Queries for live metrics
  const {
    data: shipmentData,
    isLoading: isLoadingShipments,
    isRefetching: isRefetchingShipments,
    refetch: refetchShipments,
  } = useAdminShipments({ limit: 100 });

  const {
    data: hubsData,
    isLoading: isLoadingHubs,
    isRefetching: isRefetchingHubs,
    refetch: refetchHubs,
  } = useHubs();

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isRefetching: isRefetchingUsers,
    refetch: refetchUsers,
  } = useUsers({ limit: 100 });

  // Modal state for quick courier assignment
  const [selectedShipment, setSelectedShipment] = React.useState<Shipment | null>(
    null
  );
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);

  const isRefreshingAll =
    isRefetchingShipments || isRefetchingHubs || isRefetchingUsers;

  const handleRefreshAll = async () => {
    await Promise.all([
      refetchShipments(),
      refetchHubs(),
      refetchUsers(),
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: hubKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
    ]);
  };

  const shipments = shipmentData?.shipments ?? [];
  const hubs: Hub[] = Array.isArray(hubsData) ? hubsData : [];
  const users: User[] = usersData?.users ?? [];

  // Computed metrics
  const metrics = React.useMemo(() => {
    // Shipments calculation
    const totalShipments = shipmentData?.total ?? shipments.length;
    const deliveredCount = shipments.filter((s) => s.status === "DELIVERED").length;
    const pendingCount = shipments.filter((s) => s.status === "PENDING").length;
    const inTransitCount = shipments.filter(
      (s) =>
        s.status === "IN_TRANSIT" ||
        s.status === "RECEIVED_AT_ORIGIN_HUB" ||
        s.status === "RECEIVED_AT_DEST_HUB"
    ).length;
    const outForDeliveryCount = shipments.filter(
      (s) => s.status === "OUT_FOR_DELIVERY"
    ).length;
    const cancelledCount = shipments.filter((s) => s.status === "CANCELLED").length;

    // Delivery type split
    const localCount = shipments.filter((s) => s.deliveryType === "LOCAL").length;
    const interDistrictCount = shipments.filter(
      (s) => s.deliveryType === "INTER_DISTRICT"
    ).length;

    // Financial calculations
    const totalCodAmount = shipments
      .filter((s) => s.paymentType === "CASH")
      .reduce((sum, s) => sum + (s.codAmount ?? 0), 0);

    const paidCardCount = shipments.filter(
      (s) => s.paymentType === "CARD" && s.paymentStatus === "PAID"
    ).length;

    // Hub statistics
    const activeHubs = hubs.filter((h) => h.status === "ACTIVE").length;
    const totalCapacity = hubs.reduce((sum, h) => sum + (h.capacity ?? 0), 0);
    const gatewayHubs = hubs.filter((h) => h.isGateway).length;

    // User statistics
    const courierCount = users.filter((u) => u.role === "COURIER").length;
    const customerCount = users.filter((u) => u.role === "CUSTOMER").length;
    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const activeCouriers = users.filter(
      (u) => u.role === "COURIER" && u.status === "ACTIVE"
    ).length;

    // Status breakdown counts
    const statusCounts: Record<ShipmentStatus, number> = {
      PENDING: 0,
      ASSIGNED: 0,
      PICKED_UP: 0,
      RECEIVED_AT_ORIGIN_HUB: 0,
      IN_TRANSIT: 0,
      RECEIVED_AT_DEST_HUB: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    shipments.forEach((s) => {
      if (statusCounts[s.status] !== undefined) {
        statusCounts[s.status]++;
      }
    });

    return {
      totalShipments,
      deliveredCount,
      pendingCount,
      inTransitCount,
      outForDeliveryCount,
      cancelledCount,
      localCount,
      interDistrictCount,
      totalCodAmount,
      paidCardCount,
      activeHubs,
      totalCapacity,
      gatewayHubs,
      courierCount,
      customerCount,
      adminCount,
      activeCouriers,
      statusCounts,
    };
  }, [shipmentData?.total, shipments, hubs, users]);

  // Urgent attention consignments (Pending or In Transit)
  const urgentShipments = React.useMemo(() => {
    return shipments
      .filter((s) => s.status === "PENDING" || s.status === "OUT_FOR_DELIVERY")
      .slice(0, 5);
  }, [shipments]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-purple-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3.5" />
              <span>Platform Executive Authority</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Command{" "}
              <span className="bg-linear-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Center Telemetry
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Nationwide parcel routing orchestration, sorting hub telemetry, courier fleet dispatching, and system access governance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isRefreshingAll}
              className="rounded-xl gap-2 font-medium"
            >
              <RotateCw
                className={cn("size-3.5", isRefreshingAll && "animate-spin")}
              />
              <span>{isRefreshingAll ? "Syncing..." : "Sync Telemetry"}</span>
            </Button>
            <Link
              href="/admin/hubs"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "rounded-xl gap-1.5 font-semibold shadow-xs"
              )}
            >
              <Building2 className="size-4" />
              <span>Manage Hubs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Consignments */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Consignments
            </span>
            <div className="size-9 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Boxes className="size-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground tracking-tight">
              {isLoadingShipments ? "..." : metrics.totalShipments.toLocaleString()}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {metrics.deliveredCount} Delivered
              </span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {metrics.pendingCount} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Sorting Hubs */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Sorting Hub Network
            </span>
            <div className="size-9 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 className="size-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground tracking-tight">
              {isLoadingHubs ? "..." : hubs.length}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {metrics.activeHubs} Operational
              </span>
              <span>•</span>
              <span>{metrics.gatewayHubs} Gateways</span>
            </div>
          </div>
        </div>

        {/* Courier Fleet */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Courier Riders
            </span>
            <div className="size-9 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Truck className="size-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground tracking-tight">
              {isLoadingUsers ? "..." : metrics.courierCount}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {metrics.activeCouriers} Active Riders
              </span>
              <span>•</span>
              <span>{metrics.customerCount} Customers</span>
            </div>
          </div>
        </div>

        {/* Cash On Delivery & Value */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              COD Volume (Est.)
            </span>
            <div className="size-9 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Banknote className="size-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground tracking-tight">
              ৳ {metrics.totalCodAmount.toLocaleString()}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {metrics.paidCardCount} Prepaid Cards
              </span>
              <span>•</span>
              <span>Cash Flow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Lifecycle Distribution */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Consignment Pipeline Distribution
              </h2>
              <p className="text-xs text-muted-foreground">
                Live breakdown across the 9 finite state machine lifecycle stages.
              </p>
            </div>
            <Link
              href="/admin/shipments"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Bar Charts Representation */}
          <div className="space-y-3.5">
            {(Object.keys(STATUS_COLOR_CONFIG) as ShipmentStatus[]).map((status) => {
              const config = STATUS_COLOR_CONFIG[status];
              const count = metrics.statusCounts[status] || 0;
              const total = shipments.length || 1;
              const percent = Math.round((count / total) * 100);

              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", config.dotColor)} />
                      <span className="text-foreground">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-semibold text-foreground">{count}</span>
                      <span className="text-[11px]">({percent}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-500", config.barColor)}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Routing Modes & Hub Throughput Capacity */}
        <div className="space-y-6">
          {/* Delivery Type Ratio Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Delivery Modality</h2>
            <p className="text-xs text-muted-foreground">
              Intra-hub direct transit versus inter-district line-haul network.
            </p>

            <div className="space-y-4">
              <div className="rounded-xl border border-border/70 p-3.5 bg-muted/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Intra-Hub Local
                  </p>
                  <p className="text-[11px] text-muted-foreground">5-Stage Local Flow</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-foreground">
                    {metrics.localCount}
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    {Math.round(
                      (metrics.localCount / (shipments.length || 1)) * 100
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 p-3.5 bg-muted/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Inter-District Line-Haul
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    8-Stage Multi-Hub Flow
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-foreground">
                    {metrics.interDistrictCount}
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    {Math.round(
                      (metrics.interDistrictCount / (shipments.length || 1)) * 100
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                Hub Infrastructure
              </h2>
              <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/20 bg-emerald-500/10">
                Healthy
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Total operational capacity across registered sorting terminals.
            </p>
            <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="size-4 text-primary" />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Cumulative Capacity
                  </p>
                  <p className="text-[10px] text-muted-foreground">Daily throughput limit</p>
                </div>
              </div>
              <span className="text-base font-black text-foreground">
                {metrics.totalCapacity.toLocaleString()} parcels
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Dispatch Feed */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Pending Courier Dispatches
            </h2>
            <p className="text-xs text-muted-foreground">
              Consignments requiring immediate rider allocation or last-mile delivery tracking.
            </p>
          </div>
          <Link
            href="/admin/shipments"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-xl gap-1.5 font-medium self-start sm:self-auto"
            )}
          >
            <span>Open Dispatch Console</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {urgentShipments.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-border/70 text-muted-foreground text-xs space-y-1">
            <CheckCircle2 className="size-6 text-emerald-500 mx-auto mb-1" />
            <p className="font-semibold text-foreground">All Shipments Assigned</p>
            <p>No consignments are currently pending courier assignment.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {urgentShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {shipment.trackingNumber}
                    </span>
                    <Badge
                      variant={
                        shipment.status === "PENDING" ? "secondary" : "default"
                      }
                      className="text-[10px] px-2 py-0.5"
                    >
                      {shipment.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {shipment.deliveryType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      To: <strong className="text-foreground">{shipment.receiverName}</strong>
                    </span>
                    <span>•</span>
                    <span>{shipment.receiverDistrict ?? "Bangladesh"}</span>
                    <span>•</span>
                    <span>{shipment.weightKg} kg</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {shipment.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setAssignModalOpen(true);
                      }}
                      className="rounded-lg h-8 text-xs gap-1.5 font-semibold"
                    >
                      <Truck className="size-3" />
                      <span>Assign Rider</span>
                    </Button>
                  )}
                  <Link
                    href={`/admin/shipments`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "rounded-lg h-8 text-xs px-2.5"
                    )}
                  >
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Operational Modules Navigation Cards */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Operational Modules</h2>
          <p className="text-xs text-muted-foreground">
            Direct access to core logistics controllers and governance infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Hub Network */}
          <div className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-primary/50 hover:shadow-md">
            <div className="space-y-3">
              <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Building2 className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Hub Network</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Manage sorting hubs, adjust capacity quotas, configure dispatch cutoffs, and monitor divisional gateways.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/admin/hubs"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full rounded-xl justify-between group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all font-semibold"
                )}
              >
                <span>Manage Hubs</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Global Shipments */}
          <div className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-indigo-500/50 hover:shadow-md">
            <div className="space-y-3">
              <div className="size-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center transition-transform group-hover:scale-105">
                <Boxes className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Global Shipments</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Supervise nationwide consignments, execute origin & destination check-ins, and override courier assignments.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/admin/shipments"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full rounded-xl justify-between group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all font-semibold"
                )}
              >
                <span>Dispatch Console</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* User Directory */}
          <div className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-purple-500/50 hover:shadow-md">
            <div className="space-y-3">
              <div className="size-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center transition-transform group-hover:scale-105">
                <Users className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">User Management</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Govern customer accounts, inspect courier registrations, verify identities, and manage account statuses.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/admin/users"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full rounded-xl justify-between group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all font-semibold"
                )}
              >
                <span>Manage Accounts</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Courier Assignment Modal */}
      {selectedShipment && (
        <AssignCourierModal
          shipment={selectedShipment}
          open={assignModalOpen}
          onOpenChange={(open) => {
            setAssignModalOpen(open);
            if (!open) setSelectedShipment(null);
          }}
          onSuccess={() => {
            refetchShipments();
          }}
        />
      )}
    </div>
  );
}
