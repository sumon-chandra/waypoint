"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Truck,
  Banknote,
  Code2,
  Bike,
  ShieldAlert,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Headphones,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight,
  Copy,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  SUPPORT_CATEGORIES,
  SUPPORT_FAQS,
  type SupportCategory,
  type SupportFaqItem,
} from "../data/help-data";
import { cn } from "@/lib/utils";

export function HelpSupportClient() {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [openFaqId, setOpenFaqId] = React.useState<string | null>(
    SUPPORT_FAQS[0]?.id || null
  );

  // Ticket submission states
  const [ticketName, setTicketName] = React.useState("");
  const [ticketEmail, setTicketEmail] = React.useState("");
  const [ticketPhone, setTicketPhone] = React.useState("");
  const [ticketTracking, setTicketTracking] = React.useState("");
  const [ticketCategory, setTicketCategory] = React.useState("delivery-delay");
  const [ticketPriority, setTicketPriority] = React.useState("NORMAL");
  const [ticketMessage, setTicketMessage] = React.useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = React.useState(false);
  const [submittedTicket, setSubmittedTicket] = React.useState<{
    id: string;
    createdAt: string;
  } | null>(null);
  const [ticketError, setTicketError] = React.useState<string | null>(null);

  const getCategoryIcon = (iconName: SupportCategory["iconName"]) => {
    switch (iconName) {
      case "Truck":
        return Truck;
      case "Banknote":
        return Banknote;
      case "Code2":
        return Code2;
      case "Bike":
        return Bike;
      case "ShieldAlert":
        return ShieldAlert;
      case "UserCheck":
        return UserCheck;
      default:
        return HelpCircle;
    }
  };

  // Filtered FAQs
  const filteredFaqs = React.useMemo(() => {
    return SUPPORT_FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.categoryId === selectedCategory;

      if (!matchesCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQ = faq.question.toLowerCase().includes(q);
        const matchesA = faq.answer.toLowerCase().includes(q);
        const matchesTag = faq.tags.some((t) => t.toLowerCase().includes(q));
        return matchesQ || matchesA || matchesTag;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketError(null);

    // Validation
    if (!ticketName.trim() || !ticketEmail.trim() || !ticketPhone.trim() || !ticketMessage.trim()) {
      setTicketError("Please fill out all required fields.");
      return;
    }

    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(ticketPhone.replace(/[\s-]/g, ""))) {
      setTicketError("Please enter a valid 11-digit Bangladeshi phone number (e.g., 01712345678).");
      return;
    }

    setIsSubmittingTicket(true);
    setTimeout(() => {
      const generatedId = `TKT-${new Date().getFullYear()}-${Math.floor(
        10000 + Math.random() * 90000
      )}`;
      setSubmittedTicket({
        id: generatedId,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setIsSubmittingTicket(false);
    }, 800);
  };

  return (
    <div className="space-y-16">
      {/* 1. Search Bar Strip */}
      <section className="relative mx-auto max-w-3xl text-center space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search help topics (e.g. tracking, OTP, COD remittance, API keys)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 pr-4 rounded-3xl bg-card border-border/80 text-sm sm:text-base shadow-lg focus-visible:ring-primary/20"
          />
        </div>

        {searchQuery && (
          <p className="text-xs text-muted-foreground">
            Showing results matching &quot;{searchQuery}&quot; across all support categories.
          </p>
        )}
      </section>

      {/* 2. Support Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Browse Support Categories
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select a domain to filter frequently asked questions below.
            </p>
          </div>

          {selectedCategory !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Reset to All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SUPPORT_CATEGORIES.map((category) => {
            const IconComponent = getCategoryIcon(category.iconName);
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(isSelected ? "all" : category.id)
                }
                className={cn(
                  "group relative flex flex-col text-left p-6 rounded-3xl border transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10 ring-2 ring-primary/20"
                    : "border-border/80 bg-card hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5"
                )}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className={cn(
                      "size-10 rounded-2xl flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    )}
                  >
                    <IconComponent className="size-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {category.articleCount} Articles
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FAQ Breakdown Accordion */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <HelpCircle className="size-3.5" />
            <span>Instant Solutions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Frequently Answered Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Verified step-by-step guidance on domestic shipping and account management.
          </p>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-10 text-center space-y-3">
            <HelpCircle className="size-8 mx-auto text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">No matching FAQ items</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn&apos;t find an answer matching your query. Please submit a support ticket below or call our 24/7 hotline.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={cn(
                    "rounded-2xl border transition-all duration-200 overflow-hidden",
                    isOpen
                      ? "border-primary/50 bg-card shadow-sm"
                      : "border-border/80 bg-card/70 hover:border-border"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-foreground transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 shrink-0 text-muted-foreground">
                      {isOpen ? (
                        <ChevronUp className="size-4 text-primary" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                      <p>{faq.answer}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/30">
                        {faq.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] py-0 px-2 font-normal"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Support Ticket Submission & Direct Channels Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Operations Desk (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-card p-6 sm:p-8 space-y-6 shadow-md">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Headphones className="size-3.5" />
                <span>Live Dispatch Desk</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Need Immediate Assistance?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our central operations command center in Tejgaon monitors freight consignments across all 64 districts 24/7.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-background/60 border border-border/60">
                <Phone className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">24/7 Helpline</p>
                  <a
                    href="tel:09612929764"
                    className="text-primary hover:underline font-mono font-semibold"
                  >
                    09612-WAYPOINT (09612-929764)
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Instant routing to live dispatch supervisors
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-background/60 border border-border/60">
                <Mail className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Operations Email</p>
                  <a
                    href="mailto:support@waypoint.com.bd"
                    className="text-primary hover:underline font-mono font-semibold"
                  >
                    support@waypoint.com.bd
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Guaranteed response within 2 business hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-background/60 border border-border/60">
                <Clock className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Hub Gateways</p>
                  <p className="text-muted-foreground">
                    Dhaka Central (Tejgaon), Chattogram Port, Sylhet Regional
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Physical sorting running 24/7/365
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/track"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-3 text-xs font-semibold shadow-md hover:bg-primary/90 transition-all cursor-pointer"
              >
                <span>Open Live Consignment Tracker</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Ticket Submission Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground mb-2">
                <MessageSquare className="size-3.5" />
                <span>Formal Support Request</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Submit an Operations Ticket
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Log a case with our dispatch and financial audit teams. We will track and resolve your issue with verified SLAs.
              </p>
            </div>

            {submittedTicket ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-4 animate-in fade-in duration-300">
                <div className="size-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="size-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-foreground">
                    Support Ticket Successfully Logged
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Your request has been routed to our regional dispatch desk. An automated confirmation has been dispatched to your email.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-emerald-500/30 text-xs font-mono font-bold text-foreground">
                  <span>Reference ID: {submittedTicket.id}</span>
                </div>

                <div className="pt-2 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmittedTicket(null);
                      setTicketMessage("");
                      setTicketTracking("");
                    }}
                    className="rounded-xl text-xs cursor-pointer"
                  >
                    Submit Another Request
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                {ticketError && (
                  <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{ticketError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-name" className="text-xs">
                      Your Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ticket-name"
                      type="text"
                      placeholder="e.g. Tanvir Ahmed"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      required
                      className="rounded-2xl text-xs sm:text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-email" className="text-xs">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ticket-email"
                      type="email"
                      placeholder="e.g. tanvir@company.com"
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      required
                      className="rounded-2xl text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-phone" className="text-xs">
                      Contact Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ticket-phone"
                      type="tel"
                      placeholder="01712345678"
                      value={ticketPhone}
                      onChange={(e) => setTicketPhone(e.target.value)}
                      required
                      className="rounded-2xl text-xs sm:text-sm font-mono"
                    />
                  </div>

                  {/* Optional Tracking Number */}
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-tracking" className="text-xs">
                      Tracking # <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="ticket-tracking"
                      type="text"
                      placeholder="e.g. WP-2026-XXXX"
                      value={ticketTracking}
                      onChange={(e) => setTicketTracking(e.target.value)}
                      className="rounded-2xl text-xs sm:text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-cat" className="text-xs">
                      Issue Domain
                    </Label>
                    <select
                      id="ticket-cat"
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-2xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="delivery-delay">Transit or Delivery Delay</option>
                      <option value="cod-remittance">COD Payout / Remittance Query</option>
                      <option value="address-change">Recipient Address / Phone Update</option>
                      <option value="damaged-goods">Damaged Parcel / Claim Filing</option>
                      <option value="merchant-api">API Integration Assistance</option>
                      <option value="other">General Account Inquiry</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-priority" className="text-xs">
                      Urgency Level
                    </Label>
                    <select
                      id="ticket-priority"
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full h-10 px-3 rounded-2xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="NORMAL">Standard Priority (under 4 hrs)</option>
                      <option value="HIGH">High Priority (under 1 hr)</option>
                      <option value="URGENT">Urgent Out-for-Delivery (under 15 mins)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="ticket-msg" className="text-xs">
                    Detailed Message & Specific Instructions <span className="text-destructive">*</span>
                  </Label>
                  <textarea
                    id="ticket-msg"
                    rows={4}
                    placeholder="Please specify parcel details, consignor/consignee address, or exact payment discrepancy..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    required
                    className="w-full p-3 rounded-2xl bg-background border border-border text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="w-full h-11 rounded-2xl font-semibold gap-2 shadow-md cursor-pointer"
                >
                  {isSubmittingTicket ? (
                    <span>Registering Ticket...</span>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>Submit Support Ticket</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
