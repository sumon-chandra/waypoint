import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import type { ApiResponse, Shipment } from "@/types";

interface CompleteDeliveryParams {
  shipmentId: string;
  otp: string;
  cashCollected?: number;
}

/**
 * Courier mutation to finalize parcel delivery upon OTP verification and cash collection.
 * POST /shipments/:id/complete-delivery
 */
export function useCompleteDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shipmentId,
      otp,
      cashCollected,
    }: CompleteDeliveryParams): Promise<Shipment> => {
      const response = await api.post<ApiResponse<Shipment>>(
        `/shipments/${shipmentId}/complete-delivery`,
        {
          otp,
          ...(typeof cashCollected === "number" ? { cashCollected } : {}),
        }
      );
      return response.data.data;
    },
    onSuccess: (shipment) => {
      toast.success(
        `Consignment #${shipment.trackingNumber} successfully delivered!`,
        {
          description:
            "Automated proof-of-delivery receipts dispatched to sender and recipient emails.",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to verify OTP or complete delivery. Please check the code and try again."
      );
    },
  });
}
