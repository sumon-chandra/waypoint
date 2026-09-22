"use client";

import * as React from "react";
import Link from "next/link";
import {
  Shield,
  Truck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Edit3,
  LayoutDashboard,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "../schemas/user.schemas";
import { EmailVerificationDialog } from "./email-verification-dialog";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: UserProfile;
  activeTab: "overview" | "edit" | "security";
  onTabChange: (tab: "overview" | "edit" | "security") => void;
}

export function ProfileHeader({
  profile,
  activeTab,
  onTabChange,
}: ProfileHeaderProps) {
  const [showVerifyDialog, setShowVerifyDialog] = React.useState(false);

  const firstChar = profile.name
    ? profile.name.trim().charAt(0).toUpperCase()
    : "U";
  const avatarSrc = profile.avatarUrl || profile.avatar;

  // Format creation / joined date
  const memberSince = React.useMemo(() => {
    if (!profile.createdAt) return "Member";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(new Date(profile.createdAt));
    } catch {
      return "Member";
    }
  }, [profile.createdAt]);

  // Role visual configuration
  const getRoleConfig = () => {
    switch (profile.role) {
      case "ADMIN":
        return {
          label: "Administrator",
          icon: Shield,
          variant: "purple" as const,
          dashboardHref: "/admin",
        };
      case "COURIER":
        return {
          label: "Courier Partner",
          icon: Truck,
          variant: "warning" as const,
          dashboardHref: "/courier",
        };
      case "CUSTOMER":
      default:
        return {
          label: "Verified Customer",
          icon: UserCheck,
          variant: "info" as const,
          dashboardHref: "/customer",
        };
    }
  };

  const roleConfig = getRoleConfig();
  const RoleIcon = roleConfig.icon;

  // Status visual configuration
  const getStatusConfig = () => {
    if (profile.banned || profile.status === "BANNED") {
      return {
        label: "Account Banned",
        variant: "destructive" as const,
      };
    }
    if (profile.status === "INACTIVE") {
      return {
        label: "Inactive",
        variant: "outline" as const,
      };
    }
    return {
      label: "Active Account",
      variant: "success" as const,
    };
  };

  const statusConfig = getStatusConfig();
  const isBanned = profile.banned || profile.status === "BANNED";

  return (
    <Card className="overflow-hidden border-border/70 shadow-md">
      {/* Decorative Gradient Banner */}
      <div className="relative h-36 sm:h-44 w-full bg-linear-to-r from-primary/90 via-primary to-accent/90 overflow-hidden">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/20" />
        <div className="absolute -right-12 -top-12 size-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-12 -bottom-12 size-48 rounded-full bg-black/10 blur-xl" />

        {/* Top Badges overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Badge
            variant={statusConfig.variant}
            className="bg-card/90 backdrop-blur-md shadow-xs"
          >
            <span
              className={cn(
                "size-1.5 rounded-full animate-pulse",
                isBanned ? "bg-destructive" : "bg-emerald-500",
              )}
            />
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Main Profile Info Section */}
      <CardContent className="relative px-5 sm:px-8 pb-6 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
          {/* Avatar with Ring */}
          <div className="relative inline-block self-start sm:self-auto">
            <div className="rounded-full ring-4 ring-card bg-card shadow-lg p-1">
              <Avatar size="lg" className="size-24 sm:size-28">
                {avatarSrc && (
                  <AvatarImage
                    src={avatarSrc}
                    alt={profile.name}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-primary/15 text-primary text-2xl sm:text-3xl font-bold">
                  {firstChar}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0">
            {activeTab !== "edit" ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => onTabChange("edit")}
                className="gap-1.5 shadow-xs"
              >
                <Edit3 className="size-3.5" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTabChange("overview")}
                className="gap-1.5"
              >
                <span>View Overview</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Link
                href={roleConfig.dashboardHref}
                className="flex items-center gap-1.5"
              >
                <LayoutDashboard className="size-3" />
                <span>Role Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* User Identity Details */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {profile.displayUsername || profile.name}
            </h1>

            {/* Role Badge */}
            <Badge variant={roleConfig.variant} className="gap-1">
              <RoleIcon className="size-3" />
              <span>{roleConfig.label}</span>
            </Badge>

            {/* Email Verified Badge */}
            {profile.emailVerified ? (
              <Badge
                variant="success"
                className="gap-1"
                title="Email address has been verified"
              >
                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>Verified</span>
              </Badge>
            ) : (
              <button
                type="button"
                onClick={() => setShowVerifyDialog(true)}
                className="cursor-pointer"
              >
                <Badge
                  variant="warning"
                  className="gap-1 hover:bg-amber-500/20 transition-colors"
                  title="Click to verify your email address"
                >
                  <AlertTriangle className="size-3 text-amber-600 dark:text-amber-400" />
                  <span>Unverified — Verify Now</span>
                </Badge>
              </button>
            )}
          </div>

          {/* Handle / Name & Metadata subtitle */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {profile.username && (
              <span className="font-mono font-medium text-foreground/80">
                @{profile.username}
              </span>
            )}
            {profile.displayUsername && profile.name && (
              <span>({profile.name})</span>
            )}
            <span className="truncate">{profile.email}</span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3 text-muted-foreground/70" />
              <span>Joined {memberSince}</span>
            </span>
          </div>
        </div>

        {/* Banned Alert Banner (If applicable) */}
        {isBanned && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-destructive">
            <AlertTriangle className="size-5 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <p className="font-semibold">
                Your account is currently restricted
              </p>
              <p className="text-destructive/90">
                Reason: {profile.banReason || "Terms of service violation"}
              </p>
              {profile.banExpires && (
                <p className="text-muted-foreground font-mono text-[11px]">
                  Expires: {new Date(profile.banExpires).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Email Verification Dialog */}
      <EmailVerificationDialog
        profile={profile}
        isOpen={showVerifyDialog}
        onClose={() => setShowVerifyDialog(false)}
      />
    </Card>
  );
}
