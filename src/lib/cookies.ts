/**
 * Client-side cookie utilities for secure token and session handling.
 */

export interface CookieOptions {
  days?: number;
  path?: string;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
}

/**
 * Sets a cookie in the browser.
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof document === "undefined") return;

  const {
    days = 7,
    path = "/",
    sameSite = "Lax",
    secure = typeof window !== "undefined" && window.location.protocol === "https:",
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}`;

  if (days) {
    const maxAge = days * 24 * 60 * 60;
    cookieString += `; max-age=${maxAge}`;
  }

  cookieString += `; SameSite=${sameSite}`;

  if (secure) {
    cookieString += "; Secure";
  }

  document.cookie = cookieString;
}

/**
 * Retrieves a cookie value by name from the browser.
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length));
      } catch {
        return c.substring(nameEQ.length);
      }
    }
  }

  return null;
}

/**
 * Removes a cookie by expiring it immediately.
 */
export function removeCookie(name: string, path = "/"): void {
  if (typeof document === "undefined") return;

  document.cookie = `${encodeURIComponent(name)}=; path=${path}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
