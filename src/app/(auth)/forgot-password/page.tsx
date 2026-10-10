"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { forgotPasswordSchema } from "@/features/auth/schemas/auth.schemas";
import { useForgotPasswordMutation } from "@/features/auth/api/auth.api";

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const forgotMutation = useForgotPasswordMutation();

  // Cooldown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMessage(null);
      const trimmedEmail = value.email.trim().toLowerCase();

      const parseResult = forgotPasswordSchema.safeParse({ email: trimmedEmail });
      if (!parseResult.success) {
        setErrorMessage(parseResult.error.issues[0]?.message || "Invalid email address");
        return;
      }

      try {
        await forgotMutation.mutateAsync({ email: trimmedEmail });
        setSubmittedEmail(trimmedEmail);
        setIsSuccess(true);
        setResendCooldown(60);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to send reset instructions. Please check the email address and try again.";
        setErrorMessage(msg);
      }
    },
  });

  const handleResend = async () => {
    if (resendCooldown > 0 || forgotMutation.isPending || !submittedEmail) return;
    try {
      await forgotMutation.mutateAsync({ email: submittedEmail });
      setResendCooldown(60);
    } catch {
      // Handled by mutation hook error
    }
  };

  const isSubmitting = forgotMutation.isPending;

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex justify-center">
          <Logo variant="mark" size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {isSuccess ? "Check your email" : "Forgot password?"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isSuccess
            ? "We've sent password reset instructions to your inbox"
            : "No worries, enter your registered email address and we'll send you recovery instructions."}
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
            /* Success confirmation state */
            <div className="space-y-5 text-center py-2 animate-in fade-in-0 duration-300">
              <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="size-7" />
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We sent recovery instructions to:
                </p>
                <p className="font-bold text-foreground text-sm font-mono break-all">
                  {submittedEmail}
                </p>
                <p className="text-[11px] text-muted-foreground pt-1">
                  Click the reset link in the email to configure your new password. If you don't see it within a couple minutes, please check your spam folder.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isSubmitting}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:text-muted-foreground disabled:no-underline cursor-pointer transition-colors"
                >
                  <RotateCcw className="size-3.5" />
                  <span>
                    {isSubmitting
                      ? "Resending..."
                      : resendCooldown > 0
                      ? `Resend instructions in ${resendCooldown}s`
                      : "Did not receive? Resend email"}
                  </span>
                </button>
              </div>

              <div className="pt-2">
                <Link
                  href="/reset-password"
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 block"
                >
                  Have a reset token or OTP code? Enter it directly &rarr;
                </Link>
              </div>
            </div>
          ) : (
            /* Form input state */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const res = forgotPasswordSchema.shape.email.safeParse(value);
                    return res.success ? undefined : res.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="forgot-email">Registered Email Address</Label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="you@company.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={isSubmitting}
                        className="pl-10 text-xs sm:text-sm"
                        autoComplete="email"
                        autoFocus
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground h-10 shadow-xs cursor-pointer gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Sending instructions...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
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
            <span>Return to Sign In</span>
          </Link>
        </CardFooter>
      </Card>

      {/* Security Trust Note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-emerald-500" />
        <span>TLS 256-Bit Encrypted Authentication Pipeline</span>
      </div>
    </div>
  );
}
