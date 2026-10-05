/**
 * Central TanStack Query Key factories for Waypoint.
 * Strictly adheres to AGENTS.md Section 10.
 */

export const shipmentKeys = {
  all: ["shipments"] as const,
  lists: () => [...shipmentKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...shipmentKeys.lists(), filters ?? {}] as const,
  details: () => [...shipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...shipmentKeys.details(), id] as const,
  track: (trackingNumber: string) =>
    [...shipmentKeys.all, "track", trackingNumber] as const,
};

export const hubKeys = {
  all: ["hubs"] as const,
  lists: () => [...hubKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...hubKeys.lists(), filters ?? {}] as const,
  details: () => [...hubKeys.all, "detail"] as const,
  detail: (id: string) => [...hubKeys.details(), id] as const,
};

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...userKeys.lists(), filters ?? {}] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...paymentKeys.lists(), filters ?? {}] as const,
  detail: (id: string) => [...paymentKeys.all, "detail", id] as const,
};
