import type { Metadata } from "next";
import Link from "next/link";
import { History, ArrowLeft } from "lucide-react";
import { CourierDeliveryHistoryTable } from "@/features/shipments/components/courier";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Delivery History & COD Audit",
  description:
    "Completed consignment history, verified recipient drop-offs, and collected COD funds.",
};

export default function CourierHistoryPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-emerald-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <History className="size-3.5" />
              <span>Completed Consignments</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Delivery{" "}
              <span className="bg-linear-to-r from-emerald-600 via-teal-600 to-primary bg-clip-text text-transparent">
                History
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Audit trail of all parcels you successfully delivered with OTP verification, alongside collected cash amounts to remit.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/courier"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl gap-1.5 hover:bg-background/80 font-medium"
              )}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Overview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Delivery History Table */}
      <CourierDeliveryHistoryTable />
    </div>
  );
}
