"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies";
import { AuthUser } from "../schemas/auth.schemas";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: { user: AuthUser; accessToken?: string }) => void;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<AuthUser>) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Hydrate session from cookies on initial client load
  React.useEffect(() => {
    try {
      // Remove any dangerous legacy token in localStorage
      if (typeof window !== "undefined") {
        if (localStorage.getItem("accessToken")) {
          localStorage.removeItem("accessToken");
        }
        if (localStorage.getItem("waypoint_user")) {
          localStorage.removeItem("waypoint_user");
        }
      }

      const storedUserCookie = getCookie("waypoint_user");
      if (storedUserCookie) {
        const parsedUser = JSON.parse(storedUserCookie) as AuthUser;
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        }
      }
    } catch {
      // If parsing fails, clear corrupted cookie
      removeCookie("waypoint_user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = React.useCallback(
    (authData: { user: AuthUser; accessToken?: string }) => {
      setUser(authData.user);
      setCookie("waypoint_user", JSON.stringify(authData.user), { days: 7 });

      if (authData.accessToken) {
        setCookie("accessToken", authData.accessToken, { days: 7 });
      }

      // Ensure no localStorage residue
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("waypoint_user");
      }
    },
    []
  );

  const logout = React.useCallback(async () => {
    try {
      // Best-effort backend session termination
      await api.post("/auth/logout").catch(() => {
        // Backend endpoint might not exist or network error; continue with client cleanup
      });
    } catch {
      // Ignore network/server errors during logout
    } finally {
      // Clear all auth cookies
      removeCookie("accessToken");
      removeCookie("waypoint_user");

      // Clean legacy storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("waypoint_user");
      }

      // Reset client state and cache
      setUser(null);
      queryClient.clear();

      toast.success("Signed out successfully", {
        description: "You have been logged out of your session.",
      });

      router.push("/login");
    }
  }, [queryClient, router]);

  const updateUser = React.useCallback(
    (updatedFields: Partial<AuthUser>) => {
      setUser((prevUser) => {
        if (!prevUser) return null;
        const updated = { ...prevUser, ...updatedFields };
        setCookie("waypoint_user", JSON.stringify(updated), { days: 7 });
        return updated;
      });
    },
    []
  );

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, isLoading, login, logout, updateUser]
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
