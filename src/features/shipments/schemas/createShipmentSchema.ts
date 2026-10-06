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
    .string("Sender street address cannot be empty")
    .trim()
    .min(1, "Sender street address cannot be empty"),
  district: z
    .string("Please select a sender district")
    .trim()
    .min(1, "Please select a sender district"),
  upazila: z
    .string("Please select a sender upazila or thana")
    .trim()
    .min(1, "Please select a sender upazila or thana"),
});

/** Stage 2: Recipient Destination */
export const receiverGroupSchema = z.object({
  name: z
    .string("Recipient name cannot be empty")
    .trim()
    .min(1, "Recipient name cannot be empty")
    .max(100, "Recipient name is too long"),
  phone: z
    .string("Recipient phone number cannot be empty")
    .trim()
    .regex(
      BD_PHONE_REGEX,
      "Please enter a valid 11-digit Bangladeshi phone number (e.g. 01712345678)"
    ),
  address: z
    .string("Recipient delivery address cannot be empty")
    .trim()
    .min(1, "Recipient delivery address cannot be empty"),
  district: z
    .string("Please select a recipient district")
    .trim()
    .min(1, "Please select a recipient district"),
  upazila: z
    .string("Please select a recipient upazila or thana")
    .trim()
    .min(1, "Please select a recipient upazila or thana"),
});

/** Stage 3: Parcel & Route */
export const parcelGroupSchema = z.object({
  weightKg: z.coerce
    .number({ error: "Please enter a valid consignment weight in kg" })
    .positive("Consignment weight must be greater than 0 kg")
    .max(100, "Maximum parcel weight is 100 kg"),
  deliveryType: z.enum(["LOCAL", "INTER_DISTRICT"]).optional().default("LOCAL"),
});

/** Stage 4: Billing */
export const billingGroupSchema = z.object({
  paymentType: z.enum(["CARD", "CASH"], {
    message: "Please select Cash on Delivery or Card payment",
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
  receiverName: z.string("Recipient name cannot be empty").trim().min(1, "Recipient name cannot be empty"),
  receiverPhone: z.string("Recipient phone number cannot be empty").trim().regex(BD_PHONE_REGEX, "Please enter a valid 11-digit Bangladeshi phone number"),
  weightKg: z.number({ error: "Please enter a valid weight in kg" }).positive("Weight must be greater than 0 kg").max(100, "Maximum parcel weight is 100 kg"),
  deliveryType: z.enum(["LOCAL", "INTER_DISTRICT"], { message: "Please select a delivery routing method" }),
  paymentType: z.enum(["CARD", "CASH"], { message: "Please select a payment method" }),
  codAmount: z.number().optional().nullable(),
  senderAddress: z.string("Sender address cannot be empty").trim().min(1, "Sender street address cannot be empty"),
  senderDistrict: z.string("Please select sender district").trim().min(1, "Please select sender district"),
  senderUpazila: z.string("Please select sender upazila").trim().min(1, "Please select sender upazila"),
  receiverAddress: z.string("Recipient address cannot be empty").trim().min(1, "Recipient delivery address cannot be empty"),
  receiverDistrict: z.string("Please select recipient district").trim().min(1, "Please select recipient district"),
  receiverUpazila: z.string("Please select recipient upazila").trim().min(1, "Please select recipient upazila"),
});

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;
