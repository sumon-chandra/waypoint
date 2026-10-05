import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import type { ApiResponse, Shipment } from "@/types";

interface CancelShipmentParams {
  id: string;
  reason: string;
}

/**
 * Mutation hook for cancelling a consignment in PENDING status.
 * POST /shipments/:id/cancel
 */
export function useCancelShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: CancelShipmentParams): Promise<Shipment> => {
      const response = await api.post<ApiResponse<Shipment>>(
        `/shipments/${encodeURIComponent(id)}/cancel`,
        { reason }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: shipmentKeys.detail(data.id) });
      }
      if (data?.trackingNumber) {
        queryClient.invalidateQueries({ queryKey: shipmentKeys.track(data.trackingNumber) });
      }

      toast.success("Shipment Cancelled", {
        description: `Consignment #${data.trackingNumber} has been successfully cancelled.`,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not cancel shipment. Only pending shipments can be cancelled.");
    },
  });
}
