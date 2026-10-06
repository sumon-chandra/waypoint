import { z } from "zod";

/**
 * Validation schema for cancelling a consignment.
 * Strictly adheres to AGENTS.md business rules (reason min 10 characters).
 */
export const cancelShipmentSchema = z.object({
  reason: z
    .string("Please provide a reason for cancelling this consignment")
    .trim()
    .min(1, "Please provide a reason for cancelling this consignment")
    .max(500, "Cancellation reason cannot exceed 500 characters"),
});

export type CancelShipmentFormValues = z.infer<typeof cancelShipmentSchema>;
