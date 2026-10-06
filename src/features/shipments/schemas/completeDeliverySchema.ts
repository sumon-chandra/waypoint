import { z } from "zod";

/**
 * Validation schema for Courier Delivery Completion.
 * Complies with AGENTS.md Section 9 rules for OTP and Cash-on-Delivery handover.
 */
export const completeDeliverySchema = z.object({
  otp: z
    .string({ error: "Please enter the 4-digit verification OTP" })
    .trim()
    .length(4, "OTP code must be exactly 4 digits")
    .regex(/^\d{4}$/, "OTP code must contain numbers only"),
  cashCollected: z.coerce
    .number({ error: "Please enter a valid cash amount" })
    .nonnegative("Collected cash amount cannot be negative")
    .optional(),
});

export type CompleteDeliveryFormValues = z.infer<typeof completeDeliverySchema>;
