import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { hubKeys } from "@/lib/query-keys";
import type { ApiResponse } from "@/types";

interface DeleteHubParams {
  id: string;
  name?: string;
}

/**
 * Admin mutation to delete / deactivate a sorting hub.
 * DELETE /hubs/:id
 */
export function useDeleteHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteHubParams): Promise<null> => {
      const response = await api.delete<ApiResponse<null>>(`/hubs/${id}`);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.name
          ? `Hub "${variables.name}" has been removed.`
          : "Hub facility successfully deleted."
      );
      queryClient.invalidateQueries({ queryKey: hubKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete hub. Please ensure no active shipments are attached.");
    },
  });
}
