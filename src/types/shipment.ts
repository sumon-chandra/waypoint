import type { User } from "./user";
import type { Hub } from "./hub";
import type { Payment, PaymentStatus, PaymentType } from "./payment";

/**
 * Shipment domain types for Waypoint
 * Strictly aligns with Prisma models in AGENTS.md Section 4.
 */

export type DeliveryType = "LOCAL" | "INTER_DISTRICT";

export type ShipmentStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PICKED_UP"
  | "RECEIVED_AT_ORIGIN_HUB"
  | "IN_TRANSIT"
  | "RECEIVED_AT_DEST_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Shipment {
  id: string;
  trackingNumber: string;
  receiverName: string;
  receiverPhone: string;
  weightKg: number;
  status: ShipmentStatus;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  codAmount: number | null;
  senderAddress: string | null;
  senderDistrict: string | null;
  senderUpazila: string | null;
  receiverAddress: string | null;
  receiverDistrict: string | null;
  receiverUpazila: string | null;
  deliveryType: DeliveryType;
  customerId: string;
  courierId: string | null;
  originHubId: string | null;
  destinationHubId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentTrackingLog {
  id: string;
  shipmentId: string;
  fromStatus: ShipmentStatus | null;
  toStatus: ShipmentStatus;
  action: string;
  actorId: string;
  location: string | null;
  notes: string | null;
  createdAt: string;
}

export interface ShipmentDetail extends Shipment {
  customer: User | null;
  courier: User | null;
  originHub: Hub | null;
  destinationHub: Hub | null;
  trackingLogs: ShipmentTrackingLog[];
  payment: Payment | null;
}

export interface CreateShipmentBody {
  receiverName: string;
  receiverPhone: string;
  weightKg: number;
  deliveryType: DeliveryType;
  paymentType: PaymentType;
  codAmount?: number;
  senderAddress?: string;
  senderDistrict?: string;
  senderUpazila?: string;
  receiverAddress?: string;
  receiverDistrict?: string;
  receiverUpazila?: string;
}

export interface CancelShipmentBody {
  reason: string;
}

export interface AssignCourierBody {
  courierId: string;
}

export interface CompleteDeliveryBody {
  otp: string;
  cashCollected?: number;
}
