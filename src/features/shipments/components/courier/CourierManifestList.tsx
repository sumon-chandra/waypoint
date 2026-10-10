"use client";

import * as React from "react";
import {
  Search,
  PackageCheck,
  Truck,
  CheckCircle2,
  Filter,
  Layers,
  Inbox,
  RotateCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CourierShipmentCard } from "./CourierShipmentCard";
import { useCourierShipments } from "../../api/useCourierShipments";
import type { ShipmentStatus, DeliveryType } from "@/types";
import { cn } from "@/lib/utils";

type ManifestTab = "ALL" | "ASSIGNED" | "OUT_FOR_DELIVERY" | "DELIVERED";

export function CourierManifestList() {
  const [activeTab, setActiveTab] = React.useState<ManifestTab>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = React.useState<string>("ALL");

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
  } = useCourierShipments({
    status: activeTab === "ALL" ? undefined : activeTab,
    deliveryType: deliveryTypeFilter === "ALL" ? undefined : (deliveryTypeFilter as DeliveryType),
  });

  const shipments = data?.shipments ?? [];

  // Client-side search filtering by trackingNumber, receiverName, receiverPhone, or district
  const filteredShipments = React.useMemo(() => {
    if (!searchQuery.trim()) return shipments;
    const q = searchQuery.toLowerCase().trim();
    return shipments.filter(
      (s) =>
        s.trackingNumber.toLowerCase().includes(q) ||
        s.receiverName.toLowerCase().includes(q) ||
        s.receiverPhone.includes(q) ||
        (s.receiverEmail && s.receiverEmail.toLowerCase().includes(q)) ||
        s.receiverDistrict?.toLowerCase().includes(q) ||
        s.receiverAddress?.toLowerCase().includes(q)
    );
  }, [shipments, searchQuery]);

  // Tab count indicators
  const tabCounts = React.useMemo(() => {
    return {
      ALL: shipments.length,
      ASSIGNED: shipments.filter((s) => s.status === "ASSIGNED").length,
      OUT_FOR_DELIVERY: shipments.filter((s) => s.status === "OUT_FOR_DELIVERY").length,
      DELIVERED: shipments.filter((s) => s.status === "DELIVERED").length,
    };
  }, [shipments]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by tracking #, recipient, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-2xl h-11 text-xs sm:text-sm"
          />
        </div>

        {/* Route Filter & Refresh */}
        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select
              value={deliveryTypeFilter}
              onChange={(e) => setDeliveryTypeFilter(e.target.value)}
              className="rounded-2xl h-11 text-xs"
            >
              <option value="ALL">All Delivery Types</option>
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
            title="Refresh manifest"
          >
            <RotateCw
              className={cn("size-4", isRefetching && "animate-spin text-primary")}
            />
          </Button>
        </div>
      </div>

      {/* Segmented Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border select-none",
            activeTab === "ALL"
              ? "bg-primary text-primary-foreground border-primary shadow-xs"
              : "border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Layers className="size-3.5" />
          <span>All Assigned</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.2 text-[10px]",
              activeTab === "ALL"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {tabCounts.ALL}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ASSIGNED")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border select-none",
            activeTab === "ASSIGNED"
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <PackageCheck className="size-3.5" />
          <span>To Pick Up</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.2 text-[10px]",
              activeTab === "ASSIGNED"
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {tabCounts.ASSIGNED}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("OUT_FOR_DELIVERY")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border select-none",
            activeTab === "OUT_FOR_DELIVERY"
              ? "bg-orange-600 text-white border-orange-600 shadow-xs"
              : "border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Truck className="size-3.5" />
          <span>Out for Delivery</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.2 text-[10px]",
              activeTab === "OUT_FOR_DELIVERY"
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {tabCounts.OUT_FOR_DELIVERY}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DELIVERED")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border select-none",
            activeTab === "DELIVERED"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <CheckCircle2 className="size-3.5" />
          <span>Delivered</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.2 text-[10px]",
              activeTab === "DELIVERED"
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {tabCounts.DELIVERED}
          </span>
        </button>
      </div>

      {/* Main List Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-32 bg-muted rounded-md" />
                <div className="h-5 w-20 bg-muted rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-muted rounded-md" />
                <div className="h-3 w-64 bg-muted rounded-md" />
              </div>
              <div className="h-10 w-full bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-4">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Inbox className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              No Shipments Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No consignments matched your search query "${searchQuery}".`
                : "You currently have no consignments assigned under this status filter."}
            </p>
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="rounded-xl text-xs"
            >
              Clear Search Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredShipments.map((shipment) => (
            <CourierShipmentCard
              key={shipment.id}
              shipment={shipment}
              onStatusChanged={() => refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
