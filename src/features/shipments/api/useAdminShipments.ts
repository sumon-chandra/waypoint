import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import { useAuth } from "@/hooks/use-auth";
import type {
  ApiResponse,
  PaginatedResult,
  Shipment,
  ShipmentStatus,
  DeliveryType,
} from "@/types";

export interface AdminShipmentFilters {
  page?: number;
  limit?: number;
  status?: ShipmentStatus | string;
  deliveryType?: DeliveryType | string;
}

export interface UseAdminShipmentsResult {
  shipments: Shipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetches platform-wide consignments for administrators.
 * GET /shipments?page&limit&status&deliveryType
 */
export async function fetchAdminShipments(
  filters: AdminShipmentFilters = {}
): Promise<UseAdminShipmentsResult> {
  const params: Record<string, unknown> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 50,
  };

  if (filters.status && filters.status !== "ALL") {
    params.status = filters.status;
  }
  if (filters.deliveryType && filters.deliveryType !== "ALL") {
    params.deliveryType = filters.deliveryType;
  }

  const response = await api.get<
    ApiResponse<PaginatedResult<Shipment> | Shipment[]>
  >("/shipments", { params });

  const payload = response.data?.data;

  if (
    payload &&
    typeof payload === "object" &&
    "result" in payload &&
    Array.isArray(payload.result)
  ) {
    return {
      shipments: payload.result,
      total: payload.meta?.total ?? payload.result.length,
      page: payload.meta?.page ?? 1,
      limit: payload.meta?.limit ?? 50,
      totalPages: payload.meta?.totalPages ?? 1,
    };
  }

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
    limit: 50,
    totalPages: 1,
  };
}

/**
 * TanStack Query hook for admin global shipments list.
 */
export function useAdminShipments(filters: AdminShipmentFilters = {}) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: shipmentKeys.list({
      scope: "admin-global",
      ...filters,
    } as Record<string, unknown>),
    queryFn: () => fetchAdminShipments(filters),
    enabled: Boolean(!isAuthLoading && isAdmin),
    staleTime: 1000 * 20, // 20s fresh
    refetchOnWindowFocus: true,
  });
}
