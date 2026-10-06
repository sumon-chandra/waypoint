"use client";

import * as React from "react";
import {
  PackageCheck,
  Truck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePickup } from "../../api/usePickup";
import { useOutForDelivery } from "../../api/useOutForDelivery";
import { CompleteDeliveryModal } from "./CompleteDeliveryModal";
import type { Shipment, ShipmentDetail } from "@/types";
import { cn } from "@/lib/utils";

interface CourierStatusActionButtonsProps {
  shipment: Shipment | ShipmentDetail;
  size?: "default" | "sm";
  className?: string;
  onStatusChanged?: () => void;
}

export function CourierStatusActionButtons({
  shipment,
  size = "default",
  className,
  onStatusChanged,
}: CourierStatusActionButtonsProps) {
  const [completeModalOpen, setCompleteModalOpen] = React.useState(false);

  const pickupMutation = usePickup();
  const outForDeliveryMutation = useOutForDelivery();

  const handlePickup = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await pickupMutation.mutateAsync({ shipmentId: shipment.id });
    onStatusChanged?.();
  };

  const handleOutForDelivery = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await outForDeliveryMutation.mutateAsync({ shipmentId: shipment.id });
    onStatusChanged?.();
  };

  const handleOpenCompleteModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCompleteModalOpen(true);
  };

  // Render contextual action based on FSM state
  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        {/* ASSIGNED -> Pickup Parcel */}
        {shipment.status === "ASSIGNED" && (
          <Button
            size={size}
            disabled={pickupMutation.isPending}
            onClick={handlePickup}
            className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            {pickupMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Marking Picked Up...</span>
              </>
            ) : (
              <>
                <PackageCheck className="size-3.5" />
                <span>Mark Picked Up</span>
              </>
            )}
          </Button>
        )}

        {/* Hub / Sorting states -> Out for Delivery */}
        {(shipment.status === "PICKED_UP" ||
          shipment.status === "RECEIVED_AT_ORIGIN_HUB" ||
          shipment.status === "IN_TRANSIT" ||
          shipment.status === "RECEIVED_AT_DEST_HUB") && (
          <Button
            size={size}
            disabled={outForDeliveryMutation.isPending}
            onClick={handleOutForDelivery}
            className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            {outForDeliveryMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Dispatching...</span>
              </>
            ) : (
              <>
                <Truck className="size-3.5" />
                <span>Out for Delivery</span>
              </>
            )}
          </Button>
        )}

        {/* OUT_FOR_DELIVERY -> Handover with OTP & COD Modal */}
        {shipment.status === "OUT_FOR_DELIVERY" && (
          <Button
            size={size}
            onClick={handleOpenCompleteModal}
            className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            <ShieldCheck className="size-3.5" />
            <span>Verify & Handover</span>
          </Button>
        )}

        {/* Terminal state: DELIVERED */}
        {shipment.status === "DELIVERED" && (
          <Badge
            variant="default"
            className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 font-semibold py-1 px-2.5"
          >
            <CheckCircle2 className="size-3.5" />
            <span>Delivered</span>
          </Badge>
        )}

        {/* Terminal state: CANCELLED */}
        {shipment.status === "CANCELLED" && (
          <Badge
            variant="destructive"
            className="rounded-lg gap-1 font-semibold py-1 px-2.5"
          >
            <XCircle className="size-3.5" />
            <span>Cancelled</span>
          </Badge>
        )}
      </div>

      {/* Complete Delivery Modal */}
      {completeModalOpen && (
        <CompleteDeliveryModal
          shipment={shipment}
          open={completeModalOpen}
          onOpenChange={setCompleteModalOpen}
          onSuccess={onStatusChanged}
        />
      )}
    </>
  );
}
