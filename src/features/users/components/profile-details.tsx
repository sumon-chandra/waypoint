"use client";

import * as React from "react";
import {
  User,
  Mail,
  AtSign,
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Key,
  Clock,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "../schemas/user.schemas";
import { EmailVerificationDialog } from "./email-verification-dialog";

interface ProfileDetailsProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export function ProfileDetails({ profile, onEditClick }: ProfileDetailsProps) {
  const [showVerifyDialog, setShowVerifyDialog] = React.useState(false);

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "N/A";
    try {
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Primary Personal Information (2 Columns) */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-border/70 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="size-4 text-primary" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Your public profile details and identifying information on Waypoint.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={onEditClick}
              className="gap-1 text-xs"
            >
              <Edit3 className="size-3" />
              <span>Edit</span>
            </Button>
          </CardHeader>

          <CardContent className="pt-2">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {/* Full Name */}
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                <dt className="text-xs text-muted-foreground font-medium">Full Name</dt>
                <dd className="font-medium text-foreground">{profile.name || "—"}</dd>
              </div>

              {/* Display Username */}
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                <dt className="text-xs text-muted-foreground font-medium">Display Name</dt>
                <dd className="font-medium text-foreground">
                  {profile.displayUsername || (
                    <span className="text-muted-foreground text-xs italic">
                      Same as full name
                    </span>
                  )}
                </dd>
              </div>

              {/* Username Handle */}
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                <dt className="text-xs text-muted-foreground font-medium">Username Handle</dt>
                <dd className="font-mono text-xs font-semibold text-primary">
                  {profile.username ? `@${profile.username}` : (
                    <span className="text-muted-foreground italic font-normal">
                      Not set (click edit to set)
                    </span>
                  )}
                </dd>
              </div>

              {/* Primary Email */}
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                <dt className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                  <span>Email Address</span>
                  {profile.emailVerified ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="size-2.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      Unverified
                    </span>
                  )}
                </dt>
                <dd className="font-medium text-foreground truncate" title={profile.email}>
                  {profile.email}
                </dd>
              </div>

              {/* Contact Phone */}
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                <dt className="text-xs text-muted-foreground font-medium">Phone Number</dt>
                <dd className="font-medium text-foreground">
                  {profile.phone || (
                    <span className="text-muted-foreground text-xs italic">
                      Not provided
                    </span>
                  )}
                </dd>
              </div>

              {/* Assigned Role */}
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                <dt className="text-xs text-muted-foreground font-medium">Account Role</dt>
                <dd className="font-semibold text-foreground tracking-wide uppercase text-xs">
                  {profile.role}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Account Activity Timestamps */}
        <Card className="border-border/70 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <span>Activity & Registration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/20 border border-border/40">
                <span className="font-medium text-foreground">Member Since</span>
                <span>{formatDate(profile.createdAt)}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/20 border border-border/40">
                <span className="font-medium text-foreground">Last Profile Update</span>
                <span>{formatDate(profile.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Authentication Summary (1 Column) */}
      <div className="space-y-6">
        <Card className="border-border/70 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <span>Security Summary</span>
            </CardTitle>
            <CardDescription>
              Authentication status and linked provider accounts.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google Authentication Status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2.5">
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Google OAuth</p>
                  <p className="text-muted-foreground text-[11px]">
                    {profile.googleId ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              {profile.googleId ? (
                <Badge variant="success" className="text-[10px]">
                  Linked
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Unlinked
                </Badge>
              )}
            </div>

            {/* Email Verification Status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Email Status</p>
                  <p className="text-muted-foreground text-[11px]">
                    {profile.emailVerified
                      ? "Confirmed and verified"
                      : "Pending verification"}
                  </p>
                </div>
              </div>
              {profile.emailVerified ? (
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setShowVerifyDialog(true)}
                  className="text-[10px] h-6 px-2 text-primary border-primary/30 hover:bg-primary/10"
                >
                  Verify Now
                </Button>
              )}
            </div>

            {/* Account Status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2.5">
                <Key className="size-4 text-muted-foreground shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Account Standing</p>
                  <p className="text-muted-foreground text-[11px]">
                    {profile.banned
                      ? "Restricted access"
                      : "Standard in good standing"}
                  </p>
                </div>
              </div>
              <Badge
                variant={profile.banned ? "destructive" : "success"}
                className="text-[10px]"
              >
                {profile.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Verification Dialog */}
      <EmailVerificationDialog
        profile={profile}
        isOpen={showVerifyDialog}
        onClose={() => setShowVerifyDialog(false)}
      />
    </div>
  );
}
