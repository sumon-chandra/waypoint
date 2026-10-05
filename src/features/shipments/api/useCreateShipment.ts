import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import type { ApiResponse, Shipment, CreateShipmentBody } from "@/types";

/**
 * TanStack Query mutation hook for booking a new consignment.
 * POST /shipments
 * Invalidates shipment list queries on success.
 */
export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateShipmentBody): Promise<Shipment> => {
      const response = await api.post<ApiResponse<Shipment>>("/shipments", body);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
      toast.success("Consignment booked successfully!", {
        description: `Waybill tracking #${data.trackingNumber} generated.`,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to book consignment. Please check input values.");
    },
  });
}
