import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  ProfileApiResponse,
} from "../schemas/user.schemas";

/**
 * Normalizes user data from various possible backend response wrappers
 */
export function normalizeUserProfile(
  raw: unknown,
  fallback?: Partial<UserProfile> | null
): UserProfile {
  const container = raw as
    | { data?: { user?: Partial<UserProfile> } | Partial<UserProfile>; user?: Partial<UserProfile> }
    | undefined;

  const innerData = container?.data;
  const userCandidate =
    innerData && typeof innerData === "object" && "user" in innerData
      ? (innerData as { user?: Partial<UserProfile> }).user
      : (innerData as Partial<UserProfile> | undefined);

  const user = userCandidate || container?.user || (raw as Partial<UserProfile> | undefined);

  return {
    id: user?.id || fallback?.id || "",
    name: user?.name || fallback?.name || "Member",
    email: user?.email || fallback?.email || "",
    username: user?.username ?? null,
    displayUsername: user?.displayUsername ?? null,
    avatar: user?.avatar || user?.avatarUrl || fallback?.avatar || fallback?.avatarUrl || null,
    avatarUrl: user?.avatarUrl || user?.avatar || fallback?.avatarUrl || fallback?.avatar || null,
    role: user?.role || fallback?.role || "CUSTOMER",
    status: user?.status || fallback?.status || "ACTIVE",
    googleId: user?.googleId ?? null,
    emailVerified: Boolean(user?.emailVerified),
    banned: Boolean(user?.banned),
    banReason: user?.banReason ?? null,
    banExpires: user?.banExpires ?? null,
    phone: user?.phone || fallback?.phone || null,
    createdAt: user?.createdAt || fallback?.createdAt || new Date().toISOString(),
    updatedAt: user?.updatedAt || fallback?.updatedAt || new Date().toISOString(),
  };
}

/**
 * Fetches authenticated user profile from GET /auth/me
 */
export async function getProfile(fallbackUser?: Partial<UserProfile> | null): Promise<UserProfile> {
  try {
    const response = await api.get<ProfileApiResponse>("/auth/me");
    return normalizeUserProfile(response.data, fallbackUser);
  } catch (error: unknown) {
    // If user already hydrated from JWT cookie, fallback gracefully
    if (fallbackUser) {
      return normalizeUserProfile(fallbackUser, fallbackUser);
    }
    throw error;
  }
}

/**
 * TanStack Query Hook to fetch user profile with query key ['users', 'profile', 'me']
 */
export function useProfileQuery() {
  const { user: authUser, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["users", "profile", "me"],
    queryFn: () => getProfile(authUser),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData: authUser ? normalizeUserProfile(authUser) : undefined,
  });
}

function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error && typeof error === "object") {
    const err = error as { message?: string; response?: { data?: { message?: string } } };
    return err.response?.data?.message || err.message || defaultMessage;
  }
  return defaultMessage;
}

/**
 * Sanitizes profile payload by removing empty strings, nulls, and undefined fields
 */
export function sanitizeUpdatePayload(payload: UpdateProfilePayload): Record<string, string> {
  const sanitized: Record<string, string> = {};
  if (payload.name && payload.name.trim()) {
    sanitized.name = payload.name.trim();
  }
  if (payload.username && payload.username.trim()) {
    sanitized.username = payload.username.trim();
  }
  if (payload.displayUsername && payload.displayUsername.trim()) {
    sanitized.displayUsername = payload.displayUsername.trim();
  }
  if (payload.avatar && payload.avatar.trim()) {
    sanitized.avatar = payload.avatar.trim();
  }
  return sanitized;
}

/**
 * Updates profile information (name, username, displayUsername, avatar)
 */
export async function updateProfile(
  payload: UpdateProfilePayload,
  userId?: string
): Promise<UserProfile> {
  const sanitized = sanitizeUpdatePayload(payload);
  let responseData: unknown;

  // 1. If userId is provided, target canonical REST endpoint: PATCH /users/:id
  if (userId) {
    try {
      const res = await api.patch<ProfileApiResponse>(`/users/${userId}`, sanitized);
      responseData = res.data;
      return normalizeUserProfile(responseData);
    } catch (err: unknown) {
      const axiosErr = err as { statusCode?: number; originalError?: { response?: { status?: number } } };
      const status = axiosErr.statusCode || axiosErr.originalError?.response?.status;
      // If the backend threw 400 Bad Request / Validation error, do not mask it with a fallback
      if (status === 400) {
        throw err;
      }
    }
  }

  // 2. Fallback attempt: PATCH /users/me
  try {
    const res = await api.patch<ProfileApiResponse>("/users/me", sanitized);
    responseData = res.data;
    return normalizeUserProfile(responseData);
  } catch (err: unknown) {
    const axiosErr = err as { statusCode?: number; originalError?: { response?: { status?: number } } };
    const status = axiosErr.statusCode || axiosErr.originalError?.response?.status;
    if (status === 400) {
      throw err;
    }

    // 3. Fallback attempt: PATCH /auth/me
    const res = await api.patch<ProfileApiResponse>("/auth/me", sanitized);
    responseData = res.data;
    return normalizeUserProfile(responseData);
  }
}

/**
 * TanStack Mutation Hook for updating user profile
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload, user?.id),
    onSuccess: (updatedProfile) => {
      // Invalidate query keys
      queryClient.setQueryData(["users", "profile", "me"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["users", "profile"] });

      // Sync global auth state so Navbar and Dropdown instantly update
      updateUser({
        name: updatedProfile.name,
        avatar: updatedProfile.avatar || undefined,
        avatarUrl: updatedProfile.avatar || undefined,
      });

      toast.success("Profile updated successfully", {
        description: "Your changes have been saved to your account.",
      });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(
        error,
        "Could not update profile. Please check your information and try again."
      );

      toast.error("Profile update failed", {
        description: message,
      });
    },
  });
}

/**
 * Changes user password
 */
export async function changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await api.patch<{ success: boolean; message?: string }>("/users/change-password", {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    });
    return response.data;
  } catch (err: unknown) {
    // Fallback attempt: POST /users/change-password or PATCH /auth/change-password
    try {
      const fallbackResp = await api.post<{ success: boolean; message?: string }>("/users/change-password", {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      });
      return fallbackResp.data;
    } catch {
      throw err;
    }
  }
}

/**
 * TanStack Mutation Hook for changing password
 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully", {
        description: "Your new password has been set. Use it the next time you log in.",
      });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(
        error,
        "Failed to change password. Please ensure your current password is correct."
      );

      toast.error("Password update failed", {
        description: message,
      });
    },
  });
}

/**
 * Requests backend to dispatch an email verification link or code
 */
export async function sendVerificationEmail(): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await api.post<{ success: boolean; message?: string }>(
      "/users/send-verification-email"
    );
    return response.data;
  } catch (err: unknown) {
    try {
      const fallbackResp = await api.post<{ success: boolean; message?: string }>(
        "/auth/send-verification-email"
      );
      return fallbackResp.data;
    } catch {
      throw err;
    }
  }
}

/**
 * TanStack Mutation Hook for sending email verification
 */
export function useSendVerificationEmailMutation() {
  return useMutation({
    mutationFn: sendVerificationEmail,
    onSuccess: (data) => {
      toast.success("Verification email sent!", {
        description:
          data?.message || "Please check your inbox (and spam folder) for the verification instructions.",
      });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(
        error,
        "Failed to send verification email. Please try again in a few moments."
      );

      toast.error("Could not send verification email", {
        description: message,
      });
    },
  });
}

/**
 * Confirms email verification with a code or token
 */
export async function verifyEmail(tokenOrCode: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await api.post<{ success: boolean; message?: string }>("/users/verify-email", {
      token: tokenOrCode,
      code: tokenOrCode,
    });
    return response.data;
  } catch (err: unknown) {
    try {
      const fallbackResp = await api.get<{ success: boolean; message?: string }>(
        `/users/verify-email?token=${encodeURIComponent(tokenOrCode)}`
      );
      return fallbackResp.data;
    } catch {
      throw err;
    }
  }
}

/**
 * TanStack Mutation Hook for confirming email verification
 */
export function useVerifyEmailMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tokenOrCode: string) => verifyEmail(tokenOrCode),
    onSuccess: (data) => {
      // Invalidate profile query to re-fetch with emailVerified: true
      queryClient.invalidateQueries({ queryKey: ["users", "profile"] });

      toast.success("Email verified successfully!", {
        description:
          data?.message || "Your email address is now verified and your account is in good standing.",
      });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(
        error,
        "Invalid or expired verification code. Please request a new one."
      );

      toast.error("Email verification failed", {
        description: message,
      });
    },
  });
}


