import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { userKeys } from "@/lib/query-keys";
import { useAuth } from "@/hooks/use-auth";
import type {
  ApiResponse,
  PaginatedResult,
  User,
  Role,
  UserStatus,
} from "@/types";

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: Role | string;
  status?: UserStatus | string;
  search?: string;
}

export interface UseUsersResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetches all registered platform accounts with pagination & filters.
 * GET /users?page&limit&role&status
 */
export async function fetchUsers(
  filters: UserFilters = {}
): Promise<UseUsersResult> {
  const params: Record<string, unknown> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 50,
  };

  if (filters.role && filters.role !== "ALL") {
    params.role = filters.role;
  }
  if (filters.status && filters.status !== "ALL") {
    params.status = filters.status;
  }
  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim();
  }

  const response = await api.get<ApiResponse<PaginatedResult<User> | User[]>>(
    "/users",
    { params }
  );

  const payload = response.data?.data;

  if (
    payload &&
    typeof payload === "object" &&
    "result" in payload &&
    Array.isArray(payload.result)
  ) {
    return {
      users: payload.result,
      total: payload.meta?.total ?? payload.result.length,
      page: payload.meta?.page ?? 1,
      limit: payload.meta?.limit ?? 50,
      totalPages: payload.meta?.totalPages ?? 1,
    };
  }

  if (Array.isArray(payload)) {
    return {
      users: payload,
      total: payload.length,
      page: 1,
      limit: payload.length,
      totalPages: 1,
    };
  }

  return {
    users: [],
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  };
}

/**
 * TanStack Query Hook for fetching users directory.
 */
export function useUsers(filters: UserFilters = {}) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: userKeys.list(filters as Record<string, unknown>),
    queryFn: () => fetchUsers(filters),
    enabled: Boolean(!isAuthLoading && isAdmin),
    staleTime: 1000 * 30, // 30s fresh
    refetchOnWindowFocus: true,
  });
}
