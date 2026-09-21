"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies";
import { getUserFromToken } from "@/lib/jwt";
import { AuthUser } from "../schemas/auth.schemas";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: { accessToken: string; user?: AuthUser }) => void;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<AuthUser>) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Hydrate user session purely from the accessToken JWT cookie
  React.useEffect(() => {
    try {
      const token = getCookie("accessToken");
      if (token) {
        const decodedUser = getUserFromToken(token);
        if (decodedUser) {
          setUser(decodedUser);
        } else {
          // Token is expired or invalid
          removeCookie("accessToken");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      removeCookie("accessToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = React.useCallback(
    (authData: { accessToken: string; user?: AuthUser }) => {
      // Set the JWT accessToken in browser cookie
      setCookie("accessToken", authData.accessToken, { days: 7 });

      // Derive user data from the JWT payload, with fallback to provided user
      const decodedUser = getUserFromToken(authData.accessToken) || authData.user || null;
      setUser(decodedUser);
    },
    []
  );

  const logout = React.useCallback(async () => {
    try {
      // Optional best-effort backend session termination
      await api.post("/auth/logout").catch(() => {});
    } catch {
      // Ignore network/server errors during logout
    } finally {
      // Clear accessToken cookie
      removeCookie("accessToken");

      // Reset client state and cache
      setUser(null);
      queryClient.clear();

      toast.success("Signed out successfully", {
        description: "You have been logged out of your session.",
      });

      // Only navigate to /login when user is signed out
      router.push("/login");
    }
  }, [queryClient, router]);

  const updateUser = React.useCallback(
    (updatedFields: Partial<AuthUser>) => {
      setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedFields } : null));
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
