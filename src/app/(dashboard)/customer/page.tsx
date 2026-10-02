import type { Metadata } from "next";
import Link from "next/link";
import { Package, Truck, ArrowRight, PlusCircle, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer Command Center",
  description: "Manage your consignments, track active parcels, and book new deliveries nationwide.",
};

const CUSTOMER_STATS = [
  {
    label: "Active Deliveries",
    value: "3",
    detail: "In transit across hubs",
    icon: Truck,
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    label: "Delivered Parcels",
    value: "28",
    detail: "Confirmed receipt",
    icon: Package,
    color: "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    label: "Pending Invoices",
    value: "0",
    detail: "All paid via Stripe/COD",
    icon: ShieldCheck,
    color: "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-indigo-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>Customer Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Customer{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Portal
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Real-time consignment telemetry, instant parcel bookings, and verified milestone tracking across Bangladesh.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/customer/book"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl gap-2 font-semibold shadow-xs"
              )}
            >
              <PlusCircle className="size-4" />
              <span>Book Consignment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CUSTOMER_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-border hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                <div className={cn("size-9 rounded-xl border flex items-center justify-center", stat.color)}>
                  <Icon className="size-4" />
                </div>
              </div>

              <div>
                <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{stat.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Tracking Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Truck className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Active Order Tracking</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Follow your packages in real time through sorting hubs, highway linehaul transports, and neighborhood courier riders.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/customer/tracking"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl gap-2 w-full font-semibold"
              )}
            >
              <span>Open Live Tracking</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Book Parcel Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <PlusCircle className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Book a Consignment</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate digital waypoint waybills with instant QR routing tags across all 64 districts in Bangladesh.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/customer/book"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-xl gap-2 w-full font-medium"
              )}
            >
              <Package className="size-4" />
              <span>Book New Parcel</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
