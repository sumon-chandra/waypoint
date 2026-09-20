import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  RegisterPayload,
  AuthResponse,
} from "../schemas/auth.schemas";

/**
 * Calls backend registration endpoint: POST /auth/register
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
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
      // Store accessToken in localStorage as fallback (cookies handled by backend if configured)
      if (data?.data?.accessToken && typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("waypoint_user", JSON.stringify(data.data.user));
      }
      toast.success("Account created successfully!", {
        description: `Welcome to Waypoint, ${data.data.user.name}. Please sign in to continue.`,
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
