"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq-otp",
    question: "How does the 4-digit recipient delivery OTP verification work?",
    answer:
      "When your parcel reaches the 'Out for Delivery' stage, our automated system generates a secure 4-digit OTP sent via SMS to the recipient's phone number. The courier cannot complete or hand over the parcel until the recipient verifies this code, eliminating false delivery claims and misplaced packages.",
  },
  {
    id: "faq-cutoff",
    question: "What is the daily cutoff time for guaranteed next-day dispatch?",
    answer:
      "Our daily intake cutoff across all 64 district hubs is 18:00 (6:00 PM). Consignments handed over at our counters or collected by riders before 6:00 PM are sorted that evening and dispatched onto scheduled overnight highway linehauls for next-day morning delivery.",
  },
  {
    id: "faq-cod",
    question: "How are Cash on Delivery (COD) remittances paid out to merchants?",
    answer:
      "Waypoint operates a transparent 1% COD fee with zero hidden surcharges. Once a courier collects cash and enters the OTP handshake, the amount is automatically remitted to your bank account via BEFTN or directly to bKash / Nagad merchant wallets on the next business day.",
  },
  {
    id: "faq-insurance",
    question: "What transit insurance is included with standard parcel bookings?",
    answer:
      "Every standard consignment booked through Waypoint includes complimentary transit insurance coverage up to ৳5,000 against damage or total loss. For high-value electronics and corporate shipments, merchants can declare values up to ৳200,000 with a minimal 0.5% premium.",
  },
  {
    id: "faq-prohibited",
    question: "What items are prohibited from being shipped through Waypoint?",
    answer:
      "In accordance with Bangladesh postal and transport regulations, we do not transport hazardous flammables, illegal narcotics, unregistered weapons/ammunition, currency notes/coins, and unsealed perishable biological specimens.",
  },
  {
    id: "faq-telemetry",
    question: "How does live node-to-node telemetry differ from typical courier updates?",
    answer:
      "Traditional couriers only update statuses twice (pickup and delivery). Waypoint operates barcoded node-to-node scans at physical intake, hub conveyor sorting, linehaul trailer seal verification, destination gateway arrival, and rider pouch custody, providing true real-time visibility.",
  },
];

export function FaqAccordion() {
  const [openId, setOpenId] = React.useState<string | null>("faq-otp");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQS.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div
            key={faq.id}
            className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs transition-colors"
          >
            <button
              type="button"
              onClick={() => toggleItem(faq.id)}
              className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/30 cursor-pointer"
            >
              <span className="text-sm font-bold text-foreground pr-4 flex items-center gap-2">
                <HelpCircle className="size-4 text-primary shrink-0 hidden sm:block" />
                <span>{faq.question}</span>
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180 text-primary"
                )}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 animate-in fade-in-50 duration-150">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
