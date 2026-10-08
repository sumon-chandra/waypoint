import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";

interface UseResendOtpParams {
  shipmentId: string;
}

/**
 * Courier / Customer mutation to trigger a new delivery verification OTP.
 * POST /shipments/:id/resend-delivery-otp
 */
export function useResendDeliveryOtp() {
  return useMutation({
    mutationFn: async ({ shipmentId }: UseResendOtpParams): Promise<null> => {
      const response = await api.post<ApiResponse<null>>(
        `/shipments/${shipmentId}/resend-delivery-otp`,
        {}
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast.success("A fresh 4-digit verification OTP has been sent to the recipient.");
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to resend delivery OTP. Please wait before requesting another."
      );
    },
  });
}
