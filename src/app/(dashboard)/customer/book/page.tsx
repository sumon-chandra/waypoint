import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft, PackagePlus } from "lucide-react";
import { BookingForm } from "@/features/shipments/components/form/BookingForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book Consignment",
  description:
    "Generate digital waypoint consignment waybills with instant tracking across all 64 districts in Bangladesh.",
};

export default function CustomerBookPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-indigo-500/5 to-background p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <PackagePlus className="size-3.5" />
              <span>Consignment Waybill Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Book New{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Consignment
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Register parcel details, select local or inter-district routing,
              and choose instant Stripe card checkout or Cash on Delivery across
              Bangladesh.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/customer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl gap-1.5 hover:bg-background/80 font-medium",
              )}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Overview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Booking Form */}
      <BookingForm />
    </div>
  );
}
