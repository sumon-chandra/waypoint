"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies";
import { getUserFromToken } from "@/lib/jwt";
import { userKeys } from "@/lib/query-keys";
import { fetchLoggedInUserFromDB } from "../api/auth.api";
import type { AuthUser } from "../schemas/auth.schemas";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: { accessToken: string; user?: AuthUser }) => void;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<AuthUser>) => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Initial Optimistic Hydration on mount from cookie or OAuth URL callback params
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("accessToken") || urlParams.get("token");
        if (urlToken) {
          setCookie("accessToken", urlToken, { days: 7 });
          // Strip token from address bar without page reload
          urlParams.delete("accessToken");
          urlParams.delete("token");
          const newSearch = urlParams.toString();
          const cleanUrl =
            window.location.pathname +
            (newSearch ? `?${newSearch}` : "") +
            window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }

      const cookieToken = getCookie("accessToken");
      if (cookieToken) {
        setToken(cookieToken);
        const decodedUser = getUserFromToken(cookieToken);
        if (decodedUser) {
          setUser(decodedUser);
        } else {
          // Token is expired or malformed
          removeCookie("accessToken");
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }
    } catch {
      removeCookie("accessToken");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. TanStack Query to fetch and cache fresh user profile from DB: GET /auth/me
  const {
    data: dbUser,
    refetch: queryRefetch,
    error: dbError,
  } = useQuery({
    queryKey: userKeys.me(),
    queryFn: () => fetchLoggedInUserFromDB(),
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5, // 5 minutes cache (no extra calls on re-renders)
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // 3. Reconcile fresh database profile with client auth state
  React.useEffect(() => {
    if (dbUser) {
      setUser((prev) => {
        const merged: AuthUser = {
          id: dbUser.id || prev?.id || "",
          name: dbUser.name || prev?.name || "User",
          email: dbUser.email || prev?.email || "",
          role: dbUser.role || prev?.role || "CUSTOMER",
          status: dbUser.status || prev?.status || "ACTIVE",
          avatar: dbUser.avatar ?? prev?.avatar,
          avatarUrl: dbUser.avatar ?? prev?.avatarUrl,
          phone: (dbUser as any).phone ?? prev?.phone,
          username: dbUser.username ?? prev?.username,
          displayUsername: dbUser.displayUsername ?? prev?.displayUsername,
          emailVerified: dbUser.emailVerified ?? prev?.emailVerified,
          hubId: dbUser.hubId ?? prev?.hubId,
          createdAt:
            dbUser.createdAt || prev?.createdAt || new Date().toISOString(),
          updatedAt:
            dbUser.updatedAt || prev?.updatedAt || new Date().toISOString(),
        };
        return merged;
      });
    }
  }, [dbUser]);

  // 4. Handle expired session or unauthorized API error
  React.useEffect(() => {
    if (dbError) {
      const status = (dbError as any)?.response?.status;
      if (status === 401 || status === 403) {
        removeCookie("accessToken");
        setToken(null);
        setUser(null);
        queryClient.removeQueries({ queryKey: userKeys.me() });
      }
    }
  }, [dbError, queryClient]);

  const login = React.useCallback(
    (authData: { accessToken: string; user?: AuthUser }) => {
      // Set the JWT accessToken in browser cookie
      setCookie("accessToken", authData.accessToken, { days: 7 });
      setToken(authData.accessToken);

      // Derive user data from the JWT payload, with fallback to provided user
      const decodedUser =
        getUserFromToken(authData.accessToken) || authData.user || null;
      setUser(decodedUser);

      // Invalidate and trigger fresh DB fetch
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
    [queryClient],
  );

  const logout = React.useCallback(async () => {
    try {
      // Optional best-effort backend session termination
      await api.post("/auth/logout").catch(() => {});
    } catch {
      // Ignore network/server errors during logout
    } finally {
      // Clear accessToken cookie and state
      removeCookie("accessToken");
      setToken(null);
      setUser(null);

      // Reset client state and cache
      queryClient.removeQueries({ queryKey: userKeys.me() });
      queryClient.clear();

      toast.success("Signed out successfully", {
        description: "You have been logged out of your session.",
      });

      // Navigate to /login
      router.push("/login");
    }
  }, [queryClient, router]);

  const updateUser = React.useCallback(
    (updatedFields: Partial<AuthUser>) => {
      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...updatedFields } : null,
      );

      // Update TanStack Query cache
      queryClient.setQueryData(userKeys.me(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          ...updatedFields,
          avatar:
            updatedFields.avatar !== undefined
              ? updatedFields.avatar
              : old.avatar,
        };
      });
    },
    [queryClient],
  );

  const refetchUser = React.useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
      refetchUser,
    }),
    [user, isLoading, login, logout, updateUser, refetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access current logged-in user details, authentication status, and logout method.
 */
export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
