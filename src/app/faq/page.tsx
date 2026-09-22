import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { FAQClient } from "./faq-client";

export const metadata: Metadata = {
  title: "Knowledge Base & Frequently Asked Questions — Waypoint",
  description:
    "Find answers to common questions about parcel tracking, COD settlements, merchant rate cards, prohibited goods, and courier partner onboarding in Bangladesh.",
};

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Waypoint Help Center & Knowledge Base</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Frequently Asked{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Clear, transparent answers on parcel tracking, automated COD
              settlements, merchant integrations, and shipping policies across
              Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FAQClient />
        </div>
      </section>
    </div>
  );
}
