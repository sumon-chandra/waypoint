import type { Metadata } from "next";
import Link from "next/link";
import {
  Truck,
  PackageCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Navigation,
  MapPin,
  CalendarCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Courier Fleet Operations",
  description: "Field courier operations, active delivery routes, and consignment status updates.",
};

const COURIER_METRICS = [
  {
    label: "Assigned For Delivery",
    value: "18",
    detail: "Ready for drop-off",
    icon: PackageCheck,
    color: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    label: "Completed Today",
    value: "12",
    detail: "Confirmed deliveries",
    icon: CheckCircle2,
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    label: "Pending Hub Handoffs",
    value: "4",
    detail: "Origin sorting hub",
    icon: Clock,
    color: "from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    label: "On-Time Rate",
    value: "99.4%",
    detail: "Fleet SLA compliance",
    icon: CalendarCheck,
    color: "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

export default function CourierDashboardPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-linear-to-r from-amber-500/10 via-orange-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Truck className="size-3.5" />
              <span>Courier Field Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Courier{" "}
              <span className="bg-linear-to-r from-amber-600 via-orange-600 to-primary bg-clip-text text-transparent">
                Fleet Operations
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Access your route manifest, record customer drop-offs, scan packages, and transition parcel delivery statuses.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/courier/shipments"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl gap-2 font-semibold shadow-xs bg-amber-600 hover:bg-amber-700 text-white"
              )}
            >
              <PackageCheck className="size-4" />
              <span>View Assigned Parcels</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COURIER_METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
                <div className={cn("size-9 rounded-xl border flex items-center justify-center", metric.color)}>
                  <Icon className="size-4" />
                </div>
              </div>

              <div>
                <p className="text-2xl font-black text-foreground tracking-tight">{metric.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{metric.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Runs Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Navigation className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Active Delivery Route</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review current consignments assigned to your dispatch manifest. Mark parcels as Picked Up, In Transit, or Delivered.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/courier/shipments"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl gap-2 w-full font-semibold"
              )}
            >
              <span>Open Delivery Manifest</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Hub Handover */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <MapPin className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Sorting Hub Check-In</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scan waypoint QR barcodes upon arrival at destination and origin sorting hubs to update central inventory logs.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/courier/history"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-xl gap-2 w-full font-medium"
              )}
            >
              <Clock className="size-4" />
              <span>Review Past Completed Runs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
