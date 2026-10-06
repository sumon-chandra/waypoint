import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import type { ApiResponse, Shipment } from "@/types";

interface UseOutForDeliveryParams {
  shipmentId: string;
}

/**
 * Courier mutation to initiate last-mile delivery to the recipient.
 * POST /shipments/:id/out-for-delivery
 */
export function useOutForDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shipmentId,
    }: UseOutForDeliveryParams): Promise<Shipment> => {
      const response = await api.post<ApiResponse<Shipment>>(
        `/shipments/${shipmentId}/out-for-delivery`
      );
      return response.data.data;
    },
    onSuccess: (shipment) => {
      toast.success(
        `Shipment #${shipment.trackingNumber} is now Out for Delivery.`
      );
      queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to update status to Out for Delivery. Please try again."
      );
    },
  });
}
