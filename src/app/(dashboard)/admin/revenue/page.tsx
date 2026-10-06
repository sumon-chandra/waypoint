import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ArrowLeft } from "lucide-react";
import { AdminDashboardOverview } from "@/features/analytics";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Platform Revenue & Financial Telemetry",
  description: "Track online payments, COD remittances, and operational financial metrics.",
};

export default function AdminRevenuePage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="size-3.5" />
              <span>Financial Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Platform{" "}
              <span className="bg-linear-to-r from-emerald-600 via-teal-600 to-primary bg-clip-text text-transparent">
                Revenue & COD
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Consolidated transaction volume, prepaid card receipts via Stripe, and pending cash-on-delivery reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl gap-1.5 hover:bg-background/80 font-medium"
              )}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Command Center</span>
            </Link>
          </div>
        </div>
      </div>

      <AdminDashboardOverview />
    </div>
  );
}
