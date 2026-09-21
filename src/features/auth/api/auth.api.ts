import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { setCookie } from "@/lib/cookies";
import {
  RegisterPayload,
  LoginPayload,
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
