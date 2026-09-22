"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Edit3,
  KeyRound,
  ChevronRight,
  Home,
  Loader2,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useProfileQuery,
  ProfileHeader,
  ProfileDetails,
  EditProfileForm,
  ChangePasswordForm,
} from "@/features/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const {
    data: profile,
    isLoading: isProfileLoading,
    isRefetching,
    refetch,
  } = useProfileQuery();

  const [activeTab, setActiveTab] = React.useState<
    "overview" | "edit" | "security"
  >("overview");

  // If auth is completely done and user is not authenticated, middleware redirects.
  // Fallback client check:
  React.useEffect(() => {
    if (!isAuthLoading && !authUser) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthLoading, authUser, router]);

  const isLoading = (isAuthLoading || isProfileLoading) && !profile;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <div className="size-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <User className="size-5 text-primary absolute inset-0 m-auto" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Loading your profile...
          </p>
          <p className="text-xs text-muted-foreground">
            Retrieving verified account credentials
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] px-4">
        <Card className="max-w-md w-full text-center p-6 space-y-4">
          <div className="size-12 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
            <User className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold">Profile Unavailable</h2>
            <p className="text-xs text-muted-foreground">
              Unable to load account information. Please sign in again or retry.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="size-3.5 mr-1.5" />
              <span>Retry</span>
            </Button>
            <Button size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Breadcrumbs & Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Link
                href="/"
                className="hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Home className="size-3" />
                <span>Home</span>
              </Link>
              <ChevronRight className="size-3 text-muted-foreground/50" />
              <span className="font-medium text-foreground">Profile</span>
            </nav>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Account Profile
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="text-xs text-muted-foreground hover:text-foreground"
              title="Refresh profile data"
            >
              <RefreshCw
                className={cn("size-3 mr-1", isRefetching && "animate-spin")}
              />
              <span>{isRefetching ? "Refreshing..." : "Refresh"}</span>
            </Button>
          </div>
        </div>

        {/* Profile Hero Header */}
        <ProfileHeader
          profile={profile}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Custom Navigation Tab Selector */}
        <div className="border-b border-border/80">
          <div className="flex items-center gap-2 -mb-px overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer",
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              <User className="size-3.5" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer",
                activeTab === "edit"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              <Edit3 className="size-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer",
                activeTab === "security"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              <KeyRound className="size-3.5" />
              <span>Security & Password</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === "overview" && (
            <ProfileDetails
              profile={profile}
              onEditClick={() => setActiveTab("edit")}
            />
          )}

          {activeTab === "edit" && (
            <EditProfileForm
              profile={profile}
              onSuccess={() => setActiveTab("overview")}
              onCancel={() => setActiveTab("overview")}
            />
          )}

          {activeTab === "security" && (
            <ChangePasswordForm
              profile={profile}
              onSuccess={() => setActiveTab("overview")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
