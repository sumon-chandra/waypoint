import { z } from "zod";

/** Bangladeshi mobile number format: 11 digits starting with 01[3-9] */
export const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

export const createShipmentSchema = z
  .object({
    receiverName: z
      .string()
      .trim()
      .min(2, "Receiver name must be at least 2 characters")
      .max(100, "Receiver name is too long"),
    receiverPhone: z
      .string()
      .trim()
      .regex(
        BD_PHONE_REGEX,
        "Invalid phone number. Must be 11 digits starting with 01 (e.g. 01712345678)",
      ),
    weightKg: z.coerce
      .number({ error: "Weight must be a valid number" })
      .positive("Weight must be greater than 0 kg")
      .max(100, "Maximum parcel weight is 100 kg"),
    deliveryType: z.enum(["LOCAL", "INTER_DISTRICT"], {
      message: "Please select a delivery type",
    }),
    paymentType: z.enum(["CARD", "CASH"], {
      message: "Please select a payment method",
    }),
    codAmount: z.coerce
      .number({ error: "COD amount must be a number" })
      .optional()
      .nullable(),
    senderAddress: z
      .string()
      .trim()
      .min(5, "Sender street address must be at least 5 characters"),
    senderDistrict: z.string().trim().min(1, "Please select sender district"),
    senderUpazila: z
      .string()
      .trim()
      .min(1, "Please select sender upazila/thana"),
    receiverAddress: z
      .string()
      .trim()
      .min(5, "Receiver street address must be at least 5 characters"),
    receiverDistrict: z
      .string()
      .trim()
      .min(1, "Please select receiver district"),
    receiverUpazila: z
      .string()
      .trim()
      .min(1, "Please select receiver upazila/thana"),
  })
  .refine(
    (data) => {
      if (data.paymentType === "CASH") {
        return typeof data.codAmount === "number" && data.codAmount > 0;
      }
      return true;
    },
    {
      message:
        "COD amount is required and must be greater than ৳0 for Cash on Delivery",
      path: ["codAmount"],
    },
  );

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;
