import axios, { AxiosError } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://waypointapi.vercel.app/api/v1";

/**
 * Central Axios instance for Waypoint API communication.
 * Handles base URL, credentials (HTTP-only cookies), and standardized error envelopes.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ApiErrorResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
  error?: string;
}

// Request Interceptor: Attach bearer token if stored in memory/localStorage (fallback)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize error extracting
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const errorData = error.response?.data;
    const message =
      errorData?.message ||
      errorData?.errors?.[0]?.message ||
      error.message ||
      "An unexpected server error occurred";

    // Attach custom message for consumer components
    const customError = new Error(message) as Error & {
      statusCode?: number;
      errors?: Array<{ field: string; message: string }>;
      originalError?: AxiosError<ApiErrorResponse>;
    };

    customError.statusCode = error.response?.status;
    customError.errors = errorData?.errors;
    customError.originalError = error;

    return Promise.reject(customError);
  }
);

export default api;
