import type { Metadata } from "next";
import { Sliders, Sparkles } from "lucide-react";
import { SettingsView } from "./settings-view";

export const metadata: Metadata = {
  title: "Account & Platform Settings — Waypoint",
  description:
    "Customize your Waypoint experience. Control appearance, dark mode, alert preferences, regional defaults, and session security.",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-14 sm:py-20 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sliders className="size-3.5" />
              <span>Platform & Appearance Preferences</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              Settings &{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Preferences
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Manage your display theme, dark mode behavior, delivery alerts, and default regional logistics parameters.
            </p>
          </div>
        </div>
      </section>

      {/* Main Settings Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SettingsView />
        </div>
      </section>
    </div>
  );
}
