"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  Truck,
  MapPin,
  ShieldCheck,
  Phone,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Zap,
  Clock,
  Snowflake,
  Boxes,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfileMenu } from "@/components/common/user-profile-menu";
import { ActiveShipmentsBadge } from "@/components/common/active-shipments-badge";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems: NavItem[] = React.useMemo(() => {
    if (isAuthenticated) {
      return [
        { label: "Services", href: "/services" },
        { label: "Hub Network", href: "/hubs" },
        { label: "Track", href: "/track" },
        { label: "Pricing", href: "/pricing" },
        { label: "Book Parcel", href: "/customer/book" },
        { label: "My Shipments", href: "/customer/shipments" },
        { label: "Blog", href: "/blog" },
      ];
    }

    return [
      { label: "Services", href: "/services" },
      { label: "Hub Network", href: "/hubs" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
    ];
  }, [isAuthenticated]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
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

          {/* Desktop Navigation Links with ShadCN NavigationMenu */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* 1. Advanced Services Mega-Menu Dropdown */}
                <NavigationMenuItem value="services">
                  <NavigationMenuTrigger
                    className={cn(
                      pathname.startsWith("/services")
                        ? "text-foreground font-semibold bg-accent/60"
                        : "text-muted-foreground hover:bg-accent/40"
                    )}
                  >
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[580px] lg:w-[680px]">
                    <div className="grid grid-cols-12 gap-3.5">
                      {/* Left: Featured Solutions Hub (5 cols) */}
                      <div className="col-span-5 rounded-xl bg-linear-to-b from-primary/15 via-primary/5 to-muted/20 p-4 border border-primary/20 flex flex-col justify-between">
                        <div>
                          <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-2.5 shadow-xs">
                            <Truck className="size-4.5" />
                          </div>
                          <h4 className="text-sm font-bold text-foreground">
                            Logistics Portfolio
                          </h4>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                            Nationwide courier, heavy freight, and cold-chain infrastructure across all 64 districts.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-border/50">
                          <NavigationMenuLink asChild>
                            <Link
                              href="/services"
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                            >
                              <span>Browse All 8 Services</span>
                              <ArrowRight className="size-3" />
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>

                      {/* Right: Curated Quick Service Links (7 cols) */}
                      <div className="col-span-7 flex flex-col gap-1">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/services/express"
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted/60 transition-colors group"
                          >
                            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                              <Zap className="size-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                Express Parcel Delivery
                              </p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">
                                Guaranteed 12-24h nationwide courier & 18:00 cutoff
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>

                        <NavigationMenuLink asChild>
                          <Link
                            href="/services/same-day"
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted/60 transition-colors group"
                          >
                            <div className="size-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                              <Clock className="size-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                Same-Day City Transit
                              </p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">
                                4-8h rush intra-city courier for Dhaka and Chittagong
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>

                        <NavigationMenuLink asChild>
                          <Link
                            href="/services/cold-chain"
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted/60 transition-colors group"
                          >
                            <div className="size-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Snowflake className="size-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                Cold-Chain Logistics
                              </p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">
                                Calibrated +2°C to +8°C refrigerated telemetry
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>

                        <NavigationMenuLink asChild>
                          <Link
                            href="/services/freight"
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted/60 transition-colors group"
                          >
                            <div className="size-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                              <Boxes className="size-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                Heavy Linehaul Freight
                              </p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">
                                Scheduled FTL linehauls connecting all 8 divisions
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 2. Remaining Navigation Links */}
                {navItems
                  .filter((item) => item.label !== "Services")
                  .map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <NavigationMenuItem key={item.href}>
                        <NavigationMenuLink asChild active={isActive}>
                          <Link
                            href={item.href}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "h-9 px-3 py-1.5 text-sm font-medium",
                              isActive
                                ? "text-foreground font-semibold bg-accent/60"
                                : "text-muted-foreground hover:bg-accent/40"
                            )}
                          >
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Auth Actions */}
          <div className="flex items-center gap-2.5">
            {mounted && isAuthenticated && user ? (
              <>
                <ActiveShipmentsBadge variant="desktop" />
                <UserProfileMenu align="end" />
              </>
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
                    "gap-1.5 shadow-sm",
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
          {mounted && isAuthenticated && user && (
            <ActiveShipmentsBadge variant="mobile" />
          )}
          {mounted && isAuthenticated && user ? (
            <UserProfileMenu align="end" />
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "xs" }),
                "text-xs px-2.5",
              )}
            >
              Sign In
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
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
      {/* <nav
        className="flex md:hidden items-center gap-1.5 overflow-x-auto px-4 py-2 border-t border-border/40 bg-background/95 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-full px-1 py-0.2 text-[9px] font-bold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/15 text-primary",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav> */}

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
              {/* Active Orders Banner for Customer */}
              {mounted && isAuthenticated && user?.role === "CUSTOMER" && (
                <ActiveShipmentsBadge
                  variant="drawer"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigation
                </p>
                <div className="mt-2 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <div key={item.href} className="space-y-1">
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground hover:bg-muted",
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            {item.label === "Services" && (
                              <Truck className="size-4 text-primary" />
                            )}
                            {item.label === "Hub Network" && (
                              <MapPin className="size-4 text-primary" />
                            )}
                            {item.label === "Pricing" && (
                              <ShieldCheck className="size-4 text-primary" />
                            )}
                            {item.label === "About" && (
                              <Phone className="size-4 text-primary" />
                            )}
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {item.badge}
                            </span>
                          )}
                        </Link>

                        {/* Services Nested Sub-Menu in Drawer */}
                        {item.label === "Services" && (
                          <div className="ml-6 pl-3 border-l border-border/60 space-y-1 py-1">
                            <Link
                              href="/services/express"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Zap className="size-3 text-primary" />
                              <span>Express Delivery (12-24h)</span>
                            </Link>
                            <Link
                              href="/services/same-day"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Clock className="size-3 text-indigo-500" />
                              <span>Same-Day Transit (4-8h)</span>
                            </Link>
                            <Link
                              href="/services/cold-chain"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Snowflake className="size-3 text-cyan-500" />
                              <span>Cold-Chain Logistics</span>
                            </Link>
                            <Link
                              href="/services/freight"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Boxes className="size-3 text-amber-500" />
                              <span>Heavy Freight (FTL/LTL)</span>
                            </Link>
                          </div>
                        )}
                      </div>
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
                    <span className="text-xs font-semibold text-foreground">
                      Customer Portal
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Book & track parcels
                    </span>
                  </Link>
                  <Link
                    href="/courier"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col p-3 rounded-lg border border-border/60 bg-card/60 hover:bg-accent/40 transition-colors"
                  >
                    <span className="text-xs font-semibold text-foreground">
                      Courier Portal
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Deliveries & status
                    </span>
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
                          {user.name
                            ? user.name.trim().charAt(0).toUpperCase()
                            : "U"}
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
                          "w-full text-xs gap-1.5",
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
                          "w-full text-xs gap-1.5",
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
                        "w-full h-11 font-medium justify-center shadow-md gap-2",
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
                        "w-full h-11 font-medium justify-center",
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
                    <span>All 64 Districts Connected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="size-3" />
                    <span>09612-WAYPOINT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}

export default Navbar;
