"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  ArrowRight,
  Truck,
  MapPin,
  ShieldCheck,
  Phone,
  Package,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfileMenu } from "@/components/common/user-profile-menu";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Tracking", href: "/tracking" },
  { label: "Services", href: "/services" },
  { label: "Hub Network", href: "/hubs", badge: "64" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [quickTrackQuery, setQuickTrackQuery] = React.useState("");
  const [mounted, setMounted] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(64);
  const headerRef = React.useRef<HTMLElement>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Update measured header height on mount and resize
  React.useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackQuery.trim()) return;
    window.location.href = `/tracking?id=${encodeURIComponent(quickTrackQuery.trim())}`;
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/90 backdrop-blur-md transition-all"
    >
      {/* Primary Top Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Scalable on desktop & mobile */}
        <div className="flex items-center gap-6">
          <Logo variant="responsive" size="md" showBadge />

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2"
            aria-label="Desktop Navigation"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md hover:text-foreground",
                    isActive
                      ? "text-foreground font-semibold bg-accent/60"
                      : "text-muted-foreground hover:bg-accent/40"
                  )}
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Track trigger */}
          <form onSubmit={handleQuickTrack} className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Track parcel ID..."
                value={quickTrackQuery}
                onChange={(e) => setQuickTrackQuery(e.target.value)}
                className="h-9 w-44 lg:w-52 rounded-full border border-input bg-muted/40 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                aria-label="Quick track parcel"
              />
              <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
            </div>
          </form>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            {mounted && isAuthenticated && user ? (
              <UserProfileMenu align="end" />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "gap-1.5 shadow-sm"
                  )}
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Header Actions (Right) */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && isAuthenticated && user ? (
            <UserProfileMenu align="end" />
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "xs" }),
                "text-xs px-2.5"
              )}
            >
              Sign In
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className="flex items-center justify-center size-9 rounded-lg border border-border/60 bg-muted/40 text-foreground hover:bg-muted active:scale-95 transition-all"
          >
            {isMobileMenuOpen ? (
              <X className="size-5 text-foreground" />
            ) : (
              <Menu className="size-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Strip - Visible directly on mobile devices */}
      <nav
        className="flex md:hidden items-center gap-1.5 overflow-x-auto px-4 py-2 border-t border-border/40 bg-background/95 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Mobile Quick Navigation"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all active:scale-95",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-full px-1 py-0.2 text-[9px] font-bold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/15 text-primary"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Drawer / Overlay Navigation (Portaled to document.body) */}
      {mounted &&
        isMobileMenuOpen &&
        createPortal(
          <div
            style={{ top: `${headerHeight}px` }}
            className="fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur-xl md:hidden overflow-y-auto border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Full Navigation Drawer"
          >
            <div className="flex flex-col min-h-[calc(100dvh-5rem)] p-5 space-y-6">
              {/* Quick Track Search Input */}
              <form onSubmit={handleQuickTrack} className="w-full">
                <div className="relative flex items-center">
                  <Search className="absolute left-3.5 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter tracking number (e.g. WP-8921)"
                    value={quickTrackQuery}
                    onChange={(e) => setQuickTrackQuery(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-muted/50 pl-10 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="xs"
                    className="absolute right-2 h-7 px-3 text-xs"
                  >
                    Track
                  </Button>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigation
                </p>
                <div className="mt-2 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          {item.label === "Tracking" && <Package className="size-4 text-primary" />}
                          {item.label === "Services" && <Truck className="size-4 text-primary" />}
                          {item.label === "Hub Network" && <MapPin className="size-4 text-primary" />}
                          {item.label === "Pricing" && <ShieldCheck className="size-4 text-primary" />}
                          {item.label === "About" && <Phone className="size-4 text-primary" />}
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Portals Quick Access */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Portals
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/customer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col p-3 rounded-lg border border-border/60 bg-card/60 hover:bg-accent/40 transition-colors"
                  >
                    <span className="text-xs font-semibold text-foreground">Customer Portal</span>
                    <span className="text-[11px] text-muted-foreground">Book & track parcels</span>
                  </Link>
                  <Link
                    href="/courier"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col p-3 rounded-lg border border-border/60 bg-card/60 hover:bg-accent/40 transition-colors"
                  >
                    <span className="text-xs font-semibold text-foreground">Courier Portal</span>
                    <span className="text-[11px] text-muted-foreground">Deliveries & status</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Auth CTAs */}
              <div className="mt-auto space-y-3 pt-6 border-t border-border/40">
                {mounted && isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/60 border border-border/60">
                      <Avatar size="md">
                        {(user.avatarUrl || user.avatar) && (
                          <AvatarImage
                            src={user.avatarUrl || user.avatar}
                            alt={user.name}
                          />
                        )}
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {user.name ? user.name.trim().charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={
                          user.role === "ADMIN"
                            ? "/admin"
                            : user.role === "COURIER"
                            ? "/courier"
                            : "/customer"
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "default", size: "sm" }),
                          "w-full text-xs gap-1.5"
                        )}
                      >
                        <LayoutDashboard className="size-3.5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "w-full text-xs gap-1.5"
                        )}
                      >
                        <UserIcon className="size-3.5" />
                        <span>Profile</span>
                      </Link>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await logout();
                      }}
                      className="w-full gap-2 text-xs cursor-pointer"
                    >
                      <LogOut className="size-3.5" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "w-full h-11 font-medium justify-center shadow-md gap-2"
                      )}
                    >
                      <span>Create Free Account</span>
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "w-full h-11 font-medium justify-center"
                      )}
                    >
                      Log In to Waypoint
                    </Link>
                  </>
                )}

                {/* Status & Support Badge */}
                <div className="flex items-center justify-between px-2 pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>All 64 Hubs Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="size-3" />
                    <span>09612-WAYPOINT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}

export default Navbar;
