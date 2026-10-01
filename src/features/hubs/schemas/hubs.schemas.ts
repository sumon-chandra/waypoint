import { z } from "zod";

export const hubStatusEnum = z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]);
export type HubStatus = z.infer<typeof hubStatusEnum>;

/**
 * Bangladesh 8 official administrative divisions
 */
export const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
] as const;

export type BangladeshDivision = (typeof BANGLADESH_DIVISIONS)[number];

/**
 * Runtime Zod validation schema for backend Hub entity
 * Exact alignment with backend Prisma model
 */
export const hubSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  district: z.string(),
  division: z.string(),
  upazila: z.string(),
  address: z.string(),
  cutoff: z.string(),
  capacity: z.number(),
  phone: z.string(),
  isGateway: z.boolean().default(false),
  status: hubStatusEnum.default("ACTIVE"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  _count: z
    .object({
      originShipments: z.number().optional(),
      destinationShipments: z.number().optional(),
      couriers: z.number().optional(),
    })
    .optional(),
});

export type Hub = z.infer<typeof hubSchema>;

export interface HubFilterParams {
  division?: string;
  district?: string;
  status?: string;
  search?: string;
}
