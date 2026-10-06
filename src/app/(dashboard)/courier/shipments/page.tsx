import type { Metadata } from "next";
import Link from "next/link";
import { PackageCheck, ArrowLeft } from "lucide-react";
import { CourierManifestList } from "@/features/shipments/components/courier";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Delivery Manifest",
  description:
    "Assigned parcels, pickup queues, active delivery routes, and OTP handovers.",
};

export default function CourierShipmentsPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-linear-to-r from-amber-500/10 via-orange-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <PackageCheck className="size-3.5" />
              <span>Assigned Consignments</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Delivery{" "}
              <span className="bg-linear-to-r from-amber-600 via-orange-600 to-primary bg-clip-text text-transparent">
                Manifest
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              View your active parcel runs, mark collections from senders, and perform secure OTP delivery handovers.
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

      {/* Manifest List with Filters */}
      <CourierManifestList />
    </div>
  );
}
