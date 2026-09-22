import type { Metadata } from "next";
import Link from "next/link";
import {
  Truck,
  Zap,
  Clock,
  ShieldCheck,
  RotateCcw,
  Boxes,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building2,
  PhoneCall,
  BadgeCheck,
  Layers,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Logistics Services & Delivery Solutions — Waypoint",
  description:
    "Explore Waypoint's comprehensive parcel delivery services across Bangladesh: Express 24h, Same-Day City transit, Nationwide freight linehaul, and automated COD remittance.",
};

interface ServiceItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  sla: string;
  idealFor: string;
  icon: typeof Truck;
  features: string[];
  pricingHint: string;
}

const servicesList: ServiceItem[] = [
  {
    id: "express",
    badge: "Most Popular",
    title: "Express Parcel Delivery",
    subtitle: "Next-Day Nationwide Guarantee",
    description:
      "Guaranteed 12 to 24-hour parcel delivery across all major divisional hubs and district centers. Fully barcoded node-to-node scanning ensures zero blind spots during transit.",
    sla: "12 - 24 Hours",
    idealFor: "E-commerce sellers, high-priority retail, consumer electronics",
    icon: Zap,
    features: [
      "Real-time SMS alerts at every waypoint scan",
      "Automated route optimization for couriers",
      "Guaranteed next-day delivery across divisional centers",
      "Free transit insurance up to ৳5,000",
    ],
    pricingHint: "From ৳60 intra-city / ৳110 inter-city",
  },
  {
    id: "same-day",
    badge: "Ultra Fast",
    title: "Same-Day City Transit",
    subtitle: "Within-Metro Rush Deliveries",
    description:
      "On-demand intra-city rush delivery dispatched within 60 minutes of booking. Designed for urgent documents, perishable goods, and flash retail orders.",
    sla: "4 - 8 Hours",
    idealFor:
      "Corporate documents, boutique fashion, pharmaceuticals, urgent gifts",
    icon: Clock,
    features: [
      "Priority rider dispatch directly from merchant location",
      "Direct point-to-point courier routing without central hub holding",
      "Live courier GPS coordinates & direct calling",
      "OTP-verified recipient drop-off confirmation",
    ],
    pricingHint: "From ৳120 flat in Dhaka / Chittagong",
  },
  {
    id: "freight",
    badge: "Heavy Cargo",
    title: "Hub-to-Hub Linehaul Freight",
    subtitle: "Bulk Cargo & B2B Distribution",
    description:
      "Heavy freight logistics moving bulk consignments across Waypoint's inter-district highway fleet. Containerized and weather-sealed transit connecting all 8 divisions.",
    sla: "24 - 48 Hours",
    idealFor:
      "Wholesalers, manufacturing suppliers, raw materials, pallet shipments",
    icon: Truck,
    features: [
      "Dedicated truckload (FTL) and less-than-truckload (LTL) options",
      "Specialized pallet & heavy-lift cargo handling",
      "Direct scheduled dispatch between central regional hubs",
      "Volume discount tiers starting at 50kg",
    ],
    pricingHint: "Custom contracted rates per ton / pallet",
  },
  {
    id: "cod",
    badge: "Automated Remittance",
    title: "Cash on Delivery (COD) & Settlement",
    subtitle: "Frictionless Payment Reconciliation",
    description:
      "Bangladesh's most dependable Cash on Delivery infrastructure. Secure rider cash collection backed by next-business-day automated payouts via BEFTN, bKash, or Nagad.",
    sla: "Next-Day Payout",
    idealFor: "F-Commerce merchants, online marketplaces, catalog retailers",
    icon: ShieldCheck,
    features: [
      "Transparent 1% COD fee with zero hidden surcharges",
      "Daily automated bank & MFS disbursement batches",
      "Digital OTP handshake to verify cash collection",
      "Live remittance dashboard with exportable tax invoices",
    ],
    pricingHint: "1% COD charge on collected value",
  },
  {
    id: "ecommerce",
    badge: "End-to-End Fulfillment",
    title: "E-Commerce Warehousing & Pick-Pack",
    subtitle: "Scalable Micro-Hub Storage",
    description:
      "Offload fulfillment hassles. Store your high-demand SKUs across our strategically located micro-hubs in Dhaka, Chittagong, and Sylhet for lightning-fast dispatch.",
    sla: "Instant Fulfillment",
    idealFor:
      "Rapidly growing D2C brands, seasonal promotions, multichannel sellers",
    icon: Boxes,
    features: [
      "Shared or dedicated climate-controlled micro-storage",
      "Professional barcode labeling, packaging, and custom unboxing cards",
      "Automated stock level tracking via REST API / Shopify / WooCommerce",
      "Cutoff dispatch extended to 9:00 PM for next-morning delivery",
    ],
    pricingHint: "Tiered per-order fulfillment fee",
  },
  {
    id: "reverse",
    badge: "Merchant Friendly",
    title: "Reverse Logistics & Exchange",
    subtitle: "Effortless Returns & Size Swaps",
    description:
      "Turn customer returns into loyalty. Our couriers pick up returns and perform simultaneous product exchanges at the customer's doorstep with digital inspection.",
    sla: "24 - 48 Hours",
    idealFor: "Apparel, footwear, electronics, warranty replacements",
    icon: RotateCcw,
    features: [
      "Doorstep return inspection against item condition checklist",
      "Simultaneous delivery-and-pickup swap in a single rider trip",
      "Automated return tracking linked to original order ID",
      "Reduced reverse handling rates for contracted merchants",
    ],
    pricingHint: "50% off return leg for exchanges",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Digital Booking & Manifest",
    desc: "Create single or bulk waypoints via our Merchant Portal or REST API. Instant QR labels and tracking IDs generated.",
  },
  {
    step: "02",
    title: "First-Mile Pickup",
    desc: "Assigned courier arrives at your warehouse or doorstep with mobile handheld scanner. Consignment enters active transit.",
  },
  {
    step: "03",
    title: "Automated Hub Sorting",
    desc: "High-speed barcode routing at central distribution facilities categorizes parcels by division and destination postal node.",
  },
  {
    step: "04",
    title: "Linehaul Highway Transit",
    desc: "Containerized fleet transports packages overnight between divisional gateways with GPS geofencing monitoring.",
  },
  {
    step: "05",
    title: "Last-Mile Delivery & Verification",
    desc: "Local neighborhood courier completes drop-off, collects COD if applicable, and secures delivery confirmation via recipient OTP.",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Full-Stack Logistics Infrastructure</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Built to Power Commerce{" "}
              <span className="bg-linear-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Across All 64 Districts
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              From individual retail consignments to full-truckload
              inter-district freight, Waypoint offers precision-timed delivery
              services powered by live waypoint node tracking and next-day
              automated settlement.
            </p>

            {/* Anchor jump links */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {servicesList.map((service) => (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className="rounded-full border border-border/80 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card transition-all"
                >
                  {service.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Comprehensive Delivery Architecture
            </h2>
            <p className="text-sm text-muted-foreground">
              Modular logistics solutions designed for e-commerce brands,
              corporate enterprises, and courier partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {servicesList.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-primary/40 transition-all backdrop-blur-xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <Icon className="size-6" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-primary/20 bg-primary/5 text-primary text-[11px]"
                      >
                        {service.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground">
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Delivery SLA:
                        </span>
                        <span className="font-semibold text-primary">
                          {service.sla}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Best For:{" "}
                        </span>
                        <span>{service.idealFor}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {service.pricingHint}
                    </span>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Calculate</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SLA & Service Level Matrix Table */}
      <section className="py-16 sm:py-20 bg-muted/20 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-primary border-primary/20">
              Guaranteed SLAs
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Performance Standards & Guarantees
            </h2>
            <p className="text-sm text-muted-foreground">
              Every shipment is backed by our strict transit service level
              agreements across all zones.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card/80 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-muted/50 text-foreground font-semibold">
                <tr>
                  <th className="p-4 sm:p-5">Service Tier</th>
                  <th className="p-4 sm:p-5">Transit Scope</th>
                  <th className="p-4 sm:p-5">Standard SLA</th>
                  <th className="p-4 sm:p-5">Scan Fidelity</th>
                  <th className="p-4 sm:p-5">Included Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-foreground">
                    Express Parcel
                  </td>
                  <td className="p-4 sm:p-5">Inter-District Hubs</td>
                  <td className="p-4 sm:p-5 text-primary font-medium">
                    12 - 24 Hours
                  </td>
                  <td className="p-4 sm:p-5">Every Hub + Courier Transit</td>
                  <td className="p-4 sm:p-5">Up to ৳5,000</td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-foreground">
                    Same-Day City
                  </td>
                  <td className="p-4 sm:p-5">Intra-Metro (Dhaka/Ctg)</td>
                  <td className="p-4 sm:p-5 text-primary font-medium">
                    4 - 8 Hours
                  </td>
                  <td className="p-4 sm:p-5">Live GPS Rider Coordinates</td>
                  <td className="p-4 sm:p-5">Up to ৳10,000</td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-foreground">
                    Linehaul Freight
                  </td>
                  <td className="p-4 sm:p-5">Division-to-Division</td>
                  <td className="p-4 sm:p-5 text-primary font-medium">
                    24 - 48 Hours
                  </td>
                  <td className="p-4 sm:p-5">Containerized Fleet Geofencing</td>
                  <td className="p-4 sm:p-5">
                    Full Consignment Declared Value
                  </td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-foreground">
                    E-Commerce Warehousing
                  </td>
                  <td className="p-4 sm:p-5">Micro-Hub Storage</td>
                  <td className="p-4 sm:p-5 text-primary font-medium">
                    Same-Day Pick/Pack
                  </td>
                  <td className="p-4 sm:p-5">Item-Level SKU Barcodes</td>
                  <td className="p-4 sm:p-5">
                    Warehouse Fire & Theft Protection
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              The 5-Stage Waypoint Journey
            </h2>
            <p className="text-sm text-muted-foreground">
              How our automated logistics pipeline moves consignments from
              booking to front door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((item, index) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-border/70 bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-primary/40 font-mono">
                      {item.step}
                    </span>
                    <BadgeCheck className="size-4 text-emerald-500" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="py-16 sm:py-20 bg-linear-to-r from-primary/10 via-primary/5 to-cyan-500/10 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl border border-primary/20 bg-card/80 p-8 sm:p-12 shadow-lg backdrop-blur-md">
            <div className="space-y-3 text-center md:text-left max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Ready to Upgrade Your Logistics Infrastructure?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect your online store in minutes or speak directly with our
                corporate team for customized linehaul fleet contracts across
                Bangladesh.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "rounded-xl shadow-md font-semibold gap-2",
                )}
              >
                <span>Open Merchant Account</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl font-medium",
                )}
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
