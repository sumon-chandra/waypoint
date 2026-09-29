import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { ShipmentData, ShipmentStatus } from "../schemas/shipment.schemas";

/** Statuses that represent an active (in-progress) shipment */
export const ACTIVE_STATUSES = new Set<ShipmentStatus>([
  "PENDING",
  "BOOKED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
]);

/** Standard API response envelope from the Waypoint backend */
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Extracts the `data` payload from the standard API response envelope.
 * Falls back to the raw response if it doesn't match the envelope shape.
 */
function extractData<T>(response: { data: ApiResponse<T> | T }): T {
  const body = response.data;

  if (
    body &&
    typeof body === "object" &&
    "success" in body &&
    "data" in body
  ) {
    return (body as ApiResponse<T>).data;
  }

  return body as T;
}

/**
 * Fetches active shipments for the authenticated customer.
 * GET /shipments → filters client-side to active statuses only.
 */
export async function fetchActiveShipments(): Promise<ShipmentData[]> {
  const response = await api.get("/shipments", {
    params: { limit: 50 },
  });

  const shipments = extractData<ShipmentData[]>(response);

  if (!Array.isArray(shipments)) return [];

  return shipments.filter((s) => ACTIVE_STATUSES.has(s.status));
}

/**
 * Fetches a single shipment by its tracking number.
 * GET /shipments/track/:trackingNumber
 */
export async function fetchShipmentByTrackingNumber(
  trackingNumber: string
): Promise<ShipmentData | null> {
  if (!trackingNumber) return null;

  const response = await api.get(
    `/shipments/track/${encodeURIComponent(trackingNumber)}`
  );

  return extractData<ShipmentData>(response) ?? null;
}

/**
 * TanStack Query hook — active shipments for the logged-in CUSTOMER.
 * Query key: ['shipments', 'list', { scope: 'active', userId }]
 */
export function useActiveShipments() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isCustomer = isAuthenticated && user?.role === "CUSTOMER";

  return useQuery({
    queryKey: [
      "shipments",
      "list",
      { scope: "active", userId: user?.id ?? "guest" },
    ],
    queryFn: fetchActiveShipments,
    enabled: Boolean(!isAuthLoading && isCustomer),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
}

/**
 * TanStack Query hook — single shipment detail by tracking number.
 * Query key: ['shipments', 'detail', trackingNumber]
 */
export function useShipmentByTrackingNumber(trackingNumber?: string | null) {
  return useQuery({
    queryKey: ["shipments", "detail", trackingNumber ?? ""],
    queryFn: () =>
      trackingNumber
        ? fetchShipmentByTrackingNumber(trackingNumber)
        : null,
    enabled: Boolean(trackingNumber),
    staleTime: 1000 * 30,
  });
}
