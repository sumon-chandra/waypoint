import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import type { ApiResponse, ShipmentDetail } from "@/types";

/**
 * Fetches a single shipment by its UUID along with all relations:
 * customer, courier, originHub, destinationHub, trackingLogs, payment.
 * GET /shipments/:id
 */
export async function fetchShipmentDetail(id: string): Promise<ShipmentDetail | null> {
  if (!id) return null;
  const response = await api.get<ApiResponse<ShipmentDetail>>(`/shipments/${id}`);
  return response.data?.data ?? null;
}

/**
 * TanStack Query hook for shipment detail by ID.
 */
export function useShipmentDetail(id?: string | null) {
  return useQuery({
    queryKey: shipmentKeys.detail(id ?? ""),
    queryFn: () => (id ? fetchShipmentDetail(id) : null),
    enabled: Boolean(id),
    staleTime: 1000 * 30, // 30s fresh
    refetchOnWindowFocus: true,
  });
}
