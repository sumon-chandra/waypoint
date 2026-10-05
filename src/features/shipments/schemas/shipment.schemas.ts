import { z } from "zod";
import type {
  Shipment,
  ShipmentDetail,
  ShipmentStatus,
  PaymentStatus,
  PaymentType,
  DeliveryType,
  ShipmentTrackingLog,
  Hub,
  User,
} from "@/types";

export const shipmentStatusEnum = z.enum([
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "RECEIVED_AT_ORIGIN_HUB",
  "IN_TRANSIT",
  "RECEIVED_AT_DEST_HUB",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

export const paymentStatusEnum = z.enum([
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "EXPIRED",
]);

export const paymentTypeEnum = z.enum(["CARD", "CASH"]);

export const deliveryTypeEnum = z.enum(["LOCAL", "INTER_DISTRICT"]);

export type {
  ShipmentStatus,
  PaymentStatus,
  PaymentType,
  DeliveryType,
  ShipmentTrackingLog as TrackingLog,
  ShipmentDetail as ShipmentData,
  Hub as HubInfo,
  User as CourierInfo,
};
