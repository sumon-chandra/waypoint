import type { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Building,
  Headphones,
  Truck,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact & 24/7 Operations Support — Waypoint",
  description:
    "Get in touch with Waypoint Logistics. 24/7 parcel dispatch hotline, merchant onboarding support, and physical offices in Dhaka, Chittagong, and Sylhet.",
};

const supportChannels = [
  {
    title: "24/7 Customer Dispatch Hotline",
    desc: "For urgent delivery queries, address alterations, or rider tracking.",
    detail: "09612-WAYPOINT (+880-9612-929764)",
    action: "tel:09612929764",
    icon: Phone,
    badge: "Available 24/7",
  },
  {
    title: "Merchant Accounts & Partnerships",
    desc: "API integration support, rate inquiries, and high-volume merchant onboarding.",
    detail: "merchants@waypoint.com.bd",
    action: "mailto:merchants@waypoint.com.bd",
    icon: Mail,
    badge: "Business Team",
  },
  {
    title: "Courier Partner Operations",
    desc: "Rider onboarding, vehicle inspections, and route assignment support.",
    detail: "couriers@waypoint.com.bd",
    action: "mailto:couriers@waypoint.com.bd",
    icon: Truck,
    badge: "Fleet Desk",
  },
  {
    title: "Corporate & Linehaul Freight",
    desc: "Full truckload contracts, inter-district B2B cargo distribution.",
    detail: "corporate@waypoint.com.bd",
    action: "mailto:corporate@waypoint.com.bd",
    icon: Building2,
    badge: "Enterprise",
  },
];

const offices = [
  {
    city: "Dhaka Central Gateway (HQ)",
    address: "Plot 14, Road 113/A, Gulshan-2, Dhaka 1212, Bangladesh",
    hours: "Open 24 Hours (Operations) / 9:00 AM - 6:00 PM (Executive)",
    phone: "+880-2-9881023",
  },
  {
    city: "Chittagong Port Terminal",
    address: "World Trade Center, 4th Floor, Agrabad C/A, Chittagong",
    hours: "8:00 AM - 9:00 PM (Mon - Sat)",
    phone: "+880-31-712891",
  },
  {
    city: "Sylhet Regional Logistics Base",
    address: "Al-Hamra Shopping City, Level 5, Zindabazar, Sylhet",
    hours: "8:30 AM - 8:30 PM (Mon - Sat)",
    phone: "+880-821-729104",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>We Are Here 24 Hours a Day</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Always Connected.{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Always at Your Service.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Whether you need real-time consignment updates, customized
              enterprise freight rates, or technical API assistance, our
              logistics specialists are ready.
            </p>
          </div>
        </div>
      </section>

      {/* Support Channels Grid */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, i) => {
              const Icon = channel.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-xs hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {channel.badge}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {channel.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {channel.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/60">
                    <a
                      href={channel.action}
                      className="text-xs font-semibold text-primary hover:underline truncate block"
                    >
                      {channel.detail}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form & Physical Offices Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Offices & Operations Banner (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs space-y-6">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Building className="size-5 text-primary" />
                  <span>Regional Operations Centers</span>
                </h3>

                <div className="space-y-6">
                  {offices.map((off, idx) => (
                    <div
                      key={idx}
                      className="space-y-1.5 text-xs pb-4 border-b border-border/60 last:border-0 last:pb-0"
                    >
                      <h4 className="font-bold text-foreground">{off.city}</h4>
                      <p className="text-muted-foreground flex items-start gap-1.5">
                        <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{off.address}</span>
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary shrink-0" />
                        <span>{off.hours}</span>
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1.5">
                        <Phone className="size-3.5 text-primary shrink-0" />
                        <span className="font-mono">{off.phone}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Guarantee Card */}
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Live System & Fleet Status: 100% Normal
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All 180+ sorting hubs, overnight highway linehaul vehicles,
                  and mobile courier apps are operating on schedule across all
                  64 districts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
