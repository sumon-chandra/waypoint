import { AuthUser, Role } from "@/features/auth/schemas/auth.schemas";

export interface JwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
  sub?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: Role;
  status?: string;
  avatarUrl?: string;
  avatar?: string;
  phone?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Standard base64url JWT payload decoder.
 * Compatible with both Browser client and Next.js Edge Runtime.
 */
export function decodeJwt<T = JwtPayload>(token: string): T | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    
    // In Edge / Browser runtime, use atob and decode UTF-8 components
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT token has expired according to its `exp` claim.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt<JwtPayload>(token);
  if (!payload || typeof payload.exp !== "number") return false;
  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Extracts AuthUser object from a valid JWT accessToken.
 */
export function getUserFromToken(token: string): AuthUser | null {
  const payload = decodeJwt<JwtPayload>(token);
  if (!payload) return null;

  // Check expiration if present
  if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
    return null;
  }

  const id = payload.id || payload.userId || payload._id || payload.sub || "";
  const email = payload.email || "";
  const name =
    payload.name ||
    payload.fullName ||
    (email ? email.split("@")[0] : "User");
  const role: Role = (payload.role as Role) || "CUSTOMER";
  const status = payload.status || "ACTIVE";

  return {
    id,
    name,
    email,
    role,
    status,
    avatarUrl: payload.avatarUrl || payload.avatar,
    phone: payload.phone,
    createdAt: payload.createdAt || new Date().toISOString(),
    updatedAt: payload.updatedAt || new Date().toISOString(),
  };
}
