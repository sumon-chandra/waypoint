import { z } from "zod";

/**
 * Validation schema for cancelling a consignment.
 * Strictly adheres to AGENTS.md business rules (reason min 10 characters).
 */
export const cancelShipmentSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, "Cancellation reason must be at least 10 characters")
    .max(500, "Cancellation reason cannot exceed 500 characters"),
});

export type CancelShipmentFormValues = z.infer<typeof cancelShipmentSchema>;
