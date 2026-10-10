"use client";

import * as React from "react";
import {
  PackageCheck,
  Building2,
  Truck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePickup } from "../../api/usePickup";
import {
  useOriginHubCheckin,
  useDispatchTransit,
  useDestHubCheckin,
} from "../../api/useHubTransitions";
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
  const originHubCheckinMutation = useOriginHubCheckin();
  const dispatchTransitMutation = useDispatchTransit();
  const destHubCheckinMutation = useDestHubCheckin();
  const outForDeliveryMutation = useOutForDelivery();

  const isAnyPending =
    pickupMutation.isPending ||
    originHubCheckinMutation.isPending ||
    dispatchTransitMutation.isPending ||
    destHubCheckinMutation.isPending ||
    outForDeliveryMutation.isPending;

  const handlePickup = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await pickupMutation.mutateAsync({ shipmentId: shipment.id });
    onStatusChanged?.();
  };

  const handleOriginHubCheckin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await originHubCheckinMutation.mutateAsync({ shipmentId: shipment.id });
    onStatusChanged?.();
  };

  const handleDispatchTransit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatchTransitMutation.mutateAsync({ shipmentId: shipment.id });
    onStatusChanged?.();
  };

  const handleDestHubCheckin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await destHubCheckinMutation.mutateAsync({ shipmentId: shipment.id });
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

  const isInterDistrict = shipment.deliveryType === "INTER_DISTRICT";

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        {/* 1. ASSIGNED -> Collect Parcel (Pickup) */}
        {shipment.status === "ASSIGNED" && (
          <Button
            size={size}
            disabled={isAnyPending}
            onClick={handlePickup}
            className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            {pickupMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Collecting Parcel...</span>
              </>
            ) : (
              <>
                <PackageCheck className="size-3.5" />
                <span>Collect Parcel (Pickup)</span>
              </>
            )}
          </Button>
        )}

        {/* 2. PICKED_UP -> Drop at Origin Hub */}
        {shipment.status === "PICKED_UP" && (
          <Button
            size={size}
            disabled={isAnyPending}
            onClick={handleOriginHubCheckin}
            className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            {originHubCheckinMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Checking In...</span>
              </>
            ) : (
              <>
                <Building2 className="size-3.5" />
                <span>Drop at Origin Hub</span>
              </>
            )}
          </Button>
        )}

        {/* 3. RECEIVED_AT_ORIGIN_HUB */}
        {shipment.status === "RECEIVED_AT_ORIGIN_HUB" && (
          <>
            {isInterDistrict ? (
              /* INTER_DISTRICT -> Dispatch Line-Haul Transit */
              <Button
                size={size}
                disabled={isAnyPending}
                onClick={handleDispatchTransit}
                className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs gap-1.5"
              >
                {dispatchTransitMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Truck className="size-3.5" />
                    <span>Dispatch Line-Haul Transit</span>
                  </>
                )}
              </Button>
            ) : (
              /* LOCAL -> Start Delivery Run */
              <Button
                size={size}
                disabled={isAnyPending}
                onClick={handleOutForDelivery}
                className="rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white cursor-pointer shadow-xs gap-1.5"
              >
                {outForDeliveryMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Starting Delivery Run...</span>
                  </>
                ) : (
                  <>
                    <Truck className="size-3.5" />
                    <span>Start Delivery Run</span>
                  </>
                )}
              </Button>
            )}
          </>
        )}

        {/* 4. IN_TRANSIT -> Receive at Destination Hub */}
        {shipment.status === "IN_TRANSIT" && (
          <Button
            size={size}
            disabled={isAnyPending}
            onClick={handleDestHubCheckin}
            className="rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            {destHubCheckinMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Receiving at Hub...</span>
              </>
            ) : (
              <>
                <Building2 className="size-3.5" />
                <span>Receive at Destination Hub</span>
              </>
            )}
          </Button>
        )}

        {/* 5. RECEIVED_AT_DEST_HUB -> Start Delivery Run */}
        {shipment.status === "RECEIVED_AT_DEST_HUB" && (
          <Button
            size={size}
            disabled={isAnyPending}
            onClick={handleOutForDelivery}
            className="rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            {outForDeliveryMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Starting Delivery Run...</span>
              </>
            ) : (
              <>
                <Truck className="size-3.5" />
                <span>Start Delivery Run</span>
              </>
            )}
          </Button>
        )}

        {/* 6. OUT_FOR_DELIVERY -> Complete Delivery (Opens OTP Modal) */}
        {shipment.status === "OUT_FOR_DELIVERY" && (
          <Button
            size={size}
            onClick={handleOpenCompleteModal}
            className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            <ShieldCheck className="size-3.5" />
            <span>Complete Delivery</span>
          </Button>
        )}

        {/* PENDING -> Not yet assigned to courier */}
        {shipment.status === "PENDING" && (
          <Badge
            variant="outline"
            className="rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1 font-semibold py-1 px-2.5 text-xs"
          >
            <Clock className="size-3.5" />
            <span>Order Placed</span>
          </Badge>
        )}

        {/* DELIVERED -> Terminal State */}
        {shipment.status === "DELIVERED" && (
          <Badge
            variant="default"
            className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 font-semibold py-1 px-2.5 text-xs"
          >
            <CheckCircle2 className="size-3.5" />
            <span>Delivered</span>
          </Badge>
        )}

        {/* CANCELLED -> Terminal State */}
        {shipment.status === "CANCELLED" && (
          <Badge
            variant="destructive"
            className="rounded-lg gap-1 font-semibold py-1 px-2.5 text-xs"
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

export default CourierStatusActionButtons;
