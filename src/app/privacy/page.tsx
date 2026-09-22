import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection — Waypoint",
  description:
    "Learn how Waypoint collects, safeguards, and handles customer addresses, courier GPS telemetry, proof-of-delivery photos, and merchant payment information in Bangladesh.",
};

const sections = [
  { id: "collection", title: "1. Information We Collect" },
  { id: "telemetry", title: "2. Telemetry & Location Data" },
  { id: "pod", title: "3. Proof-of-Delivery & Media" },
  { id: "cookies", title: "4. Authentication & Cookies" },
  { id: "usage", title: "5. How We Use & Share Data" },
  { id: "security", title: "6. Security & Encryption Standards" },
  { id: "rights", title: "7. Your Rights & Privacy Choices" },
  { id: "dpo", title: "8. Data Protection Officer Contact" },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background py-14 sm:py-20 border-b border-border/50">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Lock className="size-3.5" />
              <span>Data Protection & Privacy Covenant</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              Privacy Policy
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground">
              Effective Date: January 1, 2026 &bull; Last Revised: September
              2026
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sticky TOC */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sticky Table of Contents (4 cols) */}
            <aside className="lg:col-span-4 sticky top-24 rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <span>Privacy Sections</span>
              </h2>
              <nav className="space-y-1 text-xs">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-border/60 space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  Questions regarding your personal information?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Contact Data Protection Officer</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </aside>

            {/* Privacy Text Content (8 cols) */}
            <div className="lg:col-span-8 space-y-10 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-foreground">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Our Privacy Commitment:
                </p>
                <p className="mt-1">
                  Waypoint Technologies Ltd. (&quot;Waypoint&quot;) respects the
                  privacy of our merchants, courier partners, and parcel
                  recipients. We never sell, rent, or monetize your personal
                  data or delivery coordinates to third-party advertising
                  networks.
                </p>
              </div>

              {/* Section 1 */}
              <div id="collection" className="space-y-3 pt-2">
                <h3 className="text-lg font-bold text-foreground">
                  1. Information We Collect
                </h3>
                <p>
                  To fulfill logistics operations and maintain real-time
                  waypoint tracking, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Sender Information:</strong> Merchant name, company
                    trade name, registered pickup address, email, telephone
                    number, and bank/MFS settlement details.
                  </li>
                  <li>
                    <strong>Recipient Information:</strong> Customer full name,
                    shipping destination address, neighborhood landmark, and
                    mobile phone number for delivery coordination and OTP
                    verification.
                  </li>
                  <li>
                    <strong>Consignment Metadata:</strong> Declared item value,
                    weight, package dimensions, and Cash on Delivery collection
                    amount.
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div
                id="telemetry"
                className="space-y-3 pt-6 border-t border-border/60"
              >
                <h3 className="text-lg font-bold text-foreground">
                  2. Telemetry & Location Data
                </h3>
                <p>
                  When courier riders are actively on duty, our mobile
                  application captures periodic GPS coordinates to calculate
                  estimated arrival times (ETA), optimize street route
                  clustering, and verify parcel drop-offs at physical premises.
                </p>
                <p>
                  Location tracking is strictly deactivated when riders clock
                  out or mark themselves inactive on the courier network.
                </p>
              </div>

              {/* Section 3 */}
              <div
                id="pod"
                className="space-y-3 pt-6 border-t border-border/60"
              >
                <h3 className="text-lg font-bold text-foreground">
                  3. Proof-of-Delivery & Media
                </h3>
                <p>
                  To protect merchants against false chargebacks and safeguard
                  couriers, our mobile app allows riders to capture photographic
                  proof-of-delivery (e.g., photo of package at doorstep or
                  parcel with recipient consent).
                </p>
                <p>
                  Proof-of-delivery media is encrypted at rest in isolated cloud
                  storage, strictly accessible only to the sender and recipient
                  via authenticated portal links, and permanently archived or
                  purged after 90 calendar days.
                </p>
              </div>

              {/* Section 4 */}
              <div
                id="cookies"
                className="space-y-3 pt-6 border-t border-border/60"
              >
                <h3 className="text-lg font-bold text-foreground">
                  4. Authentication & Cookies
                </h3>
                <p>
                  Waypoint utilizes secure, HTTP-only cookies to manage user
                  authentication tokens. This prevents client-side script
                  tampering (XSS vulnerabilities) and ensures your login session
                  remains strictly protected between your browser and our
                  backend API.
                </p>
                <p>
                  We do not use invasive tracking pixels or cross-site tracking
                  cookies.
                </p>
              </div>

              {/* Section 5 */}
              <div
                id="usage"
                className="space-y-3 pt-6 border-t border-border/60"
              >
                <h3 className="text-lg font-bold text-foreground">
                  5. How We Use & Share Data
                </h3>
                <p>
                  Your information is processed strictly for essential logistics
                  purposes:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Generating barcode scan logs and transmitting SMS arrival
                    alerts to recipients.
                  </li>
                  <li>
                    Facilitating BEFTN bank transfers and bKash/Nagad automated
                    COD disbursements.
                  </li>
                  <li>
                    Preventing fraudulent COD orders and identifying suspicious
                    high-return addresses.
                  </li>
                  <li>
                    Complying with lawful court orders or requests from
                    authorized Bangladesh law enforcement authorities.
                  </li>
                </ul>
              </div>

              {/* Section 6 */}
              <div
                id="security"
                className="space-y-3 pt-6 border-t border-border/60"
              >
                <h3 className="text-lg font-bold text-foreground">
                  6. Security & Encryption Standards
                </h3>
                <p>
                  All data in transit between your browser and our servers is
                  secured with 256-bit Transport Layer Security (TLS 1.3)
                  encryption. Sensitive databases are compartmentalized with
                  role-based access control (RBAC), multi-factor authentication
                  for operational staff, and continuous automated security
                  auditing.
                </p>
              </div>

              {/* Section 7 */}
              <div
                id="rights"
                className="space-y-3 pt-6 border-t border-border/60"
              >
                <h3 className="text-lg font-bold text-foreground">
                  7. Your Rights & Privacy Choices
                </h3>
                <p>
                  Under Bangladesh digital regulations, you have the right to
                  request access to the personal data held by Waypoint, update
                  or rectify inaccurate billing addresses, or request the
                  deletion of your merchant profile and historic delivery logs
                  once all pending COD settlements are satisfied.
                </p>
              </div>

              {/* Section 8 */}
              <div
                id="dpo"
                className="space-y-3 pt-6 border-t border-border/60"
              >
                <h3 className="text-lg font-bold text-foreground">
                  8. Data Protection Officer Contact
                </h3>
                <p>
                  If you have inquiries, concerns, or requests regarding this
                  Privacy Policy or your data handling, please contact our Data
                  Protection Officer (DPO):
                </p>
                <div className="rounded-2xl border border-border bg-card p-4 space-y-1 text-xs">
                  <p className="font-bold text-foreground">
                    Data Protection & Privacy Officer
                  </p>
                  <p>Waypoint Technologies Ltd.</p>
                  <p>Plot 14, Road 113/A, Gulshan-2, Dhaka 1212, Bangladesh</p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:privacy@waypoint.com.bd"
                      className="text-primary hover:underline"
                    >
                      privacy@waypoint.com.bd
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
