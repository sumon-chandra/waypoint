import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { shipmentKeys } from "@/lib/query-keys";
import type { Shipment, ShipmentDetail, ShipmentStatus, ApiResponse, PaginatedResult } from "@/types";

/** Statuses that represent an active (in-progress) shipment */
export const ACTIVE_STATUSES = new Set<ShipmentStatus>([
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "RECEIVED_AT_ORIGIN_HUB",
  "IN_TRANSIT",
  "RECEIVED_AT_DEST_HUB",
  "OUT_FOR_DELIVERY",
]);

/**
 * Fetches active shipments for the authenticated customer.
 * GET /shipments → filters client-side to active statuses only.
 */
export async function fetchActiveShipments(): Promise<ShipmentDetail[]> {
  const response = await api.get<ApiResponse<PaginatedResult<ShipmentDetail> | ShipmentDetail[]>>(
    "/shipments/my-shipments",
    { params: { limit: 50 } }
  );

  const payload = response.data?.data;
  let list: ShipmentDetail[] = [];

  if (payload && typeof payload === "object" && "result" in payload && Array.isArray(payload.result)) {
    list = payload.result;
  } else if (Array.isArray(payload)) {
    list = payload;
  }

  return list.filter((s) => ACTIVE_STATUSES.has(s.status));
}

/**
 * Fetches a single shipment by its tracking number.
 * GET /shipments/track/:trackingNumber
 */
export async function fetchShipmentByTrackingNumber(
  trackingNumber: string
): Promise<ShipmentDetail | null> {
  if (!trackingNumber) return null;

  const response = await api.get<ApiResponse<ShipmentDetail>>(
    `/shipments/track/${encodeURIComponent(trackingNumber)}`
  );

  return response.data?.data ?? null;
}

/**
 * TanStack Query hook — active shipments for the logged-in CUSTOMER.
 */
export function useActiveShipments() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isCustomer = isAuthenticated && user?.role === "CUSTOMER";

  return useQuery({
    queryKey: shipmentKeys.list({ scope: "active", userId: user?.id ?? "guest" }),
    queryFn: fetchActiveShipments,
    enabled: Boolean(!isAuthLoading && isCustomer),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
}

/**
 * TanStack Query hook — single shipment detail by tracking number.
 */
export function useShipmentByTrackingNumber(trackingNumber?: string | null) {
  return useQuery({
    queryKey: shipmentKeys.track(trackingNumber ?? ""),
    queryFn: () =>
      trackingNumber ? fetchShipmentByTrackingNumber(trackingNumber) : null,
    enabled: Boolean(trackingNumber),
    staleTime: 1000 * 30,
  });
}
