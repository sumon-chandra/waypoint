"use client";

import * as React from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Send,
  Building,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JobOpening {
  id: string;
  title: string;
  department: "engineering" | "operations" | "product" | "growth" | "fleet";
  deptLabel: string;
  location: string;
  type: string;
  experience: string;
  description: string;
}

const jobOpenings: JobOpening[] = [
  {
    id: "eng-01",
    title: "Senior Full-Stack Engineer (Next.js & Go)",
    department: "engineering",
    deptLabel: "Software Engineering",
    location: "Dhaka HQ (Hybrid)",
    type: "Full-Time",
    experience: "4+ Years",
    description:
      "Scale our high-throughput dispatch engine handling millions of monthly consignment barcode scans and webhook telemetry.",
  },
  {
    id: "eng-02",
    title: "Mobile Engineer (React Native / Android)",
    department: "engineering",
    deptLabel: "Software Engineering",
    location: "Dhaka HQ (Hybrid)",
    type: "Full-Time",
    experience: "3+ Years",
    description:
      "Build offline-first mobile applications for 15,000+ courier riders with Bluetooth thermal printer and barcode scanner integration.",
  },
  {
    id: "ops-01",
    title: "Regional Linehaul Operations Manager",
    department: "operations",
    deptLabel: "Logistics Operations",
    location: "Chittagong Port Terminal",
    type: "Full-Time",
    experience: "5+ Years",
    description:
      "Direct inter-district highway container scheduling, truck turnaround SLAs, and cross-dock precision between Chittagong and Dhaka.",
  },
  {
    id: "ops-02",
    title: "Hub Sorting Facility Supervisor",
    department: "operations",
    deptLabel: "Logistics Operations",
    location: "Sylhet Express Hub",
    type: "Full-Time",
    experience: "2+ Years",
    description:
      "Oversee evening cross-dock barcode sorting, dispatch manifests, and local rider allocations in the Sylhet division.",
  },
  {
    id: "prod-01",
    title: "Product Designer (UI/UX Systems)",
    department: "product",
    deptLabel: "Product & Design",
    location: "Dhaka HQ",
    type: "Full-Time",
    experience: "3+ Years",
    description:
      "Craft world-class enterprise merchant dashboards, consignment tracking flows, and design system tokens.",
  },
  {
    id: "growth-01",
    title: "Enterprise Merchant Account Executive",
    department: "growth",
    deptLabel: "Merchant Growth",
    location: "Dhaka HQ",
    type: "Full-Time",
    experience: "3+ Years",
    description:
      "Lead enterprise logistics partnerships with top Bangladeshi FMCG, fashion apparel brands, and major marketplace sellers.",
  },
  {
    id: "fleet-01",
    title: "Rider Welfare & Fleet Safety Coordinator",
    department: "fleet",
    deptLabel: "Courier Fleet",
    location: "Dhaka & Regional",
    type: "Full-Time",
    experience: "2+ Years",
    description:
      "Manage courier partner onboarding, safety training, micro-hub lounge maintenance, and driver insurance claims.",
  },
];

const departments = [
  { id: "all", label: "All Roles" },
  { id: "engineering", label: "Engineering" },
  { id: "operations", label: "Operations" },
  { id: "product", label: "Product & Design" },
  { id: "growth", label: "Merchant Growth" },
  { id: "fleet", label: "Courier Fleet" },
];

export function CareersClient() {
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [applyingJob, setApplyingJob] = React.useState<JobOpening | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [applicant, setApplicant] = React.useState({
    name: "",
    email: "",
    phone: "",
    portfolio: "",
    note: "",
  });

  const filteredJobs = React.useMemo(() => {
    return jobOpenings.filter((job) => {
      return selectedDept === "all" || job.department === selectedDept;
    });
  }, [selectedDept]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-12">
      {/* Department Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {departments.map((dept) => {
          const isSelected = selectedDept === dept.id;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDept(dept.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition-all shrink-0 cursor-pointer",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {dept.label}
            </button>
          );
        })}
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/20 text-primary text-[10px]"
                >
                  {job.deptLabel}
                </Badge>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {job.experience} Experience
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {job.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" />
                  <span>{job.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-primary" />
                  <span>{job.type}</span>
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                size="sm"
                onClick={() => {
                  setApplyingJob(job);
                  setSubmitted(false);
                }}
                className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer w-full sm:w-auto"
              >
                <span>Apply for Role</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal / Drawer */}
      {applyingJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] text-primary">
                  {applyingJob.deptLabel}
                </Badge>
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="size-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Apply for {applyingJob.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Location: {applyingJob.location} &bull; {applyingJob.type}
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-3">
                <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-foreground">
                  Application Received!
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Thank you, {applicant.name}. Our talent acquisition team will
                  review your background and contact you at {applicant.email}{" "}
                  within 3 business days.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setApplyingJob(null)}
                  className="rounded-xl text-xs mt-2 cursor-pointer"
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Nusrat Jahan"
                    value={applicant.name}
                    onChange={(e) =>
                      setApplicant({ ...applicant, name: e.target.value })
                    }
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="nusrat@example.com"
                      value={applicant.email}
                      onChange={(e) =>
                        setApplicant({ ...applicant, email: e.target.value })
                      }
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Phone Number *
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="017xxxxxxxx"
                      value={applicant.phone}
                      onChange={(e) =>
                        setApplicant({ ...applicant, phone: e.target.value })
                      }
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    LinkedIn / GitHub / Portfolio URL *
                  </label>
                  <Input
                    required
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={applicant.portfolio}
                    onChange={(e) =>
                      setApplicant({ ...applicant, portfolio: e.target.value })
                    }
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Why do you want to build logistics at Waypoint?
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Briefly describe your relevant projects and achievements..."
                    value={applicant.note}
                    onChange={(e) =>
                      setApplicant({ ...applicant, note: e.target.value })
                    }
                    className="text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setApplyingJob(null)}
                    className="rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Submit Application</span>
                    <Send className="size-3" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
