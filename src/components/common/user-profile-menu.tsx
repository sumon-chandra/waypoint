"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Truck,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface UserProfileMenuProps {
  align?: "end" | "start";
  className?: string;
}

export function UserProfileMenu({
  align = "end",
  className,
}: UserProfileMenuProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  // Compute first character of user name as fallback
  const firstChar = user.name ? user.name.trim().charAt(0).toUpperCase() : "U";
  const avatarSrc = user.avatarUrl || user.avatar;

  // Determine dashboard link according to role
  const getDashboardHref = () => {
    switch (user.role) {
      case "ADMIN":
        return "/admin";
      case "COURIER":
        return "/courier";
      case "CUSTOMER":
      default:
        return "/customer";
    }
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case "ADMIN":
        return {
          label: "Admin",
          icon: Shield,
          className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        };
      case "COURIER":
        return {
          label: "Courier",
          icon: Truck,
          className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
      case "CUSTOMER":
      default:
        return {
          label: "Customer",
          icon: UserCheck,
          className: "bg-primary/10 text-primary border-primary/20",
        };
    }
  };

  const roleInfo = getRoleBadge();
  const RoleIcon = roleInfo.icon;

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  return (
    <div ref={menuRef} className={cn("relative inline-block text-left", className)}>
      {/* Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
        className={cn(
          "group flex items-center gap-2 rounded-full p-0.5 transition-all outline-none",
          "hover:ring-2 hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary",
          isOpen ? "ring-2 ring-primary" : ""
        )}
      >
        <Avatar size="md" className="border border-border/80 shadow-xs group-hover:scale-105 transition-transform">
          {avatarSrc && (
            <AvatarImage src={avatarSrc} alt={user.name} />
          )}
          <AvatarFallback className="bg-primary/15 text-primary text-sm font-bold">
            {firstChar}
          </AvatarFallback>
        </Avatar>

        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform duration-200 hidden sm:block",
            isOpen ? "rotate-180 text-foreground" : "group-hover:text-foreground"
          )}
        />
      </button>

      {/* Dropdown Popup Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            "absolute z-50 mt-2 w-64 rounded-2xl border border-border/80 bg-card/95 p-2 text-foreground shadow-xl backdrop-blur-xl",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150",
            align === "end" ? "right-0" : "left-0"
          )}
        >
          {/* User Profile Summary Header */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/50">
            <Avatar size="lg">
              {avatarSrc && (
                <AvatarImage src={avatarSrc} alt={user.name} />
              )}
              <AvatarFallback className="bg-primary/20 text-primary text-base font-bold">
                {firstChar}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.name}
                </p>
              </div>
              <p className="text-xs text-muted-foreground truncate" title={user.email}>
                {user.email}
              </p>
              <div className="mt-1 flex items-center">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                    roleInfo.className
                  )}
                >
                  <RoleIcon className="size-2.5" />
                  <span>{roleInfo.label}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="my-1.5 h-px bg-border/60" />

          {/* Navigation Items */}
          <div className="space-y-0.5">
            {/* Dashboard Link */}
            <Link
              href={getDashboardHref()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/60 hover:text-accent-foreground transition-colors"
              role="menuitem"
            >
              <LayoutDashboard className="size-4 text-primary" />
              <span>Dashboard</span>
            </Link>

            {/* View Profile Link */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/60 hover:text-accent-foreground transition-colors"
              role="menuitem"
            >
              <User className="size-4 text-primary" />
              <span>View Profile</span>
            </Link>

            {/* Settings Link */}
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/60 hover:text-accent-foreground transition-colors"
              role="menuitem"
            >
              <Settings className="size-4 text-primary" />
              <span>Settings</span>
            </Link>
          </div>

          <div className="my-1.5 h-px bg-border/60" />

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
            role="menuitem"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
