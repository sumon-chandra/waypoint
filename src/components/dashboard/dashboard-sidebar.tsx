"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X, ChevronRight, Shield, Truck, UserCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/common/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getNavSectionsForRole,
  isNavItemActive,
  ROLE_DASHBOARD_METADATA,
  DashboardNavItem,
} from "@/config/dashboard-nav";
import { useDashboard } from "./dashboard-context";
import { cn } from "@/lib/utils";
import type { Role } from "@/features/auth/schemas/auth.schemas";

interface DashboardSidebarProps {
  className?: string;
  isMobile?: boolean;
}

export function DashboardSidebar({ className, isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { closeSidebar } = useDashboard();

  const role: Role = user?.role || "CUSTOMER";
  const roleMeta = ROLE_DASHBOARD_METADATA[role] || ROLE_DASHBOARD_METADATA.CUSTOMER;
  const navSections = React.useMemo(() => getNavSectionsForRole(role), [role]);

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";
  const avatarSrc = user?.avatarUrl || user?.avatar;

  const getRoleIcon = () => {
    switch (role) {
      case "ADMIN":
        return Shield;
      case "COURIER":
        return Truck;
      case "CUSTOMER":
      default:
        return UserCheck;
    }
  };

  const RoleIcon = getRoleIcon();

  const renderBadge = (item: DashboardNavItem) => {
    if (!item.badge) return null;

    if (item.badgeVariant === "success") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          {item.badge}
        </span>
      );
    }

    if (item.badgeVariant === "warning") {
      return (
        <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
          {item.badge}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
        {item.badge}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card/95 border-r border-border/80 backdrop-blur-xl select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-border/60 shrink-0">
        <Logo size="sm" href={roleMeta.rootPath} variant="full" />

        {isMobile && (
          <button
            type="button"
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            aria-label="Close navigation sidebar"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Role Pill Banner */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50">
          <div
            className={cn(
              "size-7 rounded-lg flex items-center justify-center shrink-0 border",
              roleMeta.themeColor.badge
            )}
          >
            <RoleIcon className="size-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-wide uppercase text-muted-foreground truncate">
              {roleMeta.badgeLabel}
            </p>
            <p className="text-xs font-semibold text-foreground truncate">
              {roleMeta.label}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
        {navSections.map((section, secIdx) => (
          <div key={section.title || `section-${secIdx}`} className="space-y-1">
            {section.title && (
              <h3 className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
                {section.title}
              </h3>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isNavItemActive(pathname, item);
                const ItemIcon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (isMobile) closeSidebar();
                    }}
                    className={cn(
                      "group relative flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 outline-none",
                      active
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ItemIcon
                        className={cn(
                          "size-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          active
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {renderBadge(item)}
                      {active && (
                        <ChevronRight className="size-3.5 opacity-80 text-primary-foreground" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-3 border-t border-border/60 shrink-0 bg-muted/20">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-muted/40 transition-colors">
          <Link
            href="/profile"
            onClick={() => {
              if (isMobile) closeSidebar();
            }}
            className="flex items-center gap-2.5 min-w-0 flex-1"
          >
            <Avatar size="sm" className="border border-border/80 shrink-0">
              {avatarSrc && <AvatarImage src={avatarSrc} alt={user?.name || "User"} />}
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name || "Signed In"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate" title={user?.email}>
                {user?.email || "Account"}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={async () => {
              if (isMobile) closeSidebar();
              await logout();
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            title="Sign out of account"
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
