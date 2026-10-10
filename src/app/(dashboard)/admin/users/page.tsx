import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import { UserManagementTable } from "@/features/users";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "User Directory & Account Governance",
  description:
    "Manage system administrators, courier riders, and customer accounts across the Waypoint platform.",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-purple-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Users className="size-3.5" />
              <span>Identity & Access Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              User{" "}
              <span className="bg-linear-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Directory
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Supervise platform users, manage courier accounts, inspect email
              verification states, and enforce access restrictions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl gap-1.5 hover:bg-background/80 font-medium",
              )}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Command Center</span>
            </Link>
          </div>
        </div>
      </div>

      {/* User Directory Table with Suspense */}
      <React.Suspense
        fallback={
          <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground animate-pulse">
            Loading user accounts directory...
          </div>
        }
      >
        <UserManagementTable />
      </React.Suspense>
    </div>
  );
}
