import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { hubKeys } from "@/lib/query-keys";
import type { ApiResponse, Hub, CreateHubBody } from "@/types";

interface UpdateHubParams {
  id: string;
  payload: Partial<CreateHubBody>;
}

/**
 * Admin mutation to update sorting hub parameters.
 * PATCH /hubs/:id
 */
export function useUpdateHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateHubParams): Promise<Hub> => {
      const response = await api.patch<ApiResponse<Hub>>(`/hubs/${id}`, payload);
      return response.data.data;
    },
    onSuccess: (hub) => {
      toast.success(`Sorting Hub "${hub.name}" (${hub.code}) updated successfully!`);
      queryClient.invalidateQueries({ queryKey: hubKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update hub parameters. Please try again.");
    },
  });
}
