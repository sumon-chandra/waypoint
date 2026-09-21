"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GoogleButton } from "@/features/auth/components/google-button";
import { loginSchema } from "@/features/auth/schemas/auth.schemas";
import { useLoginMutation } from "@/features/auth/api/auth.api";
import { useAuth } from "@/hooks/use-auth";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegisteredSuccess = searchParams.get("registered") === "true";

  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const loginMutation = useLoginMutation();
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      setAuthError(null);
      // Validate with Zod schema
      const result = loginSchema.safeParse(value);
      if (!result.success) {
        setAuthError(result.error.issues[0]?.message || "Validation failed");
        return;
      }

      try {
        const response = await loginMutation.mutateAsync({
          email: value.email.trim().toLowerCase(),
          password: value.password,
        });

        // Sync with global auth state and cookies
        if (response.data?.accessToken) {
          login({
            accessToken: response.data.accessToken,
            user: response.data.user,
          });
        }

        // Honor redirect URL if provided by middleware
        const redirectParam = searchParams.get("redirect");
        if (redirectParam && redirectParam.startsWith("/")) {
          router.push(redirectParam);
          return;
        }

        // Otherwise redirect to role-based dashboard
        const userRole = response.data?.user?.role;
        if (userRole === "ADMIN") {
          router.push("/admin");
        } else if (userRole === "COURIER") {
          router.push("/courier");
        } else {
          router.push("/customer");
        }
      } catch (err: any) {
        const message =
          err?.message ||
          err?.response?.data?.message ||
          "Invalid email or password. Please try again.";
        setAuthError(message);
      }
    },
  });

  const isSubmitting = loginMutation.isPending;

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex justify-center">
          <Logo variant="mark" size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Sign in to your Waypoint account to track and manage shipments
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-md pt-6">
        <CardContent className="space-y-5">
          {/* Post-Registration Success Banner */}
          {isRegisteredSuccess && (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in duration-200">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
              <span>
                Account created successfully! Please sign in with your email and password.
              </span>
            </div>
          )}

          {/* Server / General error banner */}
          {authError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive font-medium animate-in fade-in duration-200">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Google Sign In Option */}
          <div>
            <GoogleButton label="Sign in with Google" disabled={isSubmitting} />
          </div>

          {/* Visual Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-border/70" />
            <span className="absolute bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              or sign in with email
            </span>
          </div>

          {/* TanStack Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {/* Email Address Field */}
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const res = loginSchema.shape.email.safeParse(value);
                  return res.success
                    ? undefined
                    : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email Address</Label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@company.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSubmitting}
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-[11px] text-destructive font-medium">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            {/* Password Field */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  const res = loginSchema.shape.password.safeParse(value);
                  return res.success
                    ? undefined
                    : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSubmitting}
                      className="pl-10 pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-[11px] text-destructive font-medium">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            {/* Remember Me Checkbox */}
            <form.Field name="rememberMe">
              {(field) => (
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    disabled={isSubmitting}
                    className="size-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-xs text-muted-foreground select-none cursor-pointer"
                  >
                    Remember this device for 30 days
                  </label>
                </div>
              )}
            </form.Field>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 font-semibold rounded-xl gap-2 shadow-md transition-all mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Waypoint</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 border-t border-border/50 pt-5 text-center text-xs text-muted-foreground">
          <p>
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline ml-1"
            >
              Create an account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>TLS 256-bit Encrypted Session</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary/5 via-background to-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />

      <React.Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse bg-card/50 rounded-2xl" />}>
        <LoginFormContent />
      </React.Suspense>
    </div>
  );
}
