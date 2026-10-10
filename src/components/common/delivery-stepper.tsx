"use client";

import * as React from "react";
import { Check, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ShipmentStatus, DeliveryType } from "@/types";
import { cn } from "@/lib/utils";

export interface DeliveryStepperProps {
  status: ShipmentStatus;
  deliveryType: DeliveryType;
  className?: string;
  cancelReason?: string | null;
  cancelledAt?: string | null;
  showHeader?: boolean;
}

interface StepItem {
  status: ShipmentStatus;
  label: string;
  subLabel?: string;
}

// 6 steps for LOCAL (Intra-hub: RECEIVED_AT_ORIGIN_HUB directly links to OUT_FOR_DELIVERY)
const LOCAL_STEPS: StepItem[] = [
  { status: "PENDING", label: "Order Placed", subLabel: "Registered" },
  { status: "ASSIGNED", label: "Courier Assigned", subLabel: "Dispatched" },
  { status: "PICKED_UP", label: "Parcel Collected", subLabel: "In Hand" },
  { status: "RECEIVED_AT_ORIGIN_HUB", label: "In Origin Hub", subLabel: "Checked In" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", subLabel: "Final Mile" },
  { status: "DELIVERED", label: "Delivered", subLabel: "Completed" },
];

// 8 steps for INTER_DISTRICT (Full line-haul highway transit between hubs)
const INTER_DISTRICT_STEPS: StepItem[] = [
  { status: "PENDING", label: "Order Placed", subLabel: "Registered" },
  { status: "ASSIGNED", label: "Courier Assigned", subLabel: "Dispatched" },
  { status: "PICKED_UP", label: "Parcel Collected", subLabel: "In Hand" },
  { status: "RECEIVED_AT_ORIGIN_HUB", label: "In Origin Hub", subLabel: "Origin Hub" },
  { status: "IN_TRANSIT", label: "Line-Haul Transit", subLabel: "Interstate" },
  { status: "RECEIVED_AT_DEST_HUB", label: "At Dest Hub", subLabel: "Dest Hub" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", subLabel: "Final Mile" },
  { status: "DELIVERED", label: "Delivered", subLabel: "Completed" },
];

export function DeliveryStepper({
  status,
  deliveryType,
  className,
  cancelReason,
  cancelledAt,
  showHeader = true,
}: DeliveryStepperProps) {
  const isLocal = deliveryType === "LOCAL";
  const steps = isLocal ? LOCAL_STEPS : INTER_DISTRICT_STEPS;
  const isCancelled = status === "CANCELLED";

  const currentStepIdx = steps.findIndex((step) => step.status === status);

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6",
        className
      )}
    >
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Delivery Pipeline Status
            </h3>
            <p className="text-xs text-muted-foreground">
              {isLocal
                ? "Intra-Hub Local Delivery"
                : "Inter-District Line-Haul Transit (8 Milestones)"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-bold py-1 px-3",
                isLocal
                  ? "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5"
                  : "border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5"
              )}
            >
              {isLocal ? "Local Route" : "Inter-District"}
            </Badge>

            <Badge
              variant={isCancelled ? "destructive" : "outline"}
              className="text-xs font-bold py-1 px-3 border-primary/30 text-primary bg-primary/5 capitalize"
            >
              {status.replace(/_/g, " ").toLowerCase()}
            </Badge>
          </div>
        </div>
      )}

      {/* Terminal Cancelled State */}
      {isCancelled ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-destructive space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <XCircle className="size-5 shrink-0" />
            <span>Consignment Cancelled</span>
          </div>
          <p className="text-xs leading-relaxed text-destructive/90">
            {cancelReason
              ? `Reason: ${cancelReason}`
              : "This shipment was cancelled and is no longer moving through the delivery pipeline."}
          </p>
          {cancelledAt && (
            <p className="text-[11px] text-destructive/70 font-mono">
              Cancelled on: {new Date(cancelledAt).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        /* Stepper Flow */
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center min-w-xl sm:min-w-2xl justify-between">
            {steps.map((step, idx) => {
              const isPassed = currentStepIdx !== -1 && idx <= currentStepIdx;
              const isCurrent = currentStepIdx !== -1 && idx === currentStepIdx;

              return (
                <React.Fragment key={step.status}>
                  <div className="flex flex-col items-center text-center space-y-2 shrink-0">
                    <div
                      className={cn(
                        "size-9 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                        isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-xs"
                          : isPassed
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-muted text-muted-foreground border border-border"
                      )}
                    >
                      {isPassed && !isCurrent ? (
                        <Check className="size-4.5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="space-y-0.5 max-w-24">
                      <span
                        className={cn(
                          "text-[11px] font-semibold leading-tight block",
                          isCurrent
                            ? "text-primary font-bold"
                            : isPassed
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                      {step.subLabel && (
                        <span className="text-[10px] text-muted-foreground/70 hidden sm:block">
                          {step.subLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2 transition-all",
                        idx < currentStepIdx ? "bg-emerald-500" : "bg-border/80"
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryStepper;
