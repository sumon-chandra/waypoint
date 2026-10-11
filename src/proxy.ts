import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt, isTokenExpired } from "@/lib/jwt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isAuthenticated = !!token && !isTokenExpired(token);
  const decoded = token ? decodeJwt(token) : null;
  const userRole = decoded?.role || "CUSTOMER";

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isProtectedRoute =
    pathname.startsWith("/customer") ||
    pathname.startsWith("/courier") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile");

  // 1. Authenticated user trying to access /login, /register, etc.
  if (isAuthRoute && isAuthenticated) {
    const dashboardPath =
      userRole === "ADMIN"
        ? "/admin"
        : userRole === "COURIER"
        ? "/courier"
        : "/customer";

    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // 2. Unauthenticated user trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Role-based protection for protected routes
  if (isProtectedRoute && isAuthenticated) {
    // Non-admin trying to access /admin
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      const fallbackPath = userRole === "COURIER" ? "/courier" : "/customer";
      return NextResponse.redirect(new URL(fallbackPath, request.url));
    }

    // Customer trying to access /courier
    if (
      pathname.startsWith("/courier") &&
      userRole !== "COURIER" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/customer", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/customer/:path*",
    "/courier/:path*",
    "/admin/:path*",
    "/profile/:path*",
  ],
};

export default proxy;

