"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Phone,
  MapPin,
  Banknote,
  ShieldCheck,
  ChevronRight,
  Copy,
  Check,
  Scale,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CourierStatusActionButtons } from "./CourierStatusActionButtons";
import type { Shipment, ShipmentStatus } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CourierShipmentCardProps {
  shipment: Shipment;
  onStatusChanged?: () => void;
}

const STATUS_CONFIG: Record<
  ShipmentStatus,
  { label: string; badgeClass: string }
> = {
  PENDING: {
    label: "Order Placed",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  ASSIGNED: {
    label: "Courier Assigned",
    badgeClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  PICKED_UP: {
    label: "Parcel Collected",
    badgeClass:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  RECEIVED_AT_ORIGIN_HUB: {
    label: "In Origin Hub",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  IN_TRANSIT: {
    label: "Line-Haul Transit",
    badgeClass:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  RECEIVED_AT_DEST_HUB: {
    label: "At Destination Hub",
    badgeClass:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    badgeClass:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  DELIVERED: {
    label: "Delivered",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function CourierShipmentCard({
  shipment,
  onStatusChanged,
}: CourierShipmentCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(shipment.trackingNumber);
    setCopied(true);
    toast.success("Tracking number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const statusMeta = STATUS_CONFIG[shipment.status] || {
    label: shipment.status,
    badgeClass: "bg-muted text-muted-foreground",
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4 transition-all hover:border-border hover:shadow-md">
      {/* Top Bar: Tracking #, Status Badge, Route Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Package className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-bold text-foreground">
                {shipment.trackingNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded-sm transition-colors cursor-pointer"
                title="Copy tracking number"
              >
                {copied ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {new Date(shipment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold py-0.5",
              statusMeta.badgeClass,
            )}
          >
            {statusMeta.label}
          </Badge>
          <Badge variant="outline" className="text-[10px] py-0.5">
            {shipment.deliveryType === "LOCAL" ? "Local" : "Inter-District"}
          </Badge>
        </div>
      </div>

      {/* Recipient & Address Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Recipient Contact */}
        <div className="space-y-1.5 rounded-2xl bg-muted/30 p-3.5 border border-border/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Recipient
          </span>
          <p className="font-bold text-foreground text-sm">
            {shipment.receiverName}
          </p>
          <a
            href={`tel:${shipment.receiverPhone}`}
            className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="size-3 shrink-0" />
            <span>{shipment.receiverPhone}</span>
          </a>
          {shipment.receiverEmail && (
            <div className="pt-0.5">
              <a
                href={`mailto:${shipment.receiverEmail}`}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline text-[11px] truncate max-w-full"
                onClick={(e) => e.stopPropagation()}
                title={shipment.receiverEmail}
              >
                <Mail className="size-3 shrink-0" />
                <span className="truncate">{shipment.receiverEmail}</span>
              </a>
            </div>
          )}
          <p className="text-muted-foreground text-[11px] line-clamp-2 pt-0.5">
            <MapPin className="size-3 text-muted-foreground inline mr-1" />
            {shipment.receiverAddress || "—"} ({shipment.receiverUpazila},{" "}
            {shipment.receiverDistrict})
          </p>
        </div>

        {/* Sender / Origin Details */}
        <div className="space-y-1.5 rounded-2xl bg-muted/30 p-3.5 border border-border/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Pickup Origin
          </span>
          <p className="font-bold text-foreground text-sm">
            {shipment.senderDistrict || "Origin Hub"}
          </p>
          <p className="text-muted-foreground text-[11px] line-clamp-2 pt-0.5">
            <MapPin className="size-3 text-muted-foreground inline mr-1" />
            {shipment.senderAddress || "—"} ({shipment.senderUpazila},{" "}
            {shipment.senderDistrict})
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Scale className="size-3" />
              <span>{shipment.weightKg} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment / COD Tag */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div>
          {shipment.paymentType === "CASH" ? (
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-bold text-amber-700 dark:text-amber-400">
              <Banknote className="size-3.5" />
              <span>COD Due: ৳{shipment.codAmount ?? 0}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>Prepaid Card</span>
            </div>
          )}
        </div>

        <Link
          href={`/courier/shipments/${shipment.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>View Terminal</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
        <CourierStatusActionButtons
          shipment={shipment}
          size="sm"
          onStatusChanged={onStatusChanged}
        />

        <Link
          href={`/courier/shipments/${shipment.id}`}
          className="text-xs text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1"
        >
          <span>Full Details</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
