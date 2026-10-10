import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { userKeys } from "@/lib/query-keys";
import type { ApiResponse, User, Role } from "@/types";

interface UpdateUserRoleParams {
  userId: string;
  role: Role;
  userName?: string;
}

/**
 * Admin mutation to update user role (e.g. CUSTOMER <-> COURIER).
 * Uses canonical endpoint PATCH /users/:id { role }
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: UpdateUserRoleParams): Promise<User> => {
      try {
        const response = await api.patch<ApiResponse<User>>(
          `/users/${userId}`,
          { role }
        );
        return response.data.data;
      } catch (err: unknown) {
        // Fallback: try PATCH /users/:id/status in case backend groups role under status endpoint
        try {
          const fallback = await api.patch<ApiResponse<User>>(
            `/users/${userId}/status`,
            { role }
          );
          return fallback.data.data;
        } catch {
          throw err;
        }
      }
    },
    onSuccess: (updatedUser, variables) => {
      const name = variables.userName || updatedUser.name;
      const roleLabel =
        variables.role === "COURIER" ? "Courier Rider" : "Customer / Merchant";
      toast.success(
        `User ${name} role updated to ${roleLabel}.`
      );
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to update user role. Please try again."
      );
    },
  });
}
