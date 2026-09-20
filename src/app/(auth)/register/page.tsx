"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RoleRadioGroup } from "@/features/auth/components/role-radio-group";
import { GoogleButton } from "@/features/auth/components/google-button";
import {
  registerSchema,
  type Role,
} from "@/features/auth/schemas/auth.schemas";
import { useRegisterMutation } from "@/features/auth/api/auth.api";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const registerMutation = useRegisterMutation();

  const form = useForm({
    defaultValues: {
      role: "CUSTOMER" as Role,
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    onSubmit: async ({ value }) => {
      setAuthError(null);
      // Validate full object with Zod schema
      const result = registerSchema.safeParse(value);
      if (!result.success) {
        setAuthError(
          result.error.issues[0]?.message || "Please correct form errors",
        );
        return;
      }

      try {
        await registerMutation.mutateAsync({
          name: value.fullName.trim(),
          email: value.email.trim().toLowerCase(),
          password: value.password,
          role: value.role,
          phone: value.phone.trim(),
        });

        // Redirect to login with success indicator
        router.push("/login?registered=true");
      } catch (err: any) {
        const message =
          err?.message ||
          err?.response?.data?.message ||
          "Registration failed. Please check your information.";
        setAuthError(message);
      }
    },
  });

  const isSubmitting = registerMutation.isPending;

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary/5 via-background to-background relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center">
            <Logo variant="mark" size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Join Waypoint to streamline shipments, deliveries, and smart
            tracking
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-base font-bold">Account Role</CardTitle>
            <CardDescription>
              Select whether you want to register as a Customer or as a Courier
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* General validation / backend error banner */}
            {authError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive font-medium animate-in fade-in duration-200">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* TanStack Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Role Radio Group */}
              <form.Field name="role">
                {(field) => (
                  <div className="space-y-1.5">
                    <RoleRadioGroup
                      value={field.state.value}
                      onChange={(role) => field.handleChange(role)}
                      name="register-role"
                    />
                  </div>
                )}
              </form.Field>

              {/* Google Sign Up Option */}
              <div className="pt-1">
                <GoogleButton
                  label="Sign up with Google"
                  disabled={isSubmitting}
                />
              </div>

              {/* Visual Divider */}
              <div className="relative flex items-center justify-center py-1">
                <div className="w-full border-t border-border/70" />
                <span className="absolute bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  or register with email
                </span>
              </div>

              {/* Full Name Field */}
              <form.Field
                name="fullName"
                validators={{
                  onChange: ({ value }) => {
                    return value.trim().length < 2
                      ? "Full name must be at least 2 characters"
                      : undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="register-fullName">Full Name</Label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="register-fullName"
                        placeholder="e.g. Tanvir Ahmed"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={isSubmitting}
                        className="pl-10"
                        autoComplete="name"
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

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address Field */}
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      return !emailRegex.test(value)
                        ? "Valid email address required"
                        : undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="register-email">Email Address</Label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="register-email"
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

                {/* Phone Number Field */}
                <form.Field
                  name="phone"
                  validators={{
                    onChange: ({ value }) => {
                      const phoneRegex = /^01[3-9]\d{8}$/;
                      return !phoneRegex.test(value)
                        ? "Must be BD mobile (e.g. 01712345678)"
                        : undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="register-phone">Phone Number (BD)</Label>
                      <div className="relative flex items-center">
                        <Phone className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="register-phone"
                          type="tel"
                          placeholder="01712345678"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isSubmitting}
                          className="pl-10 font-mono text-xs sm:text-sm"
                          autoComplete="tel"
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
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Field */}
                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      return value.length < 8
                        ? "Minimum 8 characters required"
                        : undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isSubmitting}
                          className="pl-10 pr-9"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
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

                {/* Confirm Password Field */}
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChangeListenTo: ["password"],
                    onChange: ({ value, fieldApi }) => {
                      const password = fieldApi.form.getFieldValue("password");
                      return value !== password
                        ? "Passwords do not match"
                        : undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="register-confirmPassword">
                        Confirm Password
                      </Label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="register-confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isSubmitting}
                          className="pl-10 pr-9"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="absolute right-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
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
              </div>

              {/* Terms Checkbox Field */}
              <form.Field
                name="terms"
                validators={{
                  onChange: ({ value }) => {
                    return !value
                      ? "You must accept the terms of service"
                      : undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="register-terms"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        disabled={isSubmitting}
                        className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                      />
                      <label
                        htmlFor="register-terms"
                        className="text-xs text-muted-foreground select-none leading-relaxed cursor-pointer"
                      >
                        I agree to Waypoint&apos;s{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline font-medium"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline font-medium"
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-[11px] text-destructive font-medium pl-6">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Waypoint Account</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 border-t border-border/50 pt-5 text-center text-xs text-muted-foreground">
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline ml-1"
              >
                Sign in
              </Link>
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Verified Courier & Merchant Data Security</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
