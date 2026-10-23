import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { HelpSupportClient } from "@/features/help/components/HelpSupportClient";

export const metadata: Metadata = {
  title: "Help & Support Center — Waypoint",
  description:
    "Searchable knowledge base, FAQ solutions, live dispatch hotline, and ticket submission for Waypoint logistics and parcel consignments across Bangladesh.",
};

export default function HelpPage() {
  return (
    <div className="w-full bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero */}
        <div className="space-y-3 text-center sm:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <HelpCircle className="size-3.5" />
            <span>Waypoint Customer & Merchant Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Help &{" "}
            <span className="bg-linear-to-r from-primary via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Support Center
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Find instant answers on parcel tracking, automated COD settlements, and API configurations, or submit a direct ticket to our 24/7 operations command center.
          </p>
        </div>

        {/* Interactive Client Component */}
        <HelpSupportClient />
      </div>
    </div>
  );
}
