"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { resetPasswordSchema } from "@/features/auth/schemas/auth.schemas";
import { useResetPasswordMutation } from "@/features/auth/api/auth.api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || searchParams.get("code") || "";

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const resetMutation = useResetPasswordMutation();

  const form = useForm({
    defaultValues: {
      token: urlToken,
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMessage(null);

      const parseResult = resetPasswordSchema.safeParse(value);
      if (!parseResult.success) {
        setErrorMessage(parseResult.error.issues[0]?.message || "Validation failed");
        return;
      }

      try {
        await resetMutation.mutateAsync({
          token: value.token?.trim() || undefined,
          newPassword: value.newPassword,
        });

        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login?reset=true");
        }, 2000);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Password reset failed. The verification token may be invalid or expired.";
        setErrorMessage(msg);
      }
    },
  });

  const isSubmitting = resetMutation.isPending;

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex justify-center">
          <Logo variant="mark" size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {isSuccess ? "Password updated" : "Set new password"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isSuccess
            ? "Your password has been changed successfully. Redirecting you to sign in..."
            : "Choose a strong password to safeguard your Waypoint account."}
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-md pt-6">
        <CardContent className="space-y-5">
          {/* Server / General error banner */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive font-medium animate-in fade-in duration-200">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="space-y-4 text-center py-4 animate-in fade-in-0 duration-300">
              <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="size-7" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-foreground text-sm">
                  All done! You're good to go.
                </p>
                <p className="text-xs text-muted-foreground">
                  Redirecting to the login portal...
                </p>
              </div>
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={() => router.push("/login?reset=true")}
                  className="rounded-xl font-bold bg-primary text-primary-foreground text-xs"
                >
                  Continue to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Token field: only show manual input if not present in URL */}
              {!urlToken && (
                <form.Field name="token">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="reset-token">Verification Token / Code</Label>
                      <div className="relative flex items-center">
                        <KeyRound className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="reset-token"
                          type="text"
                          placeholder="Paste reset token from email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isSubmitting}
                          className="pl-10 font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}
                </form.Field>
              )}

              {/* New Password */}
              <form.Field
                name="newPassword"
                validators={{
                  onChange: ({ value }) => {
                    return value.length >= 6
                      ? undefined
                      : "Password must be at least 6 characters";
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="reset-new-password">New Password</Label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="reset-new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={isSubmitting}
                        className="pl-10 pr-10 text-xs sm:text-sm"
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        tabIndex={-1}
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

              {/* Confirm Password */}
              <form.Field
                name="confirmPassword"
                validators={{
                  onChangeListenTo: ["newPassword"],
                  onChange: ({ value, fieldApi }) => {
                    const newPw = fieldApi.form.getFieldValue("newPassword");
                    if (!value) return "Please confirm your password";
                    if (value !== newPw) return "Passwords do not match";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="reset-confirm-password">Confirm New Password</Label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="reset-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={isSubmitting}
                        className="pl-10 pr-10 text-xs sm:text-sm"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground h-10 shadow-xs cursor-pointer gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Reset Password</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-center border-t border-border/60 py-4 bg-muted/20 rounded-b-xl">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </CardFooter>
      </Card>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-emerald-500" />
        <span>End-to-End Cryptographic Hash Protection</span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full max-w-md p-8 text-center text-xs text-muted-foreground animate-pulse">
          Loading secure password reset session...
        </div>
      }
    >
      <ResetPasswordContent />
    </React.Suspense>
  );
}
