import { z } from "zod";

export const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;
export const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Zod validation schema for creating and editing sorting hubs.
 * Aligns strictly with AGENTS.md Section 3.3 CreateHubBody.
 */
export const createHubSchema = z.object({
  code: z
    .string({ error: "Hub short code cannot be empty" })
    .trim()
    .min(1, "Hub short code cannot be empty")
    .max(12, "Hub short code is too long (maximum 12 characters)")
    .toUpperCase(),
  name: z
    .string({ error: "Hub facility name cannot be empty" })
    .trim()
    .min(1, "Hub facility name cannot be empty")
    .max(100, "Hub facility name is too long"),
  district: z
    .string({ error: "Please select a hub district" })
    .trim()
    .min(1, "Please select a hub district"),
  division: z
    .string({ error: "Please select an administrative division" })
    .trim()
    .min(1, "Please select an administrative division"),
  upazila: z
    .string({ error: "Hub upazila/thana cannot be empty" })
    .trim()
    .min(1, "Hub upazila/thana cannot be empty"),
  address: z
    .string({ error: "Hub street address cannot be empty" })
    .trim()
    .min(1, "Hub street address cannot be empty"),
  cutoff: z
    .string({ error: "Daily dispatch cutoff time is required" })
    .trim()
    .regex(TIME_REGEX, "Please provide a valid cutoff time in HH:mm format (e.g. 18:00)"),
  capacity: z.coerce
    .number({ error: "Please enter a valid package capacity" })
    .int("Capacity must be a whole number")
    .positive("Capacity must be greater than zero"),
  phone: z
    .string({ error: "Facility contact phone number is required" })
    .trim()
    .regex(
      BD_PHONE_REGEX,
      "Please provide an 11-digit Bangladeshi mobile number (e.g. 01712345678)"
    ),
  isGateway: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).default("ACTIVE"),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
});

export type CreateHubFormValues = z.infer<typeof createHubSchema>;
