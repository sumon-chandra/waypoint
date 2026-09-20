import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /**
   * Display mode of the logo:
   * - 'full': Mark + typography + badge
   * - 'mark': Icon emblem only
   * - 'responsive': Auto-adapts between mark and full based on screen size
   */
  variant?: "full" | "mark" | "responsive";
  /** Size preset for the logo */
  size?: "sm" | "md" | "lg";
  /** Optional link destination. Defaults to "/" */
  href?: string;
  /** Whether to render as an interactive link or a plain element */
  asLink?: boolean;
  /** Optional subtitle or badge */
  showBadge?: boolean;
  /** Additional custom classes */
  className?: string;
}

const sizeConfig = {
  sm: {
    iconSize: "size-7",
    textClass: "text-lg",
    badgeClass: "text-[10px] px-1.5 py-0.5",
    gap: "gap-2",
  },
  md: {
    iconSize: "size-9",
    textClass: "text-xl",
    badgeClass: "text-[11px] px-2 py-0.5",
    gap: "gap-2.5",
  },
  lg: {
    iconSize: "size-11",
    textClass: "text-2xl",
    badgeClass: "text-xs px-2.5 py-0.5",
    gap: "gap-3",
  },
};

/**
 * Waypoint Vector Emblem
 * A modern geometric waypoint icon combining interconnected route nodes,
 * an aerodynamic 'W' contour, and a forward delivery vector.
 */
export function WaypointMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 aspect-square",
        className
      )}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wp-grad-primary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="wp-grad-accent" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Outer squircle container with sleek logistics gradient */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill="url(#wp-grad-primary)"
          className="transition-all"
        />

        {/* Subtle interior highlight border */}
        <rect
          x="3.75"
          y="3.75"
          width="40.5"
          height="40.5"
          rx="11.25"
          stroke="white"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />

        {/* Interconnected Waypoint Network Lines ('W' Path with delivery vector) */}
        {/* Left Wing of 'W' */}
        <path
          d="M13 16L18.5 32L24 21"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Wing of 'W' transitioning into an elevated forward waypoint arrow */}
        <path
          d="M24 21L29.5 32L35.5 16"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Waypoint Node Pulse */}
        <circle cx="24" cy="21" r="3" fill="#38BDF8" />
        <circle cx="24" cy="21" r="1.5" fill="white" />

        {/* Origin and Destination Hub Nodes */}
        <circle cx="13" cy="16" r="2.2" fill="white" />
        <circle cx="35.5" cy="16" r="2.2" fill="#38BDF8" />

        {/* Forward Motion Vector Dot */}
        <circle cx="35.5" cy="16" r="4.5" stroke="white" strokeWidth="1.2" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}

/**
 * Main Waypoint Logo Component
 * Adapts to desktop headers, compact mobile bars, and footers.
 */
export function Logo({
  variant = "responsive",
  size = "md",
  href = "/",
  asLink = true,
  showBadge = false,
  className,
}: LogoProps) {
  const currentSize = sizeConfig[size];

  const content = (
    <div
      className={cn(
        "inline-flex items-center select-none font-sans group transition-opacity hover:opacity-95",
        currentSize.gap,
        className
      )}
    >
      {/* Scalable Icon Mark */}
      <WaypointMark className={currentSize.iconSize} />

      {/* Typography & Brand Mark */}
      {variant !== "mark" && (
        <div
          className={cn(
            "flex items-baseline gap-1.5",
            variant === "responsive" && "flex"
          )}
        >
          <span
            className={cn(
              "font-extrabold tracking-tight text-foreground transition-colors",
              currentSize.textClass
            )}
          >
            Way<span className="text-primary font-black">point</span>
          </span>

          {showBadge && (
            <span
              className={cn(
                "hidden sm:inline-flex items-center font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20",
                currentSize.badgeClass
              )}
            >
              Logistics
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-transform"
        aria-label="Waypoint Logistics Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
