import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { hubKeys } from "@/lib/query-keys";
import type { ApiResponse, Hub, CreateHubBody } from "@/types";

/**
 * Admin mutation to register a new sorting hub.
 * POST /hubs
 */
export function useCreateHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateHubBody): Promise<Hub> => {
      const response = await api.post<ApiResponse<Hub>>("/hubs", payload);
      return response.data.data;
    },
    onSuccess: (hub) => {
      toast.success(`Sorting Hub "${hub.name}" (${hub.code}) successfully created!`);
      queryClient.invalidateQueries({ queryKey: hubKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create hub facility. Please try again.");
    },
  });
}
