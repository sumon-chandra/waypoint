"use client";

import * as React from "react";
import { Building2, Navigation, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useOriginHubCheckin,
  useDispatchTransit,
  useDestHubCheckin,
} from "../../api/useHubTransitions";
import type { Shipment } from "@/types";

interface HubCheckinActionsProps {
  shipment: Shipment;
  onSuccess?: () => void;
}

export function HubCheckinActions({
  shipment,
  onSuccess,
}: HubCheckinActionsProps) {
  const originCheckin = useOriginHubCheckin();
  const dispatchTransit = useDispatchTransit();
  const destCheckin = useDestHubCheckin();

  const handleOriginCheckin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await originCheckin.mutateAsync({ shipmentId: shipment.id });
    onSuccess?.();
  };

  const handleDispatchTransit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatchTransit.mutateAsync({ shipmentId: shipment.id });
    onSuccess?.();
  };

  const handleDestCheckin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await destCheckin.mutateAsync({ shipmentId: shipment.id });
    onSuccess?.();
  };

  // PICKED_UP -> Ingest into Origin Hub
  if (shipment.status === "PICKED_UP") {
    return (
      <Button
        size="sm"
        disabled={originCheckin.isPending}
        onClick={handleOriginCheckin}
        className="rounded-xl text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs gap-1"
        title="Ingest parcel at Origin Sorting Hub"
      >
        {originCheckin.isPending ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <Building2 className="size-3" />
        )}
        <span>Origin Check-In</span>
      </Button>
    );
  }

  // RECEIVED_AT_ORIGIN_HUB (for INTER_DISTRICT only) -> Dispatch Line-Haul Highway Transit
  if (
    shipment.status === "RECEIVED_AT_ORIGIN_HUB" &&
    shipment.deliveryType === "INTER_DISTRICT"
  ) {
    return (
      <Button
        size="sm"
        disabled={dispatchTransit.isPending}
        onClick={handleDispatchTransit}
        className="rounded-xl text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs gap-1"
        title="Dispatch highway line-haul transit between hubs"
      >
        {dispatchTransit.isPending ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <Navigation className="size-3" />
        )}
        <span>Dispatch Transit</span>
      </Button>
    );
  }

  // IN_TRANSIT -> Ingest into Destination Hub
  if (shipment.status === "IN_TRANSIT") {
    return (
      <Button
        size="sm"
        disabled={destCheckin.isPending}
        onClick={handleDestCheckin}
        className="rounded-xl text-[11px] font-bold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-xs gap-1"
        title="Ingest parcel at Destination Sorting Hub"
      >
        {destCheckin.isPending ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <MapPin className="size-3" />
        )}
        <span>Dest Check-In</span>
      </Button>
    );
  }

  return null;
}
