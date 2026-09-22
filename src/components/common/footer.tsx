import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Globe,
  ArrowUpRight,
  Truck,
} from "lucide-react";
import { Logo } from "@/components/common/logo";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Services & Solutions",
    links: [
      { label: "Express Parcel Delivery", href: "/services#express" },
      { label: "Same-Day City Transit", href: "/services#same-day" },
      { label: "Hub-to-Hub Freight", href: "/services#freight" },
      { label: "Cash on Delivery (COD)", href: "/services#cod" },
      { label: "E-Commerce Fulfillment", href: "/services#ecommerce" },
    ],
  },
  {
    title: "Platform & Portals",
    links: [
      { label: "Track Consignment", href: "/tracking" },
      { label: "Customer Portal", href: "/customer" },
      { label: "Courier App", href: "/courier" },
      { label: "Admin Operations", href: "/admin" },
      { label: "Shipping Rate Calculator", href: "/pricing" },
    ],
  },
  {
    title: "Network & Coverage",
    links: [
      { label: "Dhaka Central Gateway", href: "/hubs" },
      { label: "Chittagong Port Terminal", href: "/hubs" },
      { label: "Sylhet Express Hub", href: "/hubs" },
      { label: "Rajshahi Logistics Base", href: "/hubs" },
      { label: "64-District Directory", href: "/hubs" },
    ],
  },
  {
    title: "Company & Trust",
    links: [
      { label: "About Waypoint", href: "/about" },
      { label: "FAQ & Help Center", href: "/faq" },
      { label: "Security & Privacy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-muted/20 text-foreground">
      {/* Top Banner / Mission CTA */}
      <div className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="hidden sm:flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Truck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Reliable Logistics Nationwide Across Bangladesh
              </p>
              <p className="text-xs text-muted-foreground">
                From urban express to deep district hubs with live waypoint tracking.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              <span>Ship with Waypoint</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {/* Brand & Mission Column (Spans 2 columns on desktop) */}
          <div className="space-y-4 sm:col-span-2">
            <Logo variant="full" size="md" showBadge />
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              Next-generation parcel delivery & logistics infrastructure connecting
              merchants, couriers, and enterprise supply chains with end-to-end waypoint tracking.
            </p>

            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All 64 District Hubs Operational</span>
            </div>

            {/* Quick Helpline & Direct Coordinates */}
            <div className="pt-2 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-primary" />
                <span>24/7 Helpline: 09612-WAYPOINT (+880-9612-929764)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-primary" />
                <span>support@waypoint.com.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>{link.label}</span>
                      {link.external && (
                        <ArrowUpRight className="ml-1 size-3 opacity-60 group-hover:opacity-100" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} Waypoint Technologies Ltd.</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>TLS 256-bit Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="size-3.5 text-primary" />
              <span>Bangladesh (BDT)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
