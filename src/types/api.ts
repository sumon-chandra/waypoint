/**
 * Canonical API response and pagination types for Waypoint
 * Strictly aligns with AGENTS.md Section 2 envelope specifications.
 */

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  result: T[];
  meta: PaginatedMeta;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: ApiFieldError[];
}
