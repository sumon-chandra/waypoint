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

export interface CourierShipmentFilters {
  page?: number;
  limit?: number;
  status?: ShipmentStatus | string;
  deliveryType?: DeliveryType | string;
}

export interface UseCourierShipmentsResult {
  shipments: Shipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetches consignments for the authenticated courier.
 * GET /shipments?page&limit&status&deliveryType
 * Backend auto-scopes this to the logged-in courier.
 */
export async function fetchCourierShipments(
  filters: CourierShipmentFilters = {}
): Promise<UseCourierShipmentsResult> {
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

  // Use /shipments endpoint which is role-scoped to the active courier
  let response;
  try {
    response = await api.get<ApiResponse<PaginatedResult<Shipment> | Shipment[]>>(
      "/shipments",
      { params }
    );
  } catch {
    // Graceful fallback to /shipments/my-shipments if endpoint alias is used
    response = await api.get<ApiResponse<PaginatedResult<Shipment> | Shipment[]>>(
      "/shipments/my-shipments",
      { params }
    );
  }

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
 * TanStack Query hook for courier's assigned deliveries.
 */
export function useCourierShipments(filters: CourierShipmentFilters = {}) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isCourier = isAuthenticated && user?.role === "COURIER";

  return useQuery({
    queryKey: shipmentKeys.list({
      role: "COURIER",
      userId: user?.id,
      ...filters,
    } as Record<string, unknown>),
    queryFn: () => fetchCourierShipments(filters),
    enabled: Boolean(!isAuthLoading && isCourier),
    staleTime: 1000 * 20, // 20s fresh
    refetchOnWindowFocus: true,
  });
}
