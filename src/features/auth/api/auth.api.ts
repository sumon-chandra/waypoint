import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { setCookie } from "@/lib/cookies";
import { userKeys } from "@/lib/query-keys";
import type { ApiResponse, User } from "@/types";
import {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  GoogleAuthPayload,
  GoogleAuthUrlData,
} from "../schemas/auth.schemas";

/**
 * Calls backend registration endpoint: POST /auth/register
 */
export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
}

/**
 * TanStack Mutation Hook for user registration
 */
export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Store accessToken in browser cookies
      if (data?.data?.accessToken) {
        setCookie("accessToken", data.data.accessToken, { days: 7 });
      }

      toast.success("Account created successfully!", {
        description: `Welcome to Waypoint, ${data?.data?.user?.name || "Member"}.`,
      });
    },
    onError: (error: any) => {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Registration failed. Please check your information and try again.";

      toast.error("Registration failed", {
        description: message,
      });
    },
  });
}

/**
 * Calls backend login endpoint: POST /auth/login
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

/**
 * TanStack Mutation Hook for user login
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store accessToken in browser cookies
      if (data?.data?.accessToken) {
        setCookie("accessToken", data.data.accessToken, { days: 7 });
      }

      toast.success("Welcome back!", {
        description: `Signed in as ${data?.data?.user?.name || "User"}.`,
      });
    },
    onError: (error: any) => {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Invalid email or password. Please try again.";

      toast.error("Login failed", {
        description: message,
      });
    },
  });
}

/**
 * Fetches the authenticated user's exact profile directly from the database: GET /auth/me
 */
export async function fetchLoggedInUserFromDB(): Promise<User> {
  const response = await api.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
}

/**
 * TanStack Query Hook to fetch and cache the current authenticated user's profile.
 * - Deduplicates requests across components
 * - Caches in memory with 5-minute staleTime (no calls on re-renders)
 */
export function useMeQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => fetchLoggedInUserFromDB(),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    refetchOnWindowFocus: true,
  });
}

/**
 * Calls backend endpoint to generate Google OAuth consent URL: GET /auth/google
 */
export async function getGoogleAuthUrl(): Promise<string> {
  const response =
    await api.get<ApiResponse<GoogleAuthUrlData | string>>("/auth/google");
  console.log("response", response);
  const data = response.data?.data;
  if (typeof data === "string") {
    return data;
  }
  if (data && typeof data === "object") {
    return data.url || data.redirectUrl || "";
  }
  return "";
}

/**
 * Calls backend to verify Google OAuth code or ID token: POST /auth/google
 */
export async function verifyGoogleAuth(
  payload: GoogleAuthPayload,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/google", payload);
  return response.data;
}

/**
 * TanStack Mutation Hook for verifying Google OAuth
 */
export function useGoogleAuthMutation() {
  return useMutation({
    mutationFn: verifyGoogleAuth,
    onSuccess: (data) => {
      // Store accessToken in browser cookies
      if (data?.data?.accessToken) {
        setCookie("accessToken", data.data.accessToken, { days: 7 });
      }

      toast.success("Signed in with Google successfully!", {
        description: `Welcome to Waypoint, ${data?.data?.user?.name || "User"}.`,
      });
    },
    onError: (error: any) => {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Google authentication failed. Please try again.";

      toast.error("Google sign-in failed", {
        description: message,
      });
    },
  });
}
