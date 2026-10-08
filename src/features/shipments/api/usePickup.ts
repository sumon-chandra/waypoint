import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import type { ApiResponse, Shipment } from "@/types";

interface UsePickupParams {
  shipmentId: string;
}

/**
 * Courier mutation to record parcel collection from sender.
 * POST /shipments/:id/pickup
 */
export function usePickup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shipmentId }: UsePickupParams): Promise<Shipment> => {
      const response = await api.post<ApiResponse<Shipment>>(
        `/shipments/${shipmentId}/pickup`,
        {}
      );
      return response.data.data;
    },
    onSuccess: (shipment) => {
      toast.success(
        `Parcel #${shipment.trackingNumber} collected and marked as Picked Up.`
      );
      queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to record parcel pickup. Please try again."
      );
    },
  });
}
