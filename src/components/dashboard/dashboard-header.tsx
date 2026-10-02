"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight, Home } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "./dashboard-context";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { UserProfileMenu } from "@/components/common/user-profile-menu";
import { ActiveShipmentsBadge } from "@/components/common/active-shipments-badge";
import { ROLE_DASHBOARD_METADATA } from "@/config/dashboard-nav";
import { cn } from "@/lib/utils";

const ROUTE_NAME_MAP: Record<string, string> = {
  customer: "Customer",
  courier: "Courier",
  admin: "Admin",
  book: "Book Parcel",
  shipments: "Shipments",
  tracking: "Live Tracking",
  hubs: "Hub Network",
  users: "Users",
  revenue: "Platform Revenue",
  history: "Delivery History",
  profile: "Profile",
  settings: "Settings",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { toggleSidebar } = useDashboard();

  const role = user?.role || "CUSTOMER";
  const roleMeta =
    ROLE_DASHBOARD_METADATA[role] || ROLE_DASHBOARD_METADATA.CUSTOMER;

  // Build breadcrumbs dynamically from current pathname
  const segments = React.useMemo(() => {
    return pathname.split("/").filter(Boolean);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-4 sm:px-6 backdrop-blur-xl">
      {/* Left: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex lg:hidden size-9 items-center justify-center rounded-xl border border-border/80 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href={roleMeta.rootPath}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="size-3.5" />
            <span className="capitalize">{roleMeta.badgeLabel}</span>
          </Link>

          {segments.length > 1 &&
            segments.slice(1).map((seg, index) => {
              const isLast = index === segments.length - 2;
              const href = `/${segments.slice(0, index + 2).join("/")}`;
              const label = ROUTE_NAME_MAP[seg] || seg.replace(/-/g, " ");

              return (
                <React.Fragment key={href}>
                  <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
                  {isLast ? (
                    <span className="font-semibold text-foreground capitalize truncate max-w-40]">
                      {label}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="hover:text-foreground transition-colors capitalize truncate max-w-30"
                    >
                      {label}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
        </nav>

        {/* Mobile Page Title Fallback */}
        <div className="sm:hidden flex items-center gap-1.5">
          <span className="text-sm font-bold text-foreground capitalize truncate">
            {segments.length > 1
              ? ROUTE_NAME_MAP[segments[segments.length - 1]] ||
                segments[segments.length - 1]
              : roleMeta.badgeLabel}
          </span>
        </div>
      </div>

      {/* Right: Actions, Notifications, Theme, & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active shipments telemetry badge for customers */}
        {role === "CUSTOMER" && (
          <>
            <ActiveShipmentsBadge
              variant="desktop"
              className="hidden sm:inline-flex"
            />
            <ActiveShipmentsBadge variant="mobile" className="sm:hidden" />
          </>
        )}
      </div>
    </header>
  );
}
