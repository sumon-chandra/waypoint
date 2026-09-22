"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import {
  User,
  AtSign,
  Mail,
  Shield,
  ShieldCheck,
  Loader2,
  Save,
  X,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  UserProfile,
  updateProfileSchema,
  UpdateProfileFormValues,
  UpdateProfilePayload,
} from "../schemas/user.schemas";
import { useUpdateProfileMutation } from "../api/user.api";
import { AvatarUploader } from "./avatar-uploader";
import { EmailVerificationDialog } from "./email-verification-dialog";

interface EditProfileFormProps {
  profile: UserProfile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditProfileForm({
  profile,
  onSuccess,
  onCancel,
}: EditProfileFormProps) {
  const updateMutation = useUpdateProfileMutation();
  const [showVerifyDialog, setShowVerifyDialog] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: profile.name || "",
      username: profile.username || "",
      displayUsername: profile.displayUsername || "",
      avatar: profile.avatarUrl || profile.avatar || "",
    },
    onSubmit: async ({ value }) => {
      // Validate schema
      const parsed = updateProfileSchema.safeParse(value);
      if (!parsed.success) {
        return;
      }

      try {
        const payload: UpdateProfilePayload = {
          name: value.name.trim(),
        };

        if (value.username && value.username.trim().length > 0) {
          payload.username = value.username.trim();
        }

        if (value.displayUsername && value.displayUsername.trim().length > 0) {
          payload.displayUsername = value.displayUsername.trim();
        }

        if (value.avatar && value.avatar.trim().length > 0) {
          payload.avatar = value.avatar.trim();
        }

        await updateMutation.mutateAsync(payload);
        if (onSuccess) onSuccess();
      } catch (err: unknown) {
        console.error("Profile update error:", err);
      }
    },
  });

  const isSubmitting = updateMutation.isPending;

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <User className="size-4 text-primary" />
          <span>Edit Account Profile</span>
        </CardTitle>
        <CardDescription>
          Update your public profile display name, unique username handle, and
          avatar picture.
        </CardDescription>
      </CardHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent className="space-y-6">
          {/* Avatar Picture Configuration with UploadThing */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground block">
              Profile Avatar
            </Label>
            <form.Field name="avatar">
              {(field) => (
                <AvatarUploader
                  value={field.state.value}
                  onChange={(url) => field.handleChange(url)}
                  userName={profile.name}
                  disabled={isSubmitting}
                />
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name Field */}
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  const res = updateProfileSchema.shape.name.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="edit-name" className="text-xs font-medium">
                    Full Legal Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="edit-name"
                      type="text"
                      placeholder="e.g. John Doe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSubmitting}
                      className="pl-9"
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

            {/* Display Username Field */}
            <form.Field
              name="displayUsername"
              validators={{
                onChange: ({ value }) => {
                  const res =
                    updateProfileSchema.shape.displayUsername.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-display-username"
                    className="text-xs font-medium"
                  >
                    Display Name (Nickname)
                  </Label>
                  <Input
                    id="edit-display-username"
                    type="text"
                    placeholder="Publicly displayed name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isSubmitting}
                  />
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

          {/* Username Handle Field */}
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => {
                const res = updateProfileSchema.shape.username.safeParse(value);
                return res.success ? undefined : res.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="edit-username"
                    className="text-xs font-medium"
                  >
                    Unique Username Handle
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    Alphanumeric & underscores
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground font-mono font-medium text-sm pointer-events-none">
                    @
                  </span>
                  <Input
                    id="edit-username"
                    type="text"
                    placeholder="john_waypoint"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value.toLowerCase())
                    }
                    onBlur={field.handleBlur}
                    disabled={isSubmitting}
                    className="pl-8 font-mono"
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

          {/* Read-Only Account System Properties */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              Protected Account Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Primary Email (Immutable) */}
              <div className="space-y-2 p-3 rounded-xl bg-muted/20 border border-border/40">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] text-muted-foreground">
                    Primary Email
                  </Label>
                  <Badge
                    variant={profile.emailVerified ? "success" : "warning"}
                    className="text-[10px]"
                  >
                    {profile.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium truncate">
                  <Mail className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                {!profile.emailVerified ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => setShowVerifyDialog(true)}
                    className="w-full mt-1 text-[11px] gap-1 text-primary border-primary/30 hover:bg-primary/10"
                  >
                    <ShieldCheck className="size-3" />
                    <span>Verify This Email</span>
                  </Button>
                ) : (
                  <p className="text-[10px] text-muted-foreground/80">
                    Email is verified and securely linked to your account.
                  </p>
                )}
              </div>

              {/* Role (Immutable) */}
              <div className="space-y-1.5 p-3 rounded-xl bg-muted/20 border border-border/40">
                <Label className="text-[11px] text-muted-foreground">
                  System Role
                </Label>
                <div className="flex items-center gap-2">
                  <Shield className="size-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground uppercase tracking-wide">
                    {profile.role}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/80">
                  Assigned access role configured during account setup.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4 bg-muted/10">
          {onCancel ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
              className="gap-1 text-xs"
            >
              <X className="size-3.5" />
              <span>Cancel</span>
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Save Profile Changes</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>

      {/* Email Verification Modal Dialog */}
      <EmailVerificationDialog
        profile={profile}
        isOpen={showVerifyDialog}
        onClose={() => setShowVerifyDialog(false)}
      />
    </Card>
  );
}
