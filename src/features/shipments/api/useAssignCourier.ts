import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import type { ApiResponse, Shipment } from "@/types";

interface AssignCourierParams {
  shipmentId: string;
  courierId: string;
  courierName?: string;
}

/**
 * Admin mutation to assign a courier rider to a shipment.
 * PATCH /shipments/:id/assign-courier
 */
export function useAssignCourier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shipmentId,
      courierId,
    }: AssignCourierParams): Promise<Shipment> => {
      const response = await api.patch<ApiResponse<Shipment>>(
        `/shipments/${shipmentId}/assign-courier`,
        { courierId }
      );
      return response.data.data;
    },
    onSuccess: (shipment, variables) => {
      toast.success(
        variables.courierName
          ? `Courier ${variables.courierName} assigned to shipment #${shipment.trackingNumber}`
          : `Courier assigned to shipment #${shipment.trackingNumber}`
      );
      queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign courier. Please try again.");
    },
  });
}
