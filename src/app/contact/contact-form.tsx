"use client";

import * as React from "react";
import { Send, CheckCircle2, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-500/20 bg-card p-8 text-center space-y-4 animate-in fade-in duration-300">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">Message Dispatched!</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Thank you, <strong>{formData.name || "Customer"}</strong>. Our dispatch support team has
            received your inquiry and will respond within 2 business hours via {formData.email || "email"}.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", phone: "", subject: "general", message: "" });
          }}
          className="rounded-xl text-xs cursor-pointer"
        >
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-md space-y-5">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <span>Send Us an Inquiry</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          Fill out the details below and our operations desk will connect with you promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Full Name *</label>
          <Input
            required
            placeholder="e.g. Zahid Hasan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Phone Number *</label>
          <Input
            required
            type="tel"
            placeholder="017xxxxxxxx"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="text-xs font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Email Address *</label>
          <Input
            required
            type="email"
            placeholder="zahid@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Inquiry Category *</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="h-10 w-full rounded-xl border border-input bg-background/80 px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="general">General Support</option>
            <option value="tracking">Consignment Status / Delay</option>
            <option value="merchant">Merchant Account Onboarding</option>
            <option value="corporate">Enterprise Bulk Linehaul</option>
            <option value="billing">COD Settlement & Billing</option>
            <option value="courier">Courier Partner Application</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">Your Message *</label>
        <Textarea
          required
          rows={4}
          placeholder="Please describe your consignment ID, business volume, or question in detail..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="text-xs"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl text-xs font-semibold shadow-sm gap-2 cursor-pointer"
      >
        {loading ? (
          <span>Dispatching message...</span>
        ) : (
          <>
            <span>Submit Inquiry</span>
            <Send className="size-3.5" />
          </>
        )}
      </Button>
    </form>
  );
}
