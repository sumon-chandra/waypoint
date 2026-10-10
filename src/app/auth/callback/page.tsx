"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/common/logo";
import { Navbar, Footer } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  verifyGoogleAuth,
  getGoogleAuthUrl,
} from "@/features/auth/api/auth.api";
import type { RegisterRole } from "@/features/auth/schemas/auth.schemas";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [status, setStatus] = React.useState<
    "authenticating" | "success" | "error"
  >("authenticating");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isRetrying, setIsRetrying] = React.useState<boolean>(false);

  // Prevent double-invoking the exchange request during React StrictMode mount
  const hasExecutedRef = React.useRef(false);

  React.useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (errorParam) {
      setStatus("error");
      const message =
        errorDescription ||
        (errorParam === "access_denied"
          ? "Google sign-in was cancelled or access was denied."
          : `Google authentication failed (${errorParam}).`);
      setErrorMessage(message);
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMessage(
        "No authorization code was found in the callback request. Please try signing in again.",
      );
      return;
    }

    async function processGoogleAuth() {
      try {
        setStatus("authenticating");

        // Retrieve persisted role (if initiated from registration)
        let savedRole: RegisterRole | undefined;
        let savedRedirect: string | null = null;

        if (typeof window !== "undefined") {
          const roleVal = sessionStorage.getItem("waypoint_oauth_role");
          if (roleVal === "CUSTOMER" || roleVal === "COURIER") {
            savedRole = roleVal as RegisterRole;
          }
          savedRedirect = sessionStorage.getItem("waypoint_oauth_redirect");
        }

        // Verify with the backend
        const response = await verifyGoogleAuth({
          code: code!,
          role: savedRole,
        });

        // Ensure session state & cookie are synchronized
        if (response.data?.accessToken) {
          login({
            accessToken: response.data.accessToken,
            user: response.data.user,
          });
        }

        // Clean up session storage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("waypoint_oauth_role");
          sessionStorage.removeItem("waypoint_oauth_redirect");
        }

        setStatus("success");
        toast.success("Authentication successful!", {
          description: `Welcome back, ${response.data?.user?.name || "Member"}.`,
        });

        // Navigate to the home page after successful Google login
        const targetPath =
          savedRedirect && savedRedirect.startsWith("/") ? savedRedirect : "/";

        // Brief delay for transition
        setTimeout(() => {
          router.replace(targetPath);
        }, 800);
      } catch (err: any) {
        setStatus("error");
        const message =
          err?.message ||
          err?.response?.data?.message ||
          "Unable to complete Google authentication. Please try again.";
        setErrorMessage(message);
      }
    }

    processGoogleAuth();
  }, [searchParams, login, router]);

  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      const url = await getGoogleAuthUrl();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Unable to obtain Google sign-in URL.");
      }
    } catch (err: any) {
      setIsRetrying(false);
      toast.error("Retry failed", {
        description:
          err?.message || "Please return to the login page and try again.",
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Branding Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex justify-center">
          <Logo variant="mark" size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {status === "authenticating" && "Verifying Credentials"}
          {status === "success" && "Authentication Verified"}
          {status === "error" && "Sign In Incomplete"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {status === "authenticating" &&
            "Finalizing secure Google OAuth handshake with Waypoint..."}
          {status === "success" &&
            "Redirecting you directly to your console..."}
          {status === "error" &&
            "We were unable to complete your Google sign-in."}
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-md pt-6">
        <CardContent className="space-y-6 py-4">
          {status === "authenticating" && (
            <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
              <div className="relative flex items-center justify-center">
                <div className="size-16 rounded-full bg-primary/10 animate-ping absolute" />
                <div className="size-16 rounded-full border-2 border-primary/20 flex items-center justify-center relative bg-background shadow-xs">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Synchronizing Account
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Exchanging secure tokens and setting up your authorized
                  session.
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
                <CheckCircle2 className="size-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Session Established
                </p>
                <p className="text-xs text-muted-foreground">
                  Welcome to Waypoint. Launching your workspace now...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 py-2">
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive font-medium">
                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-destructive">
                    Authentication error
                  </p>
                  <p className="leading-relaxed text-destructive/90">
                    {errorMessage ||
                      "An unknown error occurred while verifying your Google account."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex-1 h-11 font-semibold rounded-xl gap-2 cursor-pointer shadow-md"
                >
                  {isRetrying ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <RefreshCw className="size-4" />
                  )}
                  <span>Try Again</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="flex-1 h-11 font-semibold rounded-xl gap-2 cursor-pointer"
                >
                  <span>Back to Sign In</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 border-t border-border/50 pt-5 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>Encrypted OAuth 2.0 PKCE Handshake</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary/5 via-background to-background relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />

        <React.Suspense
          fallback={
            <div className="w-full max-w-md h-80 animate-pulse bg-card/50 rounded-2xl flex items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary/40" />
            </div>
          }
        >
          <CallbackContent />
        </React.Suspense>
      </main>
      <Footer />
    </>
  );
}
