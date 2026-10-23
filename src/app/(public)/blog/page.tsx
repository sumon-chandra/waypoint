import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { BlogHubClient } from "@/features/blog/components/BlogHubClient";

export const metadata: Metadata = {
  title: "Logistics Insights & Dispatch Digest — Waypoint",
  description:
    "Curated technical analyses, inter-district freight studies, cold-chain engineering, and last-mile logistics strategies across Bangladesh.",
};

export default function BlogPage() {
  return (
    <div className="w-full bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="space-y-3 text-center sm:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <BookOpen className="size-3.5" />
            <span>Waypoint Editorial Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Logistics Insights &{" "}
            <span className="bg-linear-to-r from-primary via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Dispatch Digest
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Data-backed analyses, corridor efficiency reports, and engineering frameworks powering modern freight, hub automation, and cold-chain operations.
          </p>
        </div>

        {/* Interactive Client Hub */}
        <BlogHubClient />
      </div>
    </div>
  );
}
