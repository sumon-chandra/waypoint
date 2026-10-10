import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import type { ApiResponse, Shipment } from "@/types";

interface HubTransitionParams {
  shipmentId: string;
  notes?: string;
}

/**
 * Hub mutation: Check-in parcel at Origin Hub.
 * POST /shipments/:id/origin-hub-checkin
 */
export function useOriginHubCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shipmentId,
      notes,
    }: HubTransitionParams): Promise<Shipment> => {
      const response = await api.post<ApiResponse<Shipment>>(
        `/shipments/${shipmentId}/origin-hub-checkin`,
        notes ? { notes } : {}
      );
      return response.data.data;
    },
    onSuccess: (shipment) => {
      toast.success(
        `Shipment #${shipment.trackingNumber} successfully checked in at Origin Hub.`
      );
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to record origin hub check-in. Please try again."
      );
    },
  });
}

/**
 * Hub/Courier mutation: Dispatch line-haul highway transit between hubs.
 * POST /shipments/:id/dispatch-transit
 */
export function useDispatchTransit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shipmentId,
      notes,
    }: HubTransitionParams): Promise<Shipment> => {
      const response = await api.post<ApiResponse<Shipment>>(
        `/shipments/${shipmentId}/dispatch-transit`,
        notes ? { notes } : {}
      );
      return response.data.data;
    },
    onSuccess: (shipment) => {
      toast.success(
        `Shipment #${shipment.trackingNumber} dispatched for Line-Haul Transit.`
      );
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to dispatch line-haul transit. Please try again."
      );
    },
  });
}

/**
 * Hub/Courier mutation: Check-in parcel at Destination Hub.
 * POST /shipments/:id/dest-hub-checkin
 */
export function useDestHubCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shipmentId,
      notes,
    }: HubTransitionParams): Promise<Shipment> => {
      const response = await api.post<ApiResponse<Shipment>>(
        `/shipments/${shipmentId}/dest-hub-checkin`,
        notes ? { notes } : {}
      );
      return response.data.data;
    },
    onSuccess: (shipment) => {
      toast.success(
        `Shipment #${shipment.trackingNumber} arrived and checked in at Destination Hub.`
      );
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to record destination hub check-in. Please try again."
      );
    },
  });
}
