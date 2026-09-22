"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  HelpCircle,
  Package,
  CreditCard,
  Building,
  ShieldAlert,
  Truck,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  category: "shipping" | "pricing" | "merchants" | "prohibited" | "couriers";
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  // Shipping & Tracking
  {
    id: "s1",
    category: "shipping",
    question: "How does Waypoint's node-to-node tracking work?",
    answer:
      "Every consignment receives an encrypted digital barcode manifest. As it passes through each checkpoint—first-mile rider collection, regional sorting hub barcode gates, highway linehaul trucks, and neighborhood dispatch riders—the waypoint status updates in real-time on our web portal and triggers recipient SMS alerts.",
  },
  {
    id: "s2",
    category: "shipping",
    question: "What are your delivery hours and standard delivery turnaround?",
    answer:
      "Standard delivery hours are 9:00 AM to 8:00 PM, Saturday through Thursday (with emergency express riders operating Friday). Intra-city parcels are delivered within 12 to 24 hours, while inter-district deliveries reach any district center within 24 to 48 hours.",
  },
  {
    id: "s3",
    category: "shipping",
    question: "Can I alter the delivery address or contact number after booking?",
    answer:
      "Yes. Merchants and senders can update the recipient phone number or delivery address through their dashboard or by calling the 24/7 helpline (09612-WAYPOINT) as long as the parcel has not left the destination distribution hub for last-mile rider handover.",
  },
  {
    id: "s4",
    category: "shipping",
    question: "How many delivery attempts does Waypoint make?",
    answer:
      "Our riders make up to 3 verified delivery attempts on consecutive days. Before marking any consignment as failed or returning to the sender, the courier and our operations team must attempt direct phone contact with the recipient.",
  },

  // Pricing & Payments
  {
    id: "p1",
    category: "pricing",
    question: "How is the Cash on Delivery (COD) charge calculated?",
    answer:
      "Waypoint charges a transparent 1% COD handling fee on the total cash collected from the recipient (minimum ৳10 per consignment). There are no hidden banking, transaction, or gateway fees deducted.",
  },
  {
    id: "p2",
    category: "pricing",
    question: "When and how are merchant funds disbursed?",
    answer:
      "Starter accounts receive weekly disbursements on Mondays. Growth and Enterprise merchants benefit from next-business-day automated disbursements directly via BEFTN bank transfer or digital mobile financial services (bKash / Nagad).",
  },
  {
    id: "p3",
    category: "pricing",
    question: "Are there additional charges for overweight or bulky items?",
    answer:
      "Yes. Our base rates cover items up to 1.0 kg. Parcels exceeding 1kg incur ৳15 per additional kg for intra-city transit and ৳25 per additional kg for inter-district consignments. Volumetric weight is calculated using (L × W × H in cm) / 5000.",
  },

  // Merchants & Integrations
  {
    id: "m1",
    category: "merchants",
    question: "Do you have ready plugins for Shopify and WooCommerce?",
    answer:
      "Yes. We offer turnkey plugins for Shopify, WooCommerce, and custom PHP/Node.js web applications. Orders placed on your store can automatically generate Waypoint tracking waypoints and print shipping thermal labels with a single click.",
  },
  {
    id: "m2",
    category: "merchants",
    question: "How do I generate bulk consignment manifests?",
    answer:
      "Within the Merchant Portal, you can upload a CSV / Excel file containing hundreds of consignments simultaneously or use our batch API endpoint `/api/v1/shipments/batch` to create up to 500 waypoints in one call.",
  },
  {
    id: "m3",
    category: "merchants",
    question: "Can I customize the branded SMS notifications sent to my customers?",
    answer:
      "Growth and Enterprise tier merchants can configure custom sender maskings and personalized SMS templates including their brand name and direct tracking URL.",
  },

  // Prohibited Items
  {
    id: "pr1",
    category: "prohibited",
    question: "What items are strictly prohibited from carriage?",
    answer:
      "In accordance with Bangladesh Postal Act and safety laws, Waypoint strictly bans: firearms and ammunition, narcotics and illegal substances, flammable liquids and raw explosives, live animals, unpreserved human remains, currency notes, and counterfeit currency.",
  },
  {
    id: "pr2",
    category: "prohibited",
    question: "Can I ship fragile items such as perfumes, glassware, or cosmetics?",
    answer:
      "Yes, provided they are declared during booking and packaged using our approved bubble-wrap standard. Senders must apply a 'Fragile Care' tag (available for ৳30) which ensures dedicated handling and prevents stacking in highway linehaul containers.",
  },

  // Courier Partners
  {
    id: "c1",
    category: "couriers",
    question: "How do I register as a courier partner or delivery rider?",
    answer:
      "Apply through our Courier Portal or visit your nearest regional hub. You will need a valid National ID card (NID), an active Android smartphone, and either a bicycle, motorcycle, or electric trike with valid registration.",
  },
  {
    id: "c2",
    category: "couriers",
    question: "How often do courier partners receive their delivery earnings?",
    answer:
      "Courier earnings, trip bonuses, and fuel allowances are paid weekly on Tuesdays directly into the rider's personal bKash or Nagad wallet with transparent real-time trip logs.",
  },
];

const categories = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "shipping", label: "Shipping & Tracking", icon: Package },
  { id: "pricing", label: "Pricing & Settlements", icon: CreditCard },
  { id: "merchants", label: "Merchants & APIs", icon: Building },
  { id: "prohibited", label: "Prohibited Cargo", icon: ShieldAlert },
  { id: "couriers", label: "Courier Partners", icon: Truck },
];

export function FAQClient() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredFAQs = React.useMemo(() => {
    return faqData.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative mx-auto max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-3.5 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search questions (e.g. COD settlement, tracking, prohibited)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 pl-11 pr-4 text-xs rounded-2xl bg-card/80 shadow-xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all shrink-0 cursor-pointer",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/60 pb-3">
        <span>
          Showing <strong>{filteredFAQs.length}</strong> matching questions
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-primary hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* FAQ Accordion */}
      {filteredFAQs.length > 0 ? (
        <Accordion type="single" defaultValue={filteredFAQs[0]?.id}>
          {filteredFAQs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
          <HelpCircle className="size-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No questions found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            We couldn&apos;t find an answer matching &quot;{searchQuery}&quot;. Please contact our 24/7
            helpline directly.
          </p>
        </div>
      )}

      {/* Direct Help Card */}
      <div className="rounded-3xl border border-primary/20 bg-card p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-foreground">Still have questions?</h3>
          <p className="text-xs text-muted-foreground">
            Our customer dispatch and operations team is available 24/7 to help you.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="tel:09612929764"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-xl text-xs gap-1.5 font-medium"
            )}
          >
            <Phone className="size-3.5 text-primary" />
            <span>09612-WAYPOINT</span>
          </a>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "rounded-xl text-xs gap-1.5 font-semibold shadow-xs"
            )}
          >
            <span>Contact Support</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
