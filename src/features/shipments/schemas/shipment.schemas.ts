import { z } from "zod";

export const shipmentStatusEnum = z.enum([
  "PENDING",
  "BOOKED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
]);
export type ShipmentStatus = z.infer<typeof shipmentStatusEnum>;

export const paymentStatusEnum = z.enum([
  "PAID",
  "UNPAID",
  "COD_PENDING",
  "COLLECTED",
  "FAILED",
]);
export type PaymentStatus = z.infer<typeof paymentStatusEnum>;

export const paymentTypeEnum = z.enum(["CARD", "COD", "MOBILE_BANKING"]);
export type PaymentType = z.infer<typeof paymentTypeEnum>;

export const deliveryTypeEnum = z.enum(["LOCAL", "INTERCITY"]);
export type DeliveryType = z.infer<typeof deliveryTypeEnum>;

/** Hub object shape when included in shipment response */
export interface HubInfo {
  id: string;
  code: string;
  name: string;
  district: string;
  division: string;
  upazila: string;
  address: string;
}

/** Courier (User) shape when included in shipment response */
export interface CourierInfo {
  id: string;
  name: string;
  phone?: string | null;
  email?: string;
}

/** Tracking log entry from ShipmentTrackingLog model */
export interface TrackingLog {
  id: string;
  fromStatus: ShipmentStatus | null;
  toStatus: ShipmentStatus;
  action: string;
  actorId: string;
  location: string | null;
  notes: string | null;
  createdAt: string;
}

/** Core shipment data shape matching the Prisma Shipment model */
export interface ShipmentData {
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
  // Populated relations (may be null if not included by backend)
  originHub: HubInfo | null;
  destinationHub: HubInfo | null;
  courier: CourierInfo | null;
  trackingLogs: TrackingLog[];
  createdAt: string;
  updatedAt: string;
}
