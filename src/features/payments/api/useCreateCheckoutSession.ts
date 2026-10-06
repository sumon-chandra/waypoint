import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { ApiResponse, CreateCheckoutSessionResponse } from "@/types";

interface CreateCheckoutSessionParams {
  shipmentId: string;
}

/**
 * Initiates a Stripe Checkout Session for a consignment.
 * Calls POST /payments/create-checkout-session { shipmentId }
 * and navigates to data.paymentUrl on success.
 */
export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async ({ shipmentId }: CreateCheckoutSessionParams) => {
      const response = await api.post<
        ApiResponse<CreateCheckoutSessionResponse>
      >("/payments/create-checkout-session", { shipmentId });

      // Backend returns standard envelope: { success: true, data: { url: "..." } }
      const payload = response.data;
      if (!payload?.data?.paymentUrl) {
        throw new Error(
          payload?.message || "Payment checkout link could not be generated.",
        );
      }

      return payload.data;
    },
    onSuccess: (data) => {
      toast.loading("Redirecting to secure Stripe payment gateway...");
      if (typeof window !== "undefined" && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to initialize payment session. Please try again.",
      );
    },
  });
}
