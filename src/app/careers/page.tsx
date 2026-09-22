import type { Metadata } from "next";
import {
  Sparkles,
  Heart,
  TrendingUp,
  Laptop,
  GraduationCap,
  ShieldCheck,
  Coffee,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CareersClient } from "./careers-client";

export const metadata: Metadata = {
  title: "Careers & Open Positions — Waypoint",
  description:
    "Join the team modernizing logistics in Bangladesh. Explore open roles across engineering, product, linehaul operations, and fleet management at Waypoint.",
};

const perks = [
  {
    icon: TrendingUp,
    title: "Competitive Pay & Equity",
    desc: "Top-of-market compensation packages with generous performance bonuses and equity incentives.",
  },
  {
    icon: ShieldCheck,
    title: "Comprehensive Healthcare",
    desc: "Full inpatient and outpatient insurance coverage for employees, spouses, and children.",
  },
  {
    icon: Laptop,
    title: "Hardware of Choice",
    desc: "Latest Apple Silicon MacBooks, high-resolution external monitors, and ergonomic workstation setups.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Conference Budget",
    desc: "Annual educational stipend for courses, technical certifications, and international tech conferences.",
  },
  {
    icon: Coffee,
    title: "Flexible Hybrid Culture",
    desc: "Balanced hybrid work policy in Dhaka with flexible hours and modern open collaboration hubs.",
  },
  {
    icon: Heart,
    title: "Family & Parental Leave",
    desc: "Generous paid maternity and paternity leave, plus emergency family healthcare allowances.",
  },
];

export default function CareersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>We Are Hiring Problem Solvers</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Build the Supply Chain Backbone of{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Bangladesh
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We are tackling the hardest challenges in physical distribution,
              telemetry, and automated fintech. Join our team of operators,
              engineers, and builders.
            </p>
          </div>
        </div>
      </section>

      {/* Perks & Benefits Grid */}
      <section className="py-16 sm:py-20 bg-muted/20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="border-primary/20 text-primary">
              Why Waypoint
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Life, Culture & Benefits
            </h2>
            <p className="text-sm text-muted-foreground">
              We invest deeply in our people, giving you the autonomy and
              support to do your life&apos;s best work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-3"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Roles Listing */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="border-primary/20 text-primary">
              Current Openings
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Explore Available Positions
            </h2>
            <p className="text-sm text-muted-foreground">
              Find a role where you can create lasting impact on national
              commerce.
            </p>
          </div>

          <CareersClient />
        </div>
      </section>
    </div>
  );
}
