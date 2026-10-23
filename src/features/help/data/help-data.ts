export interface SupportCategory {
  id: string;
  name: string;
  iconName: "Truck" | "Banknote" | "Code2" | "Bike" | "ShieldAlert" | "UserCheck";
  description: string;
  articleCount: number;
}

export interface SupportFaqItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  tags: string[];
}

export const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: "tracking-delivery",
    name: "Tracking & Deliveries",
    iconName: "Truck",
    description: "Live waypoint tracing, OTP delivery protocol, failed attempts, and delivery rescheduling.",
    articleCount: 6,
  },
  {
    id: "cod-payments",
    name: "COD & Settlements",
    iconName: "Banknote",
    description: "Daily automated remittances, escrow ledgers, take-rate deductions, and merchant invoices.",
    articleCount: 5,
  },
  {
    id: "merchant-api",
    name: "Merchant API & Tools",
    iconName: "Code2",
    description: "REST API integration, webhook delivery alerts, bulk CSV booking, and e-commerce plugins.",
    articleCount: 4,
  },
  {
    id: "courier-fleet",
    name: "Courier & Field Operations",
    iconName: "Bike",
    description: "Manifest run sheets, daily cash deposit guidelines, OTP mobile app, and vehicle inspection.",
    articleCount: 5,
  },
  {
    id: "claims-guarantee",
    name: "Claims & Insurance",
    iconName: "ShieldAlert",
    description: "Declared value coverage, transit damage compensation, and 48-hour claim turnaround.",
    articleCount: 4,
  },
  {
    id: "account-security",
    name: "Account & Profile",
    iconName: "UserCheck",
    description: "Two-factor authentication, team role permissions, password recovery, and VAT receipts.",
    articleCount: 4,
  },
];

export const SUPPORT_FAQS: SupportFaqItem[] = [
  {
    id: "faq-track-1",
    categoryId: "tracking-delivery",
    question: "How does Waypoint's live waypoint tracking work?",
    answer: "Every consignment is assigned a unique Waypoint tracking number (e.g., WP-2026-XXXX). Consignments transition through 9 finite state machine (FSM) statuses: PENDING → ASSIGNED → PICKED_UP → RECEIVED_AT_ORIGIN_HUB → IN_TRANSIT → RECEIVED_AT_DEST_HUB → OUT_FOR_DELIVERY → DELIVERED. You can track real-time milestones anytime on /track/[trackingNumber] with zero login required.",
    tags: ["Tracking", "FSM", "Milestones"],
  },
  {
    id: "faq-track-2",
    categoryId: "tracking-delivery",
    question: "Why is a 4-digit SMS OTP required for parcel handover?",
    answer: "To safeguard high-value consignments and merchant capital, our platform requires a 4-digit cryptographic OTP sent directly to the recipient's verified phone number. Couriers cannot finalize the delivery status on their handheld manifest without entering this code.",
    tags: ["OTP", "Handover", "Security"],
  },
  {
    id: "faq-track-3",
    categoryId: "tracking-delivery",
    question: "What happens if the recipient is unavailable during first delivery attempt?",
    answer: "If the recipient cannot be contacted after 3 phone attempts, the courier records an 'Attempted — Recipient Unavailable' note. The consignment is safely staged at the destination hub for an automatic second-attempt run the following business morning. Recipients can also reschedule drop-off timing directly from their customer dashboard.",
    tags: ["Attempt", "Reschedule", "Hub"],
  },
  {
    id: "faq-cod-1",
    categoryId: "cod-payments",
    question: "When are Cash on Delivery (COD) funds remitted to merchants?",
    answer: "Waypoint operates a next-day automated remittance engine. As soon as a courier verifies delivery via OTP and reconciles collected cash, the funds are credited to the merchant's platform escrow. Payouts trigger automatically within 24 hours via bKash, Nagad, or BEFTN/NPSB bank transfers.",
    tags: ["COD", "Remittance", "Escrow"],
  },
  {
    id: "faq-cod-2",
    categoryId: "cod-payments",
    question: "What are the platform take rates and delivery fees?",
    answer: "Intra-city local deliveries start at ৳60 for the initial 1kg, while inter-district consignments across all 64 districts start at ৳120. COD payment processing carries a 1% collection take-rate with zero hidden settlement penalties.",
    tags: ["Rates", "Take Rate", "Pricing"],
  },
  {
    id: "faq-api-1",
    categoryId: "merchant-api",
    question: "How do I obtain API credentials for automated consignment creation?",
    answer: "Verified enterprise and business accounts can generate API keys directly in the /customer or /admin command center. Our REST API adheres to strict OpenAPI standards, supporting single parcel booking, bulk CSV uploads, and real-time Socket.io webhook dispatch.",
    tags: ["API", "Integration", "Webhooks"],
  },
  {
    id: "faq-courier-1",
    categoryId: "courier-fleet",
    question: "How does a courier access their daily Active Manifest?",
    answer: "Assigned riders can navigate to /courier/manifest to view all parcels loaded onto their vehicle. Stops are sequenced by geofenced proximity, with recipient phone dialers, OTP input dialogs, and instant COD receipting built into each stop card.",
    tags: ["Courier", "Manifest", "Active Run"],
  },
  {
    id: "faq-claims-1",
    categoryId: "claims-guarantee",
    question: "What is Waypoint's transit loss and damage policy?",
    answer: "All standard consignments include complimentary basic transit coverage up to ৳3,000. For high-value electronics and luxury goods, merchants can declare full valuation during booking. Verified damage or loss claims are processed and reimbursed within 48 business hours.",
    tags: ["Claims", "Insurance", "Compensation"],
  },
  {
    id: "faq-account-1",
    categoryId: "account-security",
    question: "How do I update my profile details, avatar, or password?",
    answer: "Authenticated users of any role can visit /profile to edit their full name, upload custom profile pictures via UploadThing, or update account security passwords with instant verification.",
    tags: ["Profile", "Password", "UploadThing"],
  },
];
