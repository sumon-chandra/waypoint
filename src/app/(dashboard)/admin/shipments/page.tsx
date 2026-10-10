import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, ArrowLeft } from "lucide-react";
import { AdminShipmentTable } from "@/features/shipments/components/admin";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Global Shipments & Dispatch Terminal",
  description: "Monitor nationwide deliveries, re-route parcels, and override courier assignments.",
};

export default function AdminShipmentsPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-linear-to-r from-indigo-500/10 via-purple-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Boxes className="size-3.5" />
              <span>Platform Dispatch Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Global{" "}
              <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-primary bg-clip-text text-transparent">
                Shipments
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Nationwide consignment monitoring, manual courier rider assignments, and sorting hub transit operations.
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

      {/* Admin Shipment Table with Suspense */}
      <React.Suspense
        fallback={
          <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground animate-pulse">
            Loading nationwide shipments directory...
          </div>
        }
      >
        <AdminShipmentTable />
      </React.Suspense>
    </div>
  );
}
