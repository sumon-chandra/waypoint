"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Lock,
  Phone,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiSearchSuggestions } from "@/features/ai";
import { cn } from "@/lib/utils";

const SAMPLE_CODES = [
  { code: "WP-849201", label: "Sample Inter-District Delivery" },
  { code: "WP-309112", label: "Sample Same-Day Metro" },
  { code: "WP-501982", label: "Sample Cold-Chain Transit" },
];

export default function TrackingPortalPage() {
  const router = useRouter();
  const [trackingInput, setTrackingInput] = React.useState("");
  const [isAiSuggestionsVisible, setIsAiSuggestionsVisible] =
    React.useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = trackingInput.trim().toUpperCase();
    if (code) {
      router.push(`/track/${encodeURIComponent(code)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Tracking Search Banner */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="size-3.5" />
            <span>Real-Time Node Telemetry Across Bangladesh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Track Your{" "}
            <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Waypoint Consignment
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Enter your Waypoint consignment tracking number (e.g.{" "}
            <code className="font-mono text-primary font-bold">WP-849201</code>)
            to view the single active delivery stage, physical scan checkpoints,
            and courier details.
          </p>

          {/* Interactive Tracking Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <form
              onSubmit={handleTrackSubmit}
              className="relative flex items-center"
            >
              <div className="relative flex-1">
                <Package className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  onFocus={() => setIsAiSuggestionsVisible(true)}
                  onBlur={() =>
                    setTimeout(() => setIsAiSuggestionsVisible(false), 250)
                  }
                  placeholder="Enter tracking number (e.g. WP-849201)..."
                  className="pl-12 pr-4 h-14 text-sm sm:text-base font-mono uppercase rounded-2xl bg-card border-border/80 shadow-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={!trackingInput.trim()}
                className="absolute right-2 h-10 px-5 rounded-xl font-bold shadow-md cursor-pointer gap-1.5"
              >
                <span>Track</span>
                <ArrowRight className="size-4" />
              </Button>
            </form>

            {/* AI Search Suggestions Overlay */}
            {isAiSuggestionsVisible && trackingInput.trim().length > 1 && (
              <div className="relative mt-2 text-left z-20">
                <AiSearchSuggestions
                  query={trackingInput}
                  onSelectSuggestion={(sug) => {
                    router.push(sug.href);
                    setIsAiSuggestionsVisible(false);
                  }}
                />
              </div>
            )}

            {/* Sample Tracking Chips */}
            {/* <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-muted-foreground">
              <span className="font-medium">Try quick sample:</span>
              {SAMPLE_CODES.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => router.push(`/track/${s.code}`)}
                  className="font-mono text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full transition-colors cursor-pointer border border-primary/20"
                >
                  {s.code}
                </button>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* How Waypoint Tracking Works Section */}
      <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Node-to-Node Real-Time Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every parcel moves through certified scan checkpoints with zero
              blind spots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-foreground">
                Intake Scan
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Parcels are barcoded and cubed at regional cross-dock terminals
                within 60 minutes of courier collection.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-foreground">
                Linehaul Telemetry
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                High-capacity highway vehicles move scheduled runs between the 8
                central divisional gateways.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-foreground">
                Out for Delivery
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Final-mile riders receive optimized delivery manifests and live
                phone notifications are dispatched.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs space-y-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold font-mono">
                04
              </div>
              <h3 className="text-base font-bold text-foreground">
                OTP Handshake
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The parcel is only completed when the recipient provides the
                unique 4-digit SMS OTP, guaranteeing verified delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recipient Helpdesk Banner */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Phone className="size-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Have Questions About Your Parcel?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Our 24/7 central dispatch desk in Tejgaon is on standby to assist
              recipients and senders nationwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:0961292976468"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-xl font-semibold gap-1.5",
              )}
            >
              <Phone className="size-4" />
              <span>Call 09612-WAYPOINT</span>
            </a>
            <Link
              href="/faq"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-xl font-medium",
              )}
            >
              Tracking FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
