"use client";

import * as React from "react";
import Link from "next/link";
import {
  Boxes,
  Search,
  RotateCw,
  ExternalLink,
  Inbox,
  UserCheck,
  UserX,
  Building2,
  Calendar,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useAdminShipments } from "../../api/useAdminShipments";
import { AssignCourierModal } from "./AssignCourierModal";
import { HubCheckinActions } from "./HubCheckinActions";
import type { Shipment, ShipmentStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ShipmentStatus,
  { label: string; badgeClass: string }
> = {
  PENDING: {
    label: "Order Placed",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  ASSIGNED: {
    label: "Courier Assigned",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  PICKED_UP: {
    label: "Parcel Collected",
    badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  RECEIVED_AT_ORIGIN_HUB: {
    label: "In Origin Hub",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  IN_TRANSIT: {
    label: "Line-Haul Transit",
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  RECEIVED_AT_DEST_HUB: {
    label: "At Destination Hub",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    badgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  DELIVERED: {
    label: "Delivered",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function AdminShipmentTable() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = React.useState<string>("ALL");

  // Assignment modal state
  const [assignShipment, setAssignShipment] = React.useState<Shipment | null>(null);

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
  } = useAdminShipments({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    deliveryType: deliveryTypeFilter === "ALL" ? undefined : deliveryTypeFilter,
    limit: 100,
  });

  const shipments = data?.shipments ?? [];

  // Client-side search
  const filteredShipments = React.useMemo(() => {
    let list = shipments;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(q) ||
          s.receiverName.toLowerCase().includes(q) ||
          s.receiverPhone.includes(q) ||
          s.receiverDistrict?.toLowerCase().includes(q) ||
          s.senderDistrict?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [shipments, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search all shipments by tracking #, recipient, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-2xl h-11 text-xs sm:text-sm"
          />
        </div>

        {/* Filters and Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl h-11 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Order Placed</option>
              <option value="ASSIGNED">Courier Assigned</option>
              <option value="PICKED_UP">Parcel Collected</option>
              <option value="RECEIVED_AT_ORIGIN_HUB">In Origin Hub</option>
              <option value="IN_TRANSIT">In Line-Haul Transit</option>
              <option value="RECEIVED_AT_DEST_HUB">At Destination Hub</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
          </div>

          <div className="w-36">
            <Select
              value={deliveryTypeFilter}
              onChange={(e) => setDeliveryTypeFilter(e.target.value)}
              className="rounded-2xl h-11 text-xs"
            >
              <option value="ALL">All Routes</option>
              <option value="LOCAL">Local Delivery</option>
              <option value="INTER_DISTRICT">Inter-District</option>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="rounded-2xl size-11 shrink-0 cursor-pointer"
            title="Refresh shipments"
          >
            <RotateCw
              className={cn("size-4", isRefetching && "animate-spin text-primary")}
            />
          </Button>
        </div>
      </div>

      {/* Global Shipments Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground animate-pulse">
          Loading platform-wide consignments...
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-4">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Inbox className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              No Shipments Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No shipments matched "${searchQuery}".`
                : "No platform shipments registered under this filter criteria."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
              setDeliveryTypeFilter("ALL");
            }}
            className="rounded-xl text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Tracking Number</th>
                  <th className="py-3.5 px-4">Origin & Destination</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Status & Route</th>
                  <th className="py-3.5 px-4">Assigned Courier</th>
                  <th className="py-3.5 px-4">Settlement</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Dispatch Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                {filteredShipments.map((shipment) => {
                  const statusInfo = STATUS_CONFIG[shipment.status] || {
                    label: shipment.status,
                    badgeClass: "bg-muted text-muted-foreground",
                  };

                  return (
                    <tr
                      key={shipment.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Tracking # */}
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold">
                        <div className="flex items-center gap-2">
                          <Boxes className="size-4 text-primary shrink-0" />
                          <span className="text-foreground">
                            {shipment.trackingNumber}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-sans pt-0.5">
                          {new Date(shipment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </td>

                      {/* Origin & Destination */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-foreground">
                          {shipment.senderDistrict || "—"} → {shipment.receiverDistrict || "—"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Weight: {shipment.weightKg} kg
                        </p>
                      </td>

                      {/* Recipient */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-foreground">
                          {shipment.receiverName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {shipment.receiverPhone}
                        </p>
                      </td>

                      {/* Status & Route */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold py-0.5",
                              statusInfo.badgeClass
                            )}
                          >
                            {statusInfo.label}
                          </Badge>
                          <div>
                            <Badge variant="outline" className="text-[9px] py-0">
                              {shipment.deliveryType === "LOCAL" ? "Local" : "Inter-District"}
                            </Badge>
                          </div>
                        </div>
                      </td>

                      {/* Courier Rider */}
                      <td className="py-4 px-4">
                        {shipment.courierId ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 font-semibold text-foreground text-xs">
                              <UserCheck className="size-3 text-emerald-500" />
                              <span>Assigned</span>
                            </span>
                            <div>
                              <button
                                type="button"
                                onClick={() => setAssignShipment(shipment)}
                                className="text-[10px] text-primary hover:underline cursor-pointer font-medium block"
                              >
                                Re-assign Rider
                              </button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setAssignShipment(shipment)}
                            className="rounded-xl h-7 px-2.5 text-[11px] gap-1 border-primary/30 text-primary hover:bg-primary/5 cursor-pointer font-bold"
                          >
                            <UserX className="size-3" />
                            <span>Assign Courier</span>
                          </Button>
                        )}
                      </td>

                      {/* Settlement */}
                      <td className="py-4 px-4 font-mono">
                        {shipment.paymentType === "CASH" ? (
                          <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                            <Banknote className="size-3.5" />
                            <span>COD: ৳{shipment.codAmount ?? 0}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="size-3.5" />
                            <span>Prepaid Card</span>
                          </div>
                        )}
                      </td>

                      {/* Dispatch Actions & Details */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {/* Hub Operational Quick Actions */}
                          <HubCheckinActions
                            shipment={shipment}
                            onSuccess={() => refetch()}
                          />

                          <Link
                            href={`/track/${shipment.trackingNumber}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold ml-1"
                            title="Public Tracking View"
                          >
                            <span>Track</span>
                            <ExternalLink className="size-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Courier Assignment Dialog */}
      {assignShipment && (
        <AssignCourierModal
          shipment={assignShipment}
          open={Boolean(assignShipment)}
          onOpenChange={(open) => {
            if (!open) setAssignShipment(null);
          }}
          onSuccess={() => {
            setAssignShipment(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
