import { z } from "zod";

/** Bangladeshi mobile number format: 11 digits starting with 01[3-9] */
export const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

/** Cost calculation strictly matching Waypoint logistics backend */
export function calculateDeliveryCost(weightKg: number) {
  const baseFee = 100;
  const perKgRate = 100;
  const safeWeight = isNaN(weightKg) || weightKg <= 0 ? 1 : weightKg;
  const totalAmount = baseFee + safeWeight * perKgRate;
  const amountInCents = Math.round(totalAmount * 100);
  return { baseFee, perKgRate, totalAmount, amountInCents };
}

/** Stage 1: Sender Origin */
export const senderGroupSchema = z.object({
  address: z
    .string()
    .trim()
    .min(5, "Sender street address must be at least 5 characters"),
  district: z
    .string()
    .trim()
    .min(1, "Please select sender district"),
  upazila: z
    .string()
    .trim()
    .min(1, "Please select sender upazila/thana"),
});

/** Stage 2: Recipient Destination */
export const receiverGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100, "Recipient name is too long"),
  phone: z
    .string()
    .trim()
    .regex(
      BD_PHONE_REGEX,
      "Invalid phone number. Must be 11 digits starting with 01 (e.g. 01712345678)"
    ),
  address: z
    .string()
    .trim()
    .min(5, "Recipient street address must be at least 5 characters"),
  district: z
    .string()
    .trim()
    .min(1, "Please select recipient district"),
  upazila: z
    .string()
    .trim()
    .min(1, "Please select recipient upazila/thana"),
});

/** Stage 3: Parcel & Route */
export const parcelGroupSchema = z.object({
  weightKg: z.coerce
    .number({ error: "Weight must be a valid number" })
    .positive("Weight must be greater than 0 kg")
    .max(100, "Maximum parcel weight is 100 kg"),
  deliveryType: z.enum(["LOCAL", "INTER_DISTRICT"], {
    message: "Please select a delivery type",
  }),
});

/** Stage 4: Billing */
export const billingGroupSchema = z.object({
  paymentType: z.enum(["CARD", "CASH"], {
    message: "Please select a payment method",
  }),
});

/** Combined form schema */
export const createShipmentGroupedSchema = z.object({
  sender: senderGroupSchema,
  receiver: receiverGroupSchema,
  parcel: parcelGroupSchema,
  billing: billingGroupSchema,
});

export type CreateShipmentGroupedFormValues = z.infer<
  typeof createShipmentGroupedSchema
>;

/** Backward-compatible flat schema for API validation */
export const createShipmentSchema = z.object({
  receiverName: z.string().trim().min(2),
  receiverPhone: z.string().trim().regex(BD_PHONE_REGEX),
  weightKg: z.number().positive().max(100),
  deliveryType: z.enum(["LOCAL", "INTER_DISTRICT"]),
  paymentType: z.enum(["CARD", "CASH"]),
  codAmount: z.number().optional().nullable(),
  senderAddress: z.string().trim().min(5),
  senderDistrict: z.string().trim().min(1),
  senderUpazila: z.string().trim().min(1),
  receiverAddress: z.string().trim().min(5),
  receiverDistrict: z.string().trim().min(1),
  receiverUpazila: z.string().trim().min(1),
});

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;
