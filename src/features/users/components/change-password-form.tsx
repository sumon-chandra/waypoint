"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { UserProfile, changePasswordSchema } from "../schemas/user.schemas";
import { useChangePasswordMutation } from "../api/user.api";

interface ChangePasswordFormProps {
  profile: UserProfile;
  onSuccess?: () => void;
}

export function ChangePasswordForm({ profile, onSuccess }: ChangePasswordFormProps) {
  const changePasswordMutation = useChangePasswordMutation();

  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const parsed = changePasswordSchema.safeParse(value);
      if (!parsed.success) {
        return;
      }

      await changePasswordMutation.mutateAsync(
        {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        },
        {
          onSuccess: () => {
            formApi.reset();
            if (onSuccess) onSuccess();
          },
        }
      );
    },
  });

  const isSubmitting = changePasswordMutation.isPending;

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <KeyRound className="size-4 text-primary" />
          <span>Account Security & Password</span>
        </CardTitle>
        <CardDescription>
          Keep your account safe by setting a strong, unique password.
        </CardDescription>
      </CardHeader>

      {/* Google Sign-in Advisory Notice */}
      {profile.googleId && (
        <div className="mx-6 p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300 flex items-start gap-2.5 text-xs">
          <ShieldAlert className="size-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Google Single Sign-On Enabled</p>
            <p className="text-muted-foreground leading-relaxed">
              Your account is connected to Google. You can sign in using Google or configure a local password below to access the service with standard credentials.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent className="space-y-4 pt-4">
          {/* Current Password */}
          <form.Field
            name="currentPassword"
            validators={{
              onChange: ({ value }) => {
                const res = changePasswordSchema.shape.currentPassword.safeParse(value);
                return res.success ? undefined : res.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="current-password" className="text-xs font-medium">
                  Current Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="current-password"
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter existing password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isSubmitting}
                    className="pl-9 pr-9"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((p) => !p)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
                    tabIndex={-1}
                  >
                    {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          {/* New Password */}
          <form.Field
            name="newPassword"
            validators={{
              onChange: ({ value }) => {
                const res = changePasswordSchema.shape.newPassword.safeParse(value);
                return res.success ? undefined : res.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs font-medium">
                  New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isSubmitting}
                    className="pl-9 pr-9"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          {/* Confirm New Password */}
          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value, fieldApi }) => {
                const newPass = fieldApi.form.getFieldValue("newPassword");
                if (value !== newPass) {
                  return "Passwords do not match";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="confirm-new-password" className="text-xs font-medium">
                  Confirm New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirm-new-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-type new password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isSubmitting}
                    className="pl-9 pr-9"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>
        </CardContent>

        <CardFooter className="flex items-center justify-end border-t border-border/50 pt-4 bg-muted/10">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <KeyRound className="size-3.5" />
                <span>Update Password</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
