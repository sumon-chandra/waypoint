import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Hub, HubFilterParams } from "../schemas/hubs.schemas";

/** Standard API response envelope from the Waypoint backend */
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Helper to safely extract payload data from standard API response envelope
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
 * Standard TanStack Query Keys for Hubs
 * Shape: [domain, resource, scope, ...params]
 */
export const hubKeys = {
  all: ["hubs"] as const,
  lists: () => [...hubKeys.all, "list"] as const,
  list: (params?: HubFilterParams) =>
    [...hubKeys.lists(), params ?? {}] as const,
  details: () => [...hubKeys.all, "detail"] as const,
  detail: (id: string) => [...hubKeys.details(), id] as const,
};

/**
 * Fetches all active hubs from the Waypoint backend database.
 * GET /hubs
 */
export async function fetchHubs(params?: HubFilterParams): Promise<Hub[]> {
  const response = await api.get("/hubs", {
    params,
  });

  const hubs = extractData<Hub[]>(response);
  return Array.isArray(hubs) ? hubs : [];
}

/**
 * Fetches single hub by ID
 * GET /hubs/:id
 */
export async function fetchHubById(id: string): Promise<Hub | null> {
  if (!id) return null;
  const response = await api.get(`/hubs/${encodeURIComponent(id)}`);
  return extractData<Hub>(response) ?? null;
}

/**
 * TanStack Query Hook — list of all operational hubs
 * Query key: ['hubs', 'list', params]
 */
export function useHubs(params?: HubFilterParams) {
  return useQuery({
    queryKey: hubKeys.list(params),
    queryFn: () => fetchHubs(params),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * TanStack Query Hook — single hub detail by ID
 * Query key: ['hubs', 'detail', id]
 */
export function useHub(id?: string | null) {
  return useQuery({
    queryKey: hubKeys.detail(id ?? ""),
    queryFn: () => fetchHubById(id ?? ""),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
