import type { Metadata } from "next";
import Link from "next/link";
import { Package, Truck, Clock, ArrowRight, PlusCircle, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer Dashboard — Waypoint Logistics",
  description: "Manage your consignments, track active parcels, and book new deliveries.",
};

export default function CustomerDashboardPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background py-10 sm:py-14 border-b border-border/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <span>Customer Command Center</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Customer{" "}
            <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Portal
            </span>
          </h1>

          <p className="text-sm text-muted-foreground max-w-xl">
            Real-time telemetry, parcel booking, and verified delivery tracking across Bangladesh.
          </p>
        </div>
      </section>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Live Tracking Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Truck className="size-6" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Active Order Tracking</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Follow your current packages in real time through sorting hubs, highway linehaul trucks, and neighborhood courier riders.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/customer/tracking"
                className={cn(buttonVariants({ variant: "default", size: "default" }), "rounded-xl gap-2 w-full font-semibold")}
              >
                <span>Open Live Tracking</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Book Parcel Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
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
                className={cn(buttonVariants({ variant: "outline", size: "default" }), "rounded-xl gap-2 w-full font-medium")}
              >
                <Package className="size-4" />
                <span>Book New Parcel</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
