/**
 * Hub types for Waypoint nationwide logistics network
 * Strictly aligns with Prisma models in AGENTS.md Section 4.
 */

export type HubStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Hub {
  id: string;
  code: string;
  name: string;
  district: string;
  division: string;
  upazila: string;
  address: string;
  cutoff: string;
  capacity: number;
  phone: string;
  isGateway: boolean;
  status: HubStatus;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHubBody {
  code: string;
  name: string;
  district: string;
  division: string;
  upazila: string;
  address: string;
  cutoff: string;
  capacity: number;
  phone: string;
  isGateway?: boolean;
  status?: HubStatus;
  latitude?: number;
  longitude?: number;
}
