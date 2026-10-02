import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Boxes,
  Users,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Command Center",
  description: "Nationwide logistics monitoring, hub orchestration, and system telemetry.",
};

const STATS = [
  {
    label: "Total Consignments",
    value: "1,248",
    change: "+12.4%",
    positive: true,
    icon: Boxes,
    color: "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    label: "Active Sorting Hubs",
    value: "14",
    change: "64 Districts Covered",
    positive: true,
    icon: Building2,
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    label: "Active Couriers",
    value: "86",
    change: "98.2% On Time",
    positive: true,
    icon: Users,
    color: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    label: "Monthly Revenue",
    value: "৳ 482,500",
    change: "+18.7% vs last mo",
    positive: true,
    icon: BarChart3,
    color: "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

const QUICK_ACTIONS = [
  {
    title: "Hub Network",
    description: "Manage divisional hubs, sorting throughput, capacity limits, and gateway cutoffs.",
    href: "/admin/hubs",
    icon: Building2,
    cta: "Manage Hubs",
    accent: "hover:border-primary/50",
  },
  {
    title: "Global Shipments",
    description: "Monitor nationwide deliveries, re-route parcels, and override courier assignments.",
    href: "/admin/shipments",
    icon: Boxes,
    cta: "View Shipments",
    accent: "hover:border-indigo-500/50",
  },
  {
    title: "User Management",
    description: "Audit customer accounts, verify courier licenses, and configure role authorizations.",
    href: "/admin/users",
    icon: Users,
    cta: "Manage Accounts",
    accent: "hover:border-purple-500/50",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-linear-to-r from-purple-500/10 via-indigo-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
              <ShieldCheck className="size-3.5" />
              <span>Platform Authority Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Admin{" "}
              <span className="bg-linear-to-r from-purple-600 via-indigo-600 to-primary bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Real-time nationwide logistics oversight, hub load telemetry, courier dispatching, and system management.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/hubs"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl gap-2 font-semibold shadow-xs"
              )}
            >
              <Building2 className="size-4" />
              <span>Manage Hubs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
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
                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <TrendingUp className="size-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Portals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Operational Modules</h2>
            <p className="text-xs text-muted-foreground">Direct access to core logistics infrastructure controllers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {QUICK_ACTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={cn(
                  "group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:shadow-md",
                  item.accent
                )}
              >
                <div className="space-y-3">
                  <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-105">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full rounded-xl justify-between group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all font-semibold"
                    )}
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
