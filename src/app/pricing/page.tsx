import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building,
  HelpCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { RateCalculator } from "./calculator";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Transparent Logistics Pricing & Rate Calculator — Waypoint",
  description:
    "Calculate instant shipping rates across all 64 districts in Bangladesh. View transparent merchant pricing tiers with zero hidden surcharges and next-day COD settlement.",
};

const tiers = [
  {
    name: "Starter / Individual",
    badge: "Pay As You Go",
    price: "৳60",
    unit: "/ intra-city parcel",
    description: "Ideal for social commerce, boutique creators, and occasional parcel shippers.",
    features: [
      "৳60 intra-city (up to 1kg)",
      "৳110 inter-district (up to 1kg)",
      "Real-time SMS & web tracking",
      "1% COD collection charge",
      "Weekly automated bank/MFS payout",
      "Standard email & helpline support",
    ],
    ctaText: "Start Shipping",
    ctaHref: "/register",
    featured: false,
  },
  {
    name: "Growth Merchant",
    badge: "Most Popular",
    price: "৳50",
    unit: "/ intra-city parcel",
    description: "Engineered for active e-commerce merchants shipping 100+ parcels every month.",
    features: [
      "Discounted ৳50 intra-city base rate",
      "৳95 inter-district base rate",
      "Next-business-day automated COD payout",
      "Direct REST API & Shopify/WooCommerce integration",
      "Priority customer service & account manager",
      "Free doorstep package pickup daily",
      "Complimentary transit insurance up to ৳10,000",
    ],
    ctaText: "Create Merchant Account",
    ctaHref: "/register?role=MERCHANT",
    featured: true,
  },
  {
    name: "Enterprise Linehaul",
    badge: "High Volume",
    price: "Custom",
    unit: "contracted SLA",
    description: "Tailored logistics infrastructure for national retail brands and distributors.",
    features: [
      "Contracted bulk volume linehaul rates",
      "Dedicated sorting lanes at regional hubs",
      "Real-time Webhook telemetry & ERP sync",
      "Custom COD settlement terms & credit facility",
      "Dedicated logistics director & on-site staff",
      "Zero return surcharge on verified exchanges",
    ],
    ctaText: "Contact Enterprise Team",
    ctaHref: "/contact?type=enterprise",
    featured: false,
  },
];

const surcharges = [
  { service: "Additional Weight (Intra-city)", cost: "৳15 per additional kg", note: "Above initial 1kg base tier" },
  { service: "Additional Weight (Inter-district)", cost: "৳25 per additional kg", note: "Above initial 1kg base tier" },
  { service: "Cash on Delivery (COD) Fee", cost: "1% of collected amount", note: "Minimum ৳10 per consignment" },
  { service: "Doorstep Size/Item Exchange", cost: "৳50 flat (Intra-city)", note: "Simultaneous return and new delivery" },
  { service: "Fragile Glassware / Liquid Packing", cost: "৳30 per parcel", note: "Double-bubble thermal wrap + label" },
  { service: "Insurance for High-Value Consignment", cost: "0.5% of declared value", note: "Covers items valued ৳10,000 to ৳100,000" },
];

const faqs = [
  {
    question: "When are Cash on Delivery (COD) earnings disbursed to merchants?",
    answer:
      "For Starter accounts, disbursements are executed weekly every Monday. For Growth Merchant and Enterprise partners, settlements are remitted automatically the next business day directly via BEFTN bank transfer or MFS (bKash/Nagad) accounts.",
  },
  {
    question: "Are there any hidden fuel or sorting surcharges?",
    answer:
      "None. Waypoint prices are 100% transparent. What you see on the rate calculator is what you pay. Fuel adjustments, highway tolls, and sorting hub handling are already included in the base fare.",
  },
  {
    question: "What happens if a recipient refuses or is unavailable for delivery?",
    answer:
      "Our couriers make up to 3 verified delivery attempts with SMS alerts and recipient phone confirmations. If the parcel cannot be delivered, it is routed safely back to your registered merchant address.",
  },
  {
    question: "How do I qualify for the Growth Merchant rate tier?",
    answer:
      "Merchants shipping over 100 packages per month qualify for Growth tier pricing. Once your account crosses the milestone or upon presenting existing courier volume proof during onboarding, the discounted rate card is activated immediately.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.25)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Transparent & Predictable Rates</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Fair Pricing for{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Every Parcel & Business
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              No hidden linehaul fees, no surprise sorting charges. Calculate precise fares across
              all 64 districts in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Shipping Rate Calculator */}
      <section className="py-12 sm:py-16 -mt-8 sm:-mt-12 relative z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <RateCalculator />
        </div>
      </section>

      {/* Pricing Plan Tiers */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="border-primary/20 text-primary">
              Merchant Tiers
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Choose the Plan That Fits Your Volume
            </h2>
            <p className="text-sm text-muted-foreground">
              From solo boutique creators to high-velocity nationwide brands, Waypoint scales with your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "relative flex flex-col justify-between rounded-3xl border p-8 shadow-xs transition-all backdrop-blur-xs",
                  tier.featured
                    ? "border-primary bg-card/90 shadow-xl ring-2 ring-primary/30"
                    : "border-border/80 bg-card/60 hover:border-primary/40"
                )}
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold text-primary-foreground shadow-sm">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">
                      {tier.price}
                    </span>
                    <span className="text-xs text-muted-foreground">{tier.unit}</span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-border/60 text-xs text-muted-foreground">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={tier.ctaHref}
                    className={cn(
                      buttonVariants({
                        variant: tier.featured ? "default" : "outline",
                        size: "default",
                      }),
                      "w-full rounded-xl font-semibold shadow-xs gap-1.5"
                    )}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Surcharges & Ancillary Table */}
      <section className="py-16 sm:py-20 bg-muted/20 border-y border-border/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Value-Add Services & Surcharges
            </h2>
            <p className="text-sm text-muted-foreground">
              Clear breakdown of optional packaging, exchange, and special handling fees.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card/80 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-muted/50 text-foreground font-semibold">
                <tr>
                  <th className="p-4 sm:p-5">Service / Add-on</th>
                  <th className="p-4 sm:p-5">Rate (BDT)</th>
                  <th className="p-4 sm:p-5">Applicable Terms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                {surcharges.map((s, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">{s.service}</td>
                    <td className="p-4 sm:p-5 font-mono text-primary font-medium">{s.cost}</td>
                    <td className="p-4 sm:p-5">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="border-primary/20 text-primary">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Questions About Billing & Rates
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about settlements, charges, and payment cycles.
            </p>
          </div>

          <Accordion type="single" defaultValue="faq-0">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
