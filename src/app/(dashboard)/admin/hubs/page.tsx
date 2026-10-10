import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { HubManagementTable } from "@/features/hubs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hub Network Infrastructure",
  description:
    "Manage sorting hubs, capacity thresholds, cutoff times, and divisional gateway facilities.",
};

export default function AdminHubsPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-indigo-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Building2 className="size-3.5" />
              <span>Logistics Infrastructure</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Sorting Hub{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Network
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Register sorting facilities across 64 districts, adjust daily
              dispatch cutoffs, and monitor package throughput limits.
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

      {/* Hub Management Table with Suspense */}
      <React.Suspense
        fallback={
          <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground animate-pulse">
            Loading sorting hubs directory...
          </div>
        }
      >
        <HubManagementTable />
      </React.Suspense>
    </div>
  );
}
