import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { userKeys } from "@/lib/query-keys";
import type { ApiResponse, User, UpdateUserStatusBody } from "@/types";

interface UpdateUserStatusParams {
  userId: string;
  payload: UpdateUserStatusBody;
  userName?: string;
}

/**
 * Admin mutation to update user account status (e.g. ban, unban, suspend, activate).
 * PATCH /users/:id/status
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: UpdateUserStatusParams): Promise<User> => {
      const response = await api.patch<ApiResponse<User>>(
        `/users/${userId}/status`,
        payload
      );
      return response.data.data;
    },
    onSuccess: (updatedUser, variables) => {
      const name = variables.userName || updatedUser.name;
      toast.success(
        `User ${name} status updated to ${updatedUser.status}.`
      );
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to update user status. Please try again."
      );
    },
  });
}
