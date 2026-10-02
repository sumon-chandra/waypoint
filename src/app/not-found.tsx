"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Home,
  LayoutDashboard,
  Search,
  LifeBuoy,
  Navigation,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalNotFoundPage() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Background Animated Ambient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 sm:size-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 size-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 right-1/4 size-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-12 shadow-2xl backdrop-blur-2xl text-center space-y-8">
        {/* Brand Header */}
        <div className="flex justify-center">
          <Logo size="md" variant="full" />
        </div>

        {/* Animated 404 Hero Section */}
        <div className="space-y-4">
          {/* Animated Radar Pulse Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md shadow-xs">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
            <Compass className="size-3.5 animate-spin [animation-duration:8s]" />
            <span className="tracking-wide">Waypoint Lost in Transit</span>
          </div>

          {/* Floating Animated 404 Typography */}
          <div className="relative select-none py-2">
            <div className="text-7xl sm:text-9xl font-black tracking-tighter bg-linear-to-b from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm inline-block transition-transform duration-500 hover:scale-105">
              4
              <span className="inline-block animate-bounce [animation-duration:2.5s] text-primary">
                0
              </span>
              4
            </div>

            {/* Orbiting Waypoint Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 sm:size-52 rounded-full border border-dashed border-primary/30 pointer-events-none animate-spin [animation-duration:20s]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Coordinates Unreachable
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            The parcel, routing node, or destination you are searching for is outside our active delivery grid or may have been permanently archived.
          </p>
        </div>

        {/* Primary Action Buttons (Home and Go Back) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Go Back Action */}
          <button
            type="button"
            onClick={handleGoBack}
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full sm:w-auto rounded-xl gap-2 font-medium hover:border-primary/50 transition-all cursor-pointer shadow-xs"
            )}
            aria-label="Go back to the previous screen"
          >
            <ArrowLeft className="size-4" />
            <span>Go Back</span>
          </button>

          {/* Home Page Link */}
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "w-full sm:w-auto rounded-xl gap-2 font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform"
            )}
          >
            <Home className="size-4" />
            <span>Back to Home</span>
          </Link>

          {/* Dashboard Shortcut */}
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "secondary", size: "default" }),
              "w-full sm:w-auto rounded-xl gap-2 font-medium"
            )}
          >
            <LayoutDashboard className="size-4" />
            <span>My Dashboard</span>
          </Link>
        </div>

        {/* Secondary Quick Links */}
        <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <Link
            href="/tracking"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Search className="size-3.5 text-primary" />
            <span>Track a Parcel</span>
          </Link>

          <span className="size-1 rounded-full bg-border" />

          <Link
            href="/services"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Navigation className="size-3.5 text-primary" />
            <span>Network Coverage</span>
          </Link>

          <span className="size-1 rounded-full bg-border" />

          <Link
            href="/contact"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <LifeBuoy className="size-3.5 text-primary" />
            <span>Support Desk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
