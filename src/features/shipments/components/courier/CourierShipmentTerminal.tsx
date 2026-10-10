"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Phone,
  MapPin,
  Copy,
  Check,
  ArrowLeft,
  Scale,
  Building2,
  History,
  RotateCw,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeliveryStepper } from "@/components/common";
import { useShipmentDetail } from "../../api/useShipmentDetail";
import { CourierStatusActionButtons } from "./CourierStatusActionButtons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CourierShipmentTerminalProps {
  shipmentId: string;
}

export function CourierShipmentTerminal({
  shipmentId,
}: CourierShipmentTerminalProps) {
  const [copied, setCopied] = React.useState(false);

  const {
    data: shipment,
    isLoading,
    isRefetching,
    refetch,
  } = useShipmentDetail(shipmentId);

  const handleCopy = () => {
    if (!shipment) return;
    navigator.clipboard.writeText(shipment.trackingNumber);
    setCopied(true);
    toast.success("Tracking number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded-xl" />
        <div className="h-40 w-full bg-muted rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-muted rounded-3xl" />
          <div className="h-64 bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-4">
        <Package className="size-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold text-foreground">
          Consignment Not Found
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          The requested shipment could not be found or you do not have
          permission to view it.
        </p>
        <Link
          href="/courier/shipments"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-xl text-xs",
          )}
        >
          Return to Delivery Manifest
        </Link>
      </div>
    );
  }

  // Cancellation log if present
  const cancelLog = shipment.trackingLogs?.find(
    (l) => l.toStatus === "CANCELLED",
  );

  return (
    <div className="space-y-8">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/courier/shipments"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "rounded-xl size-10 shrink-0",
            )}
            title="Back to Assigned Shipments"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg sm:text-xl font-black text-foreground">
                #{shipment.trackingNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground p-1 rounded-sm transition-colors cursor-pointer"
                title="Copy tracking number"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Consignment Field Action Terminal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="rounded-xl gap-2 font-medium cursor-pointer"
          >
            <RotateCw
              className={cn(
                "size-3.5",
                isRefetching && "animate-spin text-primary",
              )}
            />
            <span>Refresh</span>
          </Button>

          <CourierStatusActionButtons
            shipment={shipment}
            onStatusChanged={() => refetch()}
          />
        </div>
      </div>

      {/* DYNAMIC SHIPMENT FSM STEPPER (AGENTS.md Section 8) */}
      <DeliveryStepper
        status={shipment.status}
        deliveryType={shipment.deliveryType}
        cancelReason={cancelLog?.notes}
        cancelledAt={cancelLog?.createdAt}
      />

      {/* Recipient & Pickup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipient Delivery Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Destination & Recipient
            </span>
            <Badge variant="outline" className="text-[10px]">
              Drop-off Point
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-lg font-bold text-foreground">
                {shipment.receiverName}
              </p>
              <div className="pt-1">
                <a
                  href={`tel:${shipment.receiverPhone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold px-3 py-1.5 text-xs transition-colors"
                >
                  <Phone className="size-3.5" />
                  <span>Call Recipient ({shipment.receiverPhone})</span>
                </a>
              </div>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                Full Delivery Address:
              </span>
              <p className="leading-relaxed">
                <MapPin className="size-3.5 text-primary inline mr-1" />
                {shipment.receiverAddress || "—"}
              </p>
              <p className="font-medium text-foreground">
                {shipment.receiverUpazila}, {shipment.receiverDistrict}
              </p>
            </div>
          </div>
        </div>

        {/* Sender Pickup Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Sender & Pickup Origin
            </span>
            <Badge variant="outline" className="text-[10px]">
              Collection Point
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                Customer Name / Account
              </span>
              <p className="text-base font-bold text-foreground">
                {shipment.customer?.name || "Registered Customer"}
              </p>
              {shipment.customer?.email && (
                <p className="text-muted-foreground">
                  {shipment.customer.email}
                </p>
              )}
            </div>

            <div className="space-y-1 text-muted-foreground">
              <span className="font-semibold text-foreground">
                Pickup Address:
              </span>
              <p className="leading-relaxed">
                <MapPin className="size-3.5 text-muted-foreground inline mr-1" />
                {shipment.senderAddress || "Origin Sorting Facility"}
              </p>
              <p className="font-medium text-foreground">
                {shipment.senderUpazila}, {shipment.senderDistrict}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-1 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Scale className="size-3.5 text-primary" />
                <span className="font-semibold text-foreground">
                  {shipment.weightKg} kg
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" />
                <span>
                  Origin Hub:{" "}
                  {shipment.originHub?.name || shipment.senderDistrict || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financials & COD Status Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          Payment & Settlement Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1">
            <span className="text-muted-foreground font-medium">
              Payment Type
            </span>
            <p className="text-sm font-bold text-foreground">
              {shipment.paymentType === "CASH"
                ? "Cash on Delivery (COD)"
                : "Card (Stripe)"}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1">
            <span className="text-muted-foreground font-medium">
              Payment Status
            </span>
            <p className="text-sm font-bold text-foreground">
              {shipment.paymentStatus}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
            <span className="text-amber-700 dark:text-amber-400 font-semibold">
              Cash Collection Required
            </span>
            <p className="text-base font-black text-amber-700 dark:text-amber-400 font-mono">
              {shipment.paymentType === "CASH"
                ? `৳${shipment.codAmount ?? 0}`
                : "৳0 (Prepaid)"}
            </p>
          </div>
        </div>
      </div>

      {/* Tracking Audit Logs (AGENTS.md Section 4) */}
      {shipment.trackingLogs && shipment.trackingLogs.length > 0 && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <History className="size-4 text-primary" />
            <span>Consignment Audit Trail</span>
          </div>

          <div className="space-y-3 pt-2">
            {shipment.trackingLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 text-xs border-l-2 border-primary/40 pl-4 py-1"
              >
                <div className="size-2 rounded-full bg-primary mt-1.5 -ml-5" />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground">
                      {log.action}
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0">
                      {log.toStatus.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  {log.notes && (
                    <p className="text-muted-foreground">{log.notes}</p>
                  )}
                  {log.location && (
                    <p className="text-[11px] text-muted-foreground">
                      <MapPin className="size-3 inline mr-1" />
                      {log.location}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                  {new Date(log.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
