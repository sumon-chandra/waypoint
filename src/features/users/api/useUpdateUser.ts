import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { userKeys } from "@/lib/query-keys";
import type { ApiResponse, User, Role, UserStatus } from "@/types";

export interface UpdateUserPayload {
  status?: UserStatus;
  role?: Role;
  banReason?: string;
  banExpires?: string;
}

/**
 * Updates a user's status and/or role via PATCH /users/:id.
 * Single hook for all admin user-management mutations.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUserPayload;
    }) => {
      const res = await api.patch<ApiResponse<User>>(
        `/users/${userId}`,
        payload
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });

      toast.success("User updated", {
        description: "Account changes have been saved successfully.",
      });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update user. Please try again.";

      toast.error("Update failed", { description: message });
    },
  });
}
