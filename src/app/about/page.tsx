import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Truck,
  ShieldCheck,
  HeartHandshake,
  Cpu,
  Leaf,
  Users,
  Target,
  Award,
  ArrowRight,
  CheckCircle2,
  Building,
  Globe2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Waypoint — Next-Gen Logistics Infrastructure",
  description:
    "Learn about Waypoint's mission to modernize parcel delivery across all 64 districts in Bangladesh with intelligent waypoint tracking, automated hubs, and courier dignity.",
};

const stats = [
  { value: "64", label: "Districts Connected", sub: "100% Nationwide coverage" },
  { value: "180+", label: "Regional Sorting Hubs", sub: "Strategic cross-dock nodes" },
  { value: "2.4M+", label: "Parcels Fulfilled", sub: "Since platform inception" },
  { value: "99.4%", label: "On-Time Delivery SLA", sub: "Industry-leading precision" },
  { value: "15,000+", label: "Courier Partners", sub: "Empowered nationwide fleet" },
  { value: "99.8%", label: "Remittance Accuracy", sub: "Next-business-day payouts" },
];

const corePillars = [
  {
    icon: ShieldCheck,
    title: "Relentless Reliability",
    description:
      "We treat every consignment as critical. By automating handover scans and SLA tracking, we eliminate transit loss and ensure merchants can make trusted delivery promises.",
  },
  {
    icon: Cpu,
    title: "Waypoint Transparency",
    description:
      "Logistics shouldn't be a black box. Our granular scan checkpoints inform senders and recipients at every stage—from pickup, through highway linehaul, to the final doorstep handover.",
  },
  {
    icon: HeartHandshake,
    title: "Courier Dignity & Safety",
    description:
      "Our delivery partners are the heartbeat of our business. We ensure above-market earnings, transparent dispatch algorithms, health benefits, and dedicated rider welfare hubs.",
  },
  {
    icon: Leaf,
    title: "Green & Sustainable Fleet",
    description:
      "We are actively transforming Bangladesh's urban logistics. Our electric trike pilot in Dhaka and algorithmic eco-routing reduce transit emissions by up to 28% per delivery route.",
  },
];

const teamMembers = [
  {
    name: "Tanvir Rahman",
    role: "Chief Executive Officer & Co-Founder",
    bio: "Ex-freight director with 14 years shaping South Asian supply chains and linehaul infrastructure.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    initials: "TR",
  },
  {
    name: "Dr. Nabila Hossain",
    role: "Chief Technology Officer",
    bio: "PhD in Operations Research from NUS. Architect of Waypoint's dynamic waypoint routing engine.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    initials: "NH",
  },
  {
    name: "Rafiqul Islam",
    role: "Head of Nationwide Hub Operations",
    bio: "Oversees 180+ sorting facilities, linehaul highway scheduling, and cross-dock precision.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    initials: "RI",
  },
  {
    name: "Samira Chowdhury",
    role: "Head of Merchant Experience & FinTech",
    bio: "Pioneered Waypoint's automated COD next-day reconciliation engine with Bangladesh Bank integration.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    initials: "SC",
  },
];

const milestones = [
  {
    year: "2023",
    title: "Founding & 3-Hub Pilot",
    desc: "Launched in Dhaka with 3 strategic hubs, pioneering digital scan receipts for 50 initial e-commerce merchants.",
  },
  {
    year: "2024",
    title: "Divisional Linehaul Expansion",
    desc: "Expanded across Chittagong, Sylhet, and Rajshahi with dedicated overnight highway transit containers.",
  },
  {
    year: "2025",
    title: "All 64 Districts Connected",
    desc: "Completed nationwide coverage with 180+ physical hubs, serving over 12,000 active businesses.",
  },
  {
    year: "2026",
    title: "Automated Waypoints & Green Fleet",
    desc: "Introduced real-time telemetry, automated COD settlements, and the zero-emission electric courier pilot.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Pioneering Next-Gen Logistics in Bangladesh</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Connecting Commerce.{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Empowering Every Mile.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Waypoint was founded on a simple conviction: logistics in Bangladesh should be
              predictable, transparent, and built on state-of-the-art technology. We are uniting
              all 64 districts under a single intelligent logistics fabric.
            </p>
          </div>
        </div>
      </section>

      {/* Network Scale By The Numbers */}
      <section className="py-14 sm:py-18 bg-muted/20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-5 text-center shadow-xs"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-semibold text-primary">
                  {stat.label}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Story Narrative */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                Our Narrative
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                From Transit Blind Spots to Predictable Waypoints
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  For years, online sellers and consumers in Bangladesh endured black-box delivery:
                  packages vanished into sorting depots with vague statuses like &quot;in processing&quot;,
                  reconciliation was delayed by weeks, and customer trust suffered.
                </p>
                <p>
                  Waypoint changed that paradigm. By integrating barcode node telemetry, centralized
                  inter-district linehaul containers, and automated banking webhooks, we created a
                  platform where merchants can account for every single waypoint in their parcel&apos;s
                  journey.
                </p>
                <p>
                  Today, whether a handcrafted textile travels from Sylhet to Khulna or a computer
                  component moves between Dhaka and Chittagong, Waypoint delivers with quantifiable
                  accuracy and peace of mind.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Licensed by Bangladesh Postal Dept.</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>ISO 9001:2015 Quality Certified</span>
                </div>
              </div>
            </div>

            {/* Visual Milestones Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-md space-y-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="size-5 text-primary" />
                <span>Our Milestones & Growth</span>
              </h3>
              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative pl-8 space-y-1">
                    <span className="absolute left-1.5 top-1.5 size-3.5 -translate-x-1/2 rounded-full border-2 border-primary bg-background" />
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{m.year}</span>
                      <span className="text-xs font-semibold text-foreground">&mdash; {m.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values & Pillars */}
      <section className="py-16 sm:py-24 bg-muted/20 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="border-primary/20 text-primary">
              Core Principles
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              What Sets Waypoint Apart
            </h2>
            <p className="text-sm text-muted-foreground">
              The foundational pillars guiding our logistics operations and product engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {corePillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="border-primary/20 text-primary">
              Leadership
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Experienced Minds Driving Innovation
            </h2>
            <p className="text-sm text-muted-foreground">
              Combining world-class software engineering with decades of boots-on-the-ground supply chain mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-xs hover:shadow-md hover:border-primary/40 transition-all text-center"
              >
                <div className="space-y-4">
                  <div className="mx-auto size-20 rounded-full border-2 border-primary/20 bg-muted flex items-center justify-center overflow-hidden">
                    <span className="text-lg font-bold text-primary font-mono">
                      {member.initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{member.name}</h3>
                    <p className="text-xs font-medium text-primary mt-0.5">{member.role}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability & Green Fleet Highlight */}
      <section className="py-14 sm:py-20 bg-gradient-to-r from-emerald-500/10 via-background to-primary/10 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-emerald-500/20 bg-card/80 p-8 sm:p-12 shadow-sm backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Leaf className="size-3.5" />
                <span>Waypoint Green Logistics Pledge</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Committed to a Net-Zero Urban Fleet by 2030
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                By investing in electric delivery trikes, solar-assisted micro-hubs in Dhaka, and
                algorithm-driven route clustering, Waypoint has cut urban carbon output by 45 metric
                tons in 2025 alone.
              </p>
            </div>
            <Link
              href="/careers"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-xl shadow-md font-semibold gap-2 shrink-0"
              )}
            >
              <span>Join Our Mission</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
