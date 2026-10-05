import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import { useAuth } from "@/hooks/use-auth";
import type { ApiResponse, PaginatedResult, Shipment, ShipmentStatus, DeliveryType } from "@/types";

export interface ShipmentFilters {
  page?: number;
  limit?: number;
  status?: ShipmentStatus | string;
  deliveryType?: DeliveryType | string;
}

export interface UseShipmentsResult {
  shipments: Shipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetches shipments list with optional filters and pagination.
 * GET /shipments?page&limit&status&deliveryType
 */
export async function fetchShipments(filters: ShipmentFilters = {}): Promise<UseShipmentsResult> {
  const response = await api.get<ApiResponse<PaginatedResult<Shipment> | Shipment[]>>("/shipments", {
    params: {
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.deliveryType ? { deliveryType: filters.deliveryType } : {}),
    },
  });

  const payload = response.data?.data;

  // Handle standard PaginatedResult envelope: { result: [], meta: { ... } }
  if (payload && typeof payload === "object" && "result" in payload && Array.isArray(payload.result)) {
    return {
      shipments: payload.result,
      total: payload.meta?.total ?? payload.result.length,
      page: payload.meta?.page ?? 1,
      limit: payload.meta?.limit ?? 20,
      totalPages: payload.meta?.totalPages ?? 1,
    };
  }

  // Handle flat array response fallback
  if (Array.isArray(payload)) {
    return {
      shipments: payload,
      total: payload.length,
      page: 1,
      limit: payload.length,
      totalPages: 1,
    };
  }

  return {
    shipments: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

/**
 * TanStack Query hook for customer consignments list.
 */
export function useShipments(filters: ShipmentFilters = {}) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  return useQuery({
    queryKey: shipmentKeys.list(filters as Record<string, unknown>),
    queryFn: () => fetchShipments(filters),
    enabled: Boolean(!isAuthLoading && isAuthenticated),
    staleTime: 1000 * 30, // 30 seconds fresh
    refetchOnWindowFocus: true,
  });
}
