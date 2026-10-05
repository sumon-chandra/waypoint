/**
 * Payment models and transaction types for Waypoint
 * Strictly aligns with Prisma models in AGENTS.md Section 4.
 */

export type PaymentType = "CARD" | "CASH";

export type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED" | "EXPIRED";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  paymentMethod: string | null;
  shipmentId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckoutSessionResponse {
  url: string;
}
