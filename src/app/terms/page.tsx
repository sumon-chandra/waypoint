import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Scale, FileText, AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms of Service & Carriage Agreement — Waypoint",
  description:
    "Review Waypoint Logistics Terms of Service, carriage rules, Cash on Delivery settlement covenants, and merchant liabilities across Bangladesh.",
};

const sections = [
  { id: "definitions", title: "1. Definitions & Acceptance" },
  { id: "accounts", title: "2. Account Registration & Conduct" },
  { id: "carriage", title: "3. Scope of Carriage & Delivery SLAs" },
  { id: "prohibited", title: "4. Prohibited & Hazardous Goods" },
  { id: "cod", title: "5. Cash on Delivery (COD) & Payouts" },
  { id: "liability", title: "6. Limitation of Liability & Claims" },
  { id: "returns", title: "7. Undeliverable & Return Parcels" },
  { id: "governing-law", title: "8. Governing Law & Jurisdiction" },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-14 sm:py-20 border-b border-border/50">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Scale className="size-3.5" />
              <span>Legal Covenants & Carriage Terms</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              Terms of Service
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground">
              Effective Date: January 1, 2026 &bull; Last Revised: September 2026
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
                <span>Agreement Sections</span>
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
                  Have questions about these carriage terms?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Contact Legal & Compliance</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </aside>

            {/* Legal Text Content (8 cols) */}
            <div className="lg:col-span-8 space-y-10 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground">
                <p className="font-semibold text-primary">Notice to Shippers & Merchants:</p>
                <p className="mt-1">
                  By booking a shipment, generating a digital waypoint manifest, or opening a merchant
                  account with Waypoint Technologies Ltd. (&quot;Waypoint&quot;), you agree to be bound
                  by the carriage covenants set forth below.
                </p>
              </div>

              {/* Section 1 */}
              <div id="definitions" className="space-y-3 pt-2">
                <h3 className="text-lg font-bold text-foreground">
                  1. Definitions & Acceptance of Terms
                </h3>
                <p>
                  &quot;Consignment&quot; or &quot;Parcel&quot; refers to any goods, documents, or items
                  tendered to Waypoint for transport, sorting, and delivery. &quot;Merchant&quot; means
                  the registered commercial entity or individual booking the carriage. &quot;Recipient&quot;
                  designates the designated addressee.
                </p>
                <p>
                  These Terms constitute a binding legal agreement under the Contract Act, 1872, and the
                  Information and Communication Technology (ICT) Act, 2006 of the People&apos;s Republic
                  of Bangladesh.
                </p>
              </div>

              {/* Section 2 */}
              <div id="accounts" className="space-y-3 pt-6 border-t border-border/60">
                <h3 className="text-lg font-bold text-foreground">
                  2. Account Registration & Conduct
                </h3>
                <p>
                  Merchants must provide accurate business identification, including valid Trade Licenses,
                  e-TIN, and verified National ID (NID) credentials during onboarding.
                </p>
                <p>
                  Accounts must not be used for fraudulent transactions, deceptive COD collection, or
                  submitting bogus recipient contact numbers. Waypoint reserves the right to suspend or
                  permanently ban non-compliant merchant profiles immediately without prior notice.
                </p>
              </div>

              {/* Section 3 */}
              <div id="carriage" className="space-y-3 pt-6 border-t border-border/60">
                <h3 className="text-lg font-bold text-foreground">
                  3. Scope of Carriage & Delivery SLAs
                </h3>
                <p>
                  Waypoint provides delivery services throughout all 64 districts in Bangladesh through
                  its network of sorting hubs, highway linehaul vehicles, and last-mile couriers.
                </p>
                <p>
                  Service turnaround times (12-24 hours for Intra-City Express; 24-48 hours for Inter-District)
                  are target SLAs calculated from the moment of sorting hub intake scan. Waypoint shall not
                  be held liable for transit delays caused by force majeure, road blockades, natural monsoons,
                  or severe ferry crossings beyond reasonable control.
                </p>
              </div>

              {/* Section 4 */}
              <div id="prohibited" className="space-y-3 pt-6 border-t border-border/60">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span>4. Prohibited & Hazardous Goods</span>
                  <AlertTriangle className="size-4 text-amber-500" />
                </h3>
                <p>
                  Senders warrant that consignments contain no prohibited items. Under Bangladesh Postal
                  and Penal codes, prohibited cargo includes but is not limited to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Firearms, munitions, blades, and explosive chemicals.</li>
                  <li>Narcotics, illegal narcotics, and counterfeit prescription medicines.</li>
                  <li>Live animals, endangered wildlife, and raw animal hides.</li>
                  <li>Corrosive acids, lithium-ion raw batteries exceeding airline limits, and radioactive substances.</li>
                  <li>Currency notes, treasury certificates, and gold bullion without prior security declaration.</li>
                </ul>
                <p>
                  Waypoint reserves the right to open, inspect, or surrender any suspicious consignment
                  to law enforcement agencies without shipper compensation.
                </p>
              </div>

              {/* Section 5 */}
              <div id="cod" className="space-y-3 pt-6 border-t border-border/60">
                <h3 className="text-lg font-bold text-foreground">
                  5. Cash on Delivery (COD) & Payout Terms
                </h3>
                <p>
                  Where Cash on Delivery is requested, Waypoint acts solely as a collection agent on
                  behalf of the merchant. A 1% service fee applies to the collected gross amount.
                </p>
                <p>
                  Disbursements are remitted per the merchant&apos;s plan tier (weekly for Starter; next
                  business day for Growth and Enterprise accounts) via BEFTN bank transfer or MFS
                  (bKash/Nagad). Senders agree that Waypoint is not responsible for recipient dispute of
                  goods quality after delivery handshake.
                </p>
              </div>

              {/* Section 6 */}
              <div id="liability" className="space-y-3 pt-6 border-t border-border/60">
                <h3 className="text-lg font-bold text-foreground">
                  6. Limitation of Liability & Claims
                </h3>
                <p>
                  In the event of verified physical loss or damage directly attributable to Waypoint
                  transit negligence, liability is strictly limited to the actual manufacturing cost of
                  the item or ৳5,000 (whichever is lower), unless declared value insurance was purchased
                  prior to dispatch.
                </p>
                <p>
                  Claims must be formally lodged via the Merchant Portal or email within 72 hours of the
                  recorded delivery scan or confirmed loss report.
                </p>
              </div>

              {/* Section 7 */}
              <div id="returns" className="space-y-3 pt-6 border-t border-border/60">
                <h3 className="text-lg font-bold text-foreground">
                  7. Undeliverable & Return Parcels
                </h3>
                <p>
                  Waypoint riders conduct up to 3 verified delivery attempts with SMS confirmation. If the
                  recipient refuses acceptance or cannot be reached, the consignment will be marked as
                  Return to Merchant (RTO) and returned to origin within 48 to 72 hours.
                </p>
                <p>
                  Standard return shipping charges apply according to the published pricing schedule.
                </p>
              </div>

              {/* Section 8 */}
              <div id="governing-law" className="space-y-3 pt-6 border-t border-border/60">
                <h3 className="text-lg font-bold text-foreground">
                  8. Governing Law & Jurisdiction
                </h3>
                <p>
                  These Terms of Service are governed exclusively by the laws of Bangladesh. Any dispute,
                  controversy, or claim arising under or relating to these terms shall be subject to the
                  exclusive jurisdiction of the competent courts in Dhaka, Bangladesh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
