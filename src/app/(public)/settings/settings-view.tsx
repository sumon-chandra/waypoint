"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Laptop,
  Check,
  Bell,
  Globe,
  Shield,
  User,
  Sliders,
  Sparkles,
  Download,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  Package,
} from "lucide-react";
import { useTheme, type Theme } from "@/features/theme/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SettingsView() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { user } = useAuth();

  const [mounted, setMounted] = React.useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = React.useState({
    smsTracking: true,
    emailReceipts: true,
    browserPush: false,
    whatsappUpdates: true,
    marketingUpdates: false,
  });

  // Regional Preferences State
  const [regional, setRegional] = React.useState({
    language: "en",
    currency: "BDT",
    timezone: "Asia/Dhaka",
    defaultHub: "HUB-DAC-01",
  });

  React.useEffect(() => {
    setMounted(true);
    try {
      const savedNotifs = localStorage.getItem("waypoint-notif-prefs");
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      const savedRegional = localStorage.getItem("waypoint-regional-prefs");
      if (savedRegional) setRegional(JSON.parse(savedRegional));
    } catch {
      // Storage unavailable
    }
  }, []);

  const handleSaveAll = () => {
    try {
      localStorage.setItem("waypoint-notif-prefs", JSON.stringify(notifications));
      localStorage.setItem("waypoint-regional-prefs", JSON.stringify(regional));
      toast.success("Preferences Saved Successfully", {
        description: "Your appearance, notification, and regional settings have been updated.",
      });
    } catch {
      toast.error("Could not save settings to local storage.");
    }
  };

  const handleResetDefaults = () => {
    setTheme("system");
    setNotifications({
      smsTracking: true,
      emailReceipts: true,
      browserPush: false,
      whatsappUpdates: true,
      marketingUpdates: false,
    });
    setRegional({
      language: "en",
      currency: "BDT",
      timezone: "Asia/Dhaka",
      defaultHub: "HUB-DAC-01",
    });
    toast.info("Settings Reset to Defaults");
  };

  return (
    <div className="space-y-10">
      {/* 1. Appearance & Theme Selection (Primary Section) */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <span>Appearance & Color Theme</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Customize how Waypoint looks on your device. Choose between light, dark, or automatic system sync.
            </p>
          </div>
          <Badge variant="outline" className="text-xs text-primary border-primary/20 shrink-0 self-start sm:self-auto">
            Active: {mounted ? (theme === "system" ? `System (${resolvedTheme})` : theme) : "Loading..."}
          </Badge>
        </div>

        {/* Theme Options Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={cn(
              "group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all cursor-pointer",
              theme === "light"
                ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-sm"
                : "border-border/80 bg-background/60 hover:border-primary/40 hover:bg-card"
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Sun className="size-5" />
                </div>
                {theme === "light" && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Light Mode</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Crisp, high-contrast daylight theme optimized for bright environments.
                </p>
              </div>
            </div>

            {/* Visual preview strip */}
            <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-2xs space-y-1.5">
              <div className="h-2 w-16 rounded-full bg-neutral-800" />
              <div className="h-1.5 w-24 rounded-full bg-neutral-300" />
              <div className="flex gap-1 pt-1">
                <div className="h-3 w-8 rounded-md bg-indigo-600" />
                <div className="h-3 w-6 rounded-md bg-neutral-200" />
              </div>
            </div>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={cn(
              "group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all cursor-pointer",
              theme === "dark"
                ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-sm"
                : "border-border/80 bg-background/60 hover:border-primary/40 hover:bg-card"
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Moon className="size-5" />
                </div>
                {theme === "dark" && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Dark Mode</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Deep obsidian & slate tones with subtle glow for low-light comfort.
                </p>
              </div>
            </div>

            {/* Visual preview strip */}
            <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 shadow-2xs space-y-1.5">
              <div className="h-2 w-16 rounded-full bg-neutral-100" />
              <div className="h-1.5 w-24 rounded-full bg-neutral-700" />
              <div className="flex gap-1 pt-1">
                <div className="h-3 w-8 rounded-md bg-indigo-500" />
                <div className="h-3 w-6 rounded-md bg-neutral-800" />
              </div>
            </div>
          </button>

          {/* System Default Card */}
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={cn(
              "group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all cursor-pointer",
              theme === "system"
                ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-sm"
                : "border-border/80 bg-background/60 hover:border-primary/40 hover:bg-card"
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Laptop className="size-5" />
                </div>
                {theme === "system" && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">System Default</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automatically synchronize with your operating system day/night schedule.
                </p>
              </div>
            </div>

            {/* Visual preview split */}
            <div className="mt-4 flex rounded-xl border border-border/80 overflow-hidden h-[46px]">
              <div className="w-1/2 bg-white p-2 space-y-1">
                <div className="h-1.5 w-8 rounded-full bg-neutral-800" />
                <div className="h-2.5 w-6 rounded bg-indigo-600" />
              </div>
              <div className="w-1/2 bg-neutral-950 p-2 space-y-1">
                <div className="h-1.5 w-8 rounded-full bg-neutral-100" />
                <div className="h-2.5 w-6 rounded bg-indigo-500" />
              </div>
            </div>
          </button>
        </div>

        {/* Live Interface Preview Box */}
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sliders className="size-3.5 text-primary" />
              <span>Live Theme UI Demonstration</span>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              Applied Token Scheme: {resolvedTheme}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card p-3 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">Consignment Card</span>
                <Badge variant="default" className="text-[9px] px-1.5 py-0">
                  IN_TRANSIT
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">WP-DAC-98214</p>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary rounded-full" />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-3 shadow-2xs space-y-2 flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-foreground">Button Tokens</span>
              <div className="flex gap-1.5">
                <Button size="xs" className="h-6 text-[10px]">
                  Primary
                </Button>
                <Button size="xs" variant="outline" className="h-6 text-[10px]">
                  Outline
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-3 shadow-2xs space-y-1.5 flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-foreground">Status Badges</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="success" className="text-[9px] px-1.5 py-0">
                  Delivered
                </Badge>
                <Badge variant="warning" className="text-[9px] px-1.5 py-0">
                  Out for Delivery
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Notification Preferences */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-border/60">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            <span>Notification & Alert Channels</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure how and when you receive parcel scan updates, rider dispatches, and COD payouts.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-border/60 text-xs">
          <div className="flex items-center justify-between pt-3 first:pt-0">
            <div>
              <p className="font-semibold text-foreground">SMS Tracking Alerts</p>
              <p className="text-muted-foreground">
                Receive instant SMS notifications on parcel pickup, hub departure, and OTP codes.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.smsTracking}
              onChange={(e) =>
                setNotifications({ ...notifications, smsTracking: e.target.checked })
              }
              className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-foreground">Email Consignment Summaries & Invoices</p>
              <p className="text-muted-foreground">
                Daily automated digest of delivered consignments and tax-compliant COD receipts.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailReceipts}
              onChange={(e) =>
                setNotifications({ ...notifications, emailReceipts: e.target.checked })
              }
              className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-foreground">WhatsApp Delivery Updates</p>
              <p className="text-muted-foreground">
                Receive interactive parcel status links and rider coordinates on WhatsApp.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.whatsappUpdates}
              onChange={(e) =>
                setNotifications({ ...notifications, whatsappUpdates: e.target.checked })
              }
              className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-foreground">Web Push Notifications</p>
              <p className="text-muted-foreground">
                Receive urgent desktop and mobile browser notifications during active linehaul dispatches.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.browserPush}
              onChange={(e) =>
                setNotifications({ ...notifications, browserPush: e.target.checked })
              }
              className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </div>
        </div>
      </section>

      {/* 3. Regional & Localization Settings */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-border/60">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Globe className="size-5 text-primary" />
            <span>Regional & Localization</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Default operational parameters for your shipments and regional hub allocations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Platform Language</label>
            <select
              value={regional.language}
              onChange={(e) => setRegional({ ...regional, language: e.target.value })}
              className="h-10 w-full rounded-xl border border-input bg-background/80 px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="en">English (US)</option>
              <option value="bn">Bengali (বাংলা)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Billing Currency</label>
            <select
              value={regional.currency}
              onChange={(e) => setRegional({ ...regional, currency: e.target.value })}
              className="h-10 w-full rounded-xl border border-input bg-background/80 px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="BDT">BDT (Bangladeshi Taka - ৳)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Timezone</label>
            <Input
              disabled
              value="Asia/Dhaka (GMT+6)"
              className="text-xs font-mono bg-muted/40 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Preferred Origin Hub</label>
            <select
              value={regional.defaultHub}
              onChange={(e) => setRegional({ ...regional, defaultHub: e.target.value })}
              className="h-10 w-full rounded-xl border border-input bg-background/80 px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="HUB-DAC-01">Dhaka Central Gateway (Tejgaon)</option>
              <option value="HUB-DAC-02">Gazipur Industrial Node</option>
              <option value="HUB-CTG-01">Chittagong Port Terminal (Agrabad)</option>
              <option value="HUB-SYL-01">Sylhet Express Hub (Zindabazar)</option>
              <option value="HUB-RAJ-01">Rajshahi Logistics Base</option>
              <option value="HUB-KHU-01">Khulna Divisional Hub</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. Security & Account Overview */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <span>Account & Security</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your personal credentials, session tokens, and security profile.
            </p>
          </div>
          <Link
            href="/profile"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-xl text-xs gap-1.5 font-medium"
            )}
          >
            <User className="size-3.5 text-primary" />
            <span>Edit Profile</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Session Security</span>
              <Badge variant="success" className="text-[10px]">
                HTTP-Only Cookies Active
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Tokens are stored securely in encrypted HTTP-only cookies to protect against script injection.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Two-Factor Authentication (2FA)</span>
              <Badge variant="outline" className="text-[10px]">
                SMS OTP Enabled
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Withdrawals and COD payout modifications require mobile OTP verification.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleResetDefaults}
          className="rounded-xl text-xs gap-1.5 cursor-pointer w-full sm:w-auto"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset All to Defaults</span>
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            onClick={handleSaveAll}
            className="rounded-xl text-xs font-semibold gap-1.5 shadow-md cursor-pointer w-full sm:w-auto"
          >
            <Save className="size-3.5" />
            <span>Save All Preferences</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
