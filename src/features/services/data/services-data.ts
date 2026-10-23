export interface ServiceReview {
  id: string;
  author: string;
  company: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  category:
    | "Express Courier"
    | "City Transit"
    | "Heavy Freight"
    | "Cold Chain"
    | "E-Commerce COD"
    | "Document Rush";
  coverage: string;
  locationArea:
    | "all-bangladesh"
    | "dhaka-metro"
    | "chittagong-corridor"
    | "divisional-gateways";
  badge: string;
  price: number;
  priceDisplay: string;
  priceTier: "budget" | "standard" | "enterprise";
  rating: number;
  reviewCount: number;
  sla: string;
  speedHours: number;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  features: string[];
  specifications: {
    maxWeight: string;
    volumetricFormula: string;
    pickupCutoff: string;
    transitWindow: string;
    insuranceCoverage: string;
    trackingUpdateFreq: string;
    securityVerification: string;
    handlingType: string;
  };
  popular: boolean;
  reviews: ServiceReview[];
}

export const LOGISTICS_SERVICES: ServiceItem[] = [
  {
    id: "express",
    title: "Express Parcel Delivery",
    tagline: "Next-Day Nationwide 24h Guarantee",
    category: "Express Courier",
    coverage: "All 64 Districts",
    locationArea: "all-bangladesh",
    badge: "Most Popular",
    price: 60,
    priceDisplay: "From ৳60 / kg",
    priceTier: "budget",
    rating: 4.9,
    reviewCount: 428,
    sla: "12 - 24 Hours",
    speedHours: 24,
    description:
      "Guaranteed overnight parcel delivery across all 64 districts in Bangladesh with node-to-node barcode scanning and zero blind spots.",
    longDescription:
      "Waypoint's flagship Express Parcel Delivery is engineered for high-velocity e-commerce merchants and corporate shippers demanding guaranteed next-day fulfillment. Every consignment is barcoded upon intake, sorted automatically at regional cross-dock terminals, and routed across dedicated line-haul highway lanes connecting all 8 divisions.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Real-time SMS alerts at every waypoint scan",
      "Automated cross-dock sorting in Tejgaon & Agrabad gateways",
      "Guaranteed next-day delivery across 495+ upazilas",
      "Complimentary transit insurance up to ৳5,000",
    ],
    specifications: {
      maxWeight: "Up to 30 kg per parcel",
      volumetricFormula: "L × W × H (cm) / 5000",
      pickupCutoff: "18:00 (6:00 PM) daily",
      transitWindow: "12 – 24 Hours",
      insuranceCoverage:
        "Included up to ৳5,000 (Declared value options up to ৳200,000)",
      trackingUpdateFreq: "Real-time at every physical scan point",
      securityVerification: "4-Digit Recipient OTP Required",
      handlingType: "Barcoded Standard Courier Conveyor",
    },
    popular: true,
    reviews: [
      {
        id: "rev-1",
        author: "Tanzim Ahmed",
        company: "TechGear Bangladesh",
        rating: 5,
        date: "2 days ago",
        comment:
          "Waypoint Express completely resolved our transit delays. Consignments from Dhaka to Bogra and Sylhet consistently arrive before 2:00 PM next day.",
        verified: true,
      },
      {
        id: "rev-2",
        author: "Farhana Islam",
        company: "Aura Boutique BD",
        rating: 5,
        date: "1 week ago",
        comment:
          "Node tracking is exceptionally clear. Customers love receiving SMS alerts with the exact hub location.",
        verified: true,
      },
    ],
  },
  {
    id: "same-day",
    title: "Same-Day City Transit",
    tagline: "Within-Metro Rush Deliveries (4 - 8 Hours)",
    category: "City Transit",
    coverage: "Dhaka & Chittagong Metro",
    locationArea: "dhaka-metro",
    badge: "Ultra Fast",
    price: 120,
    priceDisplay: "From ৳120 Flat",
    priceTier: "standard",
    rating: 4.8,
    reviewCount: 312,
    sla: "4 - 8 Hours",
    speedHours: 6,
    description:
      "On-demand intra-city rush delivery dispatched within 45 minutes of booking for urgent documents, perishables, and flash retail.",
    longDescription:
      "Our Same-Day City Transit service deploys dedicated motorcycle and micro-van couriers for rapid intra-city transport. Parcels bypass central cross-dock facilities, moving directly from sender pickup to recipient drop-off with live GPS telemetry and direct courier communication.",
    image:
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Priority rider dispatch within 45 minutes",
      "Direct point-to-point courier routing without hub holding",
      "Live rider GPS coordinates & direct calling",
      "OTP-verified recipient drop-off confirmation",
    ],
    specifications: {
      maxWeight: "Up to 10 kg per ride",
      volumetricFormula: "L × W × H (cm) / 6000",
      pickupCutoff: "14:00 (2:00 PM) for same-day completion",
      transitWindow: "4 – 8 Hours guaranteed",
      insuranceCoverage: "Included up to ৳10,000",
      trackingUpdateFreq: "Continuous GPS Telemetry (every 10s)",
      securityVerification: "Instant SMS OTP & Geofenced Drop-off",
      handlingType: "Direct Rider Waterproof Pouch",
    },
    popular: true,
    reviews: [
      {
        id: "rev-3",
        author: "Mahmudur Rahman",
        company: "Apex Legal Associates",
        rating: 5,
        date: "3 days ago",
        comment:
          "Critical court documents delivered from Motijheel to Uttara in under 3 hours. The OTP signature handshake gives full legal confidence.",
        verified: true,
      },
    ],
  },
  {
    id: "freight",
    title: "Hub-to-Hub Linehaul Freight",
    tagline: "Heavy Cargo & Bulk B2B Highway Linehaul",
    category: "Heavy Freight",
    coverage: "Inter-District High-Capacity Lanes",
    locationArea: "divisional-gateways",
    badge: "Heavy Cargo",
    price: 350,
    priceDisplay: "From ৳350 / 50kg",
    priceTier: "enterprise",
    rating: 4.9,
    reviewCount: 198,
    sla: "24 - 48 Hours",
    speedHours: 36,
    description:
      "Heavy freight logistics moving bulk consignments across Waypoint's inter-district highway fleet in weather-sealed container trucks.",
    longDescription:
      "Engineered for industrial wholesalers, manufacturers, and volume distributors. Our Linehaul Freight service provides scheduled full-truckload (FTL) and less-than-truckload (LTL) departures connecting all 8 divisional gateways with hydraulic tail-lift loading, pallet wrapping, and weighbridge verification.",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Dedicated truckload (FTL) and palletized (LTL) configurations",
      "Hydraulic tail-lift and mechanical pallet jack support",
      "Containerized GPS-sealed heavy highway vehicles",
      "Volume discount tiers starting at 50kg up to 10 tons",
    ],
    specifications: {
      maxWeight: "50 kg to 10,000 kg per consignment",
      volumetricFormula: "CBM calculation (L × W × H in m × 250)",
      pickupCutoff: "16:00 (4:00 PM) daily",
      transitWindow: "24 – 48 Hours nationwide",
      insuranceCoverage: "Commercial Cargo Policy up to ৳1,000,000",
      trackingUpdateFreq: "Checkpoint weighbridge & RFID gateway scans",
      securityVerification: "Consignment Waybill & Physical Manifest Sign-off",
      handlingType: "Palletized / Forklift Safe",
    },
    popular: false,
    reviews: [
      {
        id: "rev-4",
        author: "Kamrul Hasan",
        company: "Bengal Plastic Ltd",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Moving 2 tons of packaged goods weekly from Gazipur to Chittagong Port terminal. Zero breakage in 8 months of consistent dispatch.",
        verified: true,
      },
    ],
  },
  {
    id: "cold-chain",
    title: "Cold-Chain Perishable Transit",
    tagline: "Active Temperature-Controlled Logistics (-18°C to +4°C)",
    category: "Cold Chain",
    coverage: "Divisional Gateways & Specialized Depots",
    locationArea: "divisional-gateways",
    badge: "Temperature Controlled",
    price: 180,
    priceDisplay: "From ৳180 / kg",
    priceTier: "standard",
    rating: 4.9,
    reviewCount: 144,
    sla: "12 - 24 Hours",
    speedHours: 20,
    description:
      "Refrigerated transport for temperature-sensitive pharmaceuticals, vaccines, fresh dairy, and frozen foods with continuous data logging.",
    longDescription:
      "Waypoint Cold-Chain maintains strict thermal integrity using dual-compressor refrigerated vehicles and PCM thermal boxes. Continuous wireless temperature sensors record microclimate data every 60 seconds, ensuring verifiable cold-chain compliance upon arrival at hospitals, pharmacies, or distributors.",
    image:
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Active chilling ranges: +2°C to +8°C (Pharma) / -18°C (Frozen)",
      "Continuous IoT data-logger with verifiable graph printouts",
      "Priority express line-haul loading at all central sorting hubs",
      "Specialized thermal packaging and ice pack re-icing support",
    ],
    specifications: {
      maxWeight: "Up to 50 kg per insulated unit",
      volumetricFormula: "Net insulated compartment volume",
      pickupCutoff: "15:00 (3:00 PM)",
      transitWindow: "12 – 24 Hours with thermal validation",
      insuranceCoverage: "Specialized Perishable Loss Policy up to ৳250,000",
      trackingUpdateFreq: "Real-time temperature telemetry & GPS alerts",
      securityVerification: "Recipient Bio-Seal Inspection & OTP",
      handlingType: "Active Refrigerated & Passive PCM",
    },
    popular: true,
    reviews: [
      {
        id: "rev-5",
        author: "Dr. Nazmul Huda",
        company: "Beximco Pharma Distribution",
        rating: 5,
        date: "1 month ago",
        comment:
          "The thermal telemetry logs are accepted directly by our quality assurance auditors. Outstanding cold-chain integrity across inter-district runs.",
        verified: true,
      },
    ],
  },
  {
    id: "ecommerce-cod",
    title: "E-Commerce COD & Automated Settlement",
    tagline: "Frictionless Cash on Delivery with Next-Day Remittance",
    category: "E-Commerce COD",
    coverage: "All 64 Districts",
    locationArea: "all-bangladesh",
    badge: "1% COD Fee",
    price: 70,
    priceDisplay: "From ৳70 + 1% COD",
    priceTier: "budget",
    rating: 4.8,
    reviewCount: 562,
    sla: "24 - 48 Hours",
    speedHours: 30,
    description:
      "Bangladesh's most dependable Cash on Delivery network with instant OTP cash handshake and automated daily BEFTN / MFS remittances.",
    longDescription:
      "Built specifically for online social commerce (F-Commerce) and e-commerce platforms. Our COD solution combines guaranteed cash collection by trained couriers with next-business-day bank (BEFTN) or MFS (bKash/Nagad) automated payouts, eliminating cashflow choke points for growing businesses.",
    image:
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Transparent 1% COD collection fee with zero hidden surcharges",
      "Automated next-day payouts via BEFTN, bKash, or Nagad",
      "Digital OTP handshake verifies cash collection before parcel release",
      "Live merchant financial reconciliation dashboard",
    ],
    specifications: {
      maxWeight: "Up to 25 kg per order",
      volumetricFormula: "L × W × H (cm) / 5000",
      pickupCutoff: "18:00 (6:00 PM)",
      transitWindow: "24 – 48 Hours nationwide",
      insuranceCoverage: "Transit + Cash Collection Guarantee up to ৳50,000",
      trackingUpdateFreq: "Scan-point updates + SMS delivery alerts",
      securityVerification: "Recipient OTP Handshake & Instant Remittance SMS",
      handlingType: "Retail Parcel Barcoded Polymailers",
    },
    popular: true,
    reviews: [
      {
        id: "rev-6",
        author: "Sabrina Yasmin",
        company: "Khadim Shoes & Leather",
        rating: 5,
        date: "4 days ago",
        comment:
          "COD settlements arrive in our City Bank account by 11:00 AM every business day like clockwork. Cash flow anxiety is completely gone.",
        verified: true,
      },
    ],
  },
  {
    id: "document-rush",
    title: "Secure Document & Legal Courier",
    tagline: "Tamper-Evident Envelopes with OTP Handshake",
    category: "Document Rush",
    coverage: "Nationwide Express Desks",
    locationArea: "all-bangladesh",
    badge: "Tamper-Evident",
    price: 50,
    priceDisplay: "From ৳50 Flat",
    priceTier: "budget",
    rating: 4.9,
    reviewCount: 224,
    sla: "12 - 24 Hours",
    speedHours: 18,
    description:
      "Confidential document delivery in heavy-duty tamper-evident envelopes with end-to-end chain of custody audit trails for banks and legal firms.",
    longDescription:
      "Waypoint Document Express guarantees strict privacy and chain-of-custody verification. Envelopes feature unique serialized barcodes, tamper-indicating adhesive seals, and digital recipient signature capture with OTP verification for passports, deeds, banking instruments, and tender submissions.",
    image:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Heavy-duty serialized tamper-evident security envelopes",
      "Digital recipient signature capture and timestamp audit trail",
      "Dedicated lockbox transit inside courier line-haul fleet",
      "Zero-opening guarantee verified at delivery point",
    ],
    specifications: {
      maxWeight: "Up to 2 kg per document packet",
      volumetricFormula: "Standard A4 / Legal security pouches",
      pickupCutoff: "18:00 (6:00 PM)",
      transitWindow: "12 – 24 Hours nationwide",
      insuranceCoverage: "Document Reconstruction Reimbursement up to ৳20,000",
      trackingUpdateFreq: "High-priority node scans at dispatch & arrival",
      securityVerification: "National ID / OTP & Digital Signature",
      handlingType: "Waterproof Serialized Tamper-Pouch",
    },
    popular: false,
    reviews: [
      {
        id: "rev-7",
        author: "Barrister Rafiq Ahmed",
        company: "Supreme Court Chamber",
        rating: 5,
        date: "3 weeks ago",
        comment:
          "The serialized security pouch and mandatory OTP delivery guarantee that legal briefs reach respondents securely and on time.",
        verified: true,
      },
    ],
  },
  {
    id: "air-cargo",
    title: "Air Express Domestic Cargo",
    tagline: "Same-Day Airport-to-Airport Priority Flights",
    category: "Express Courier",
    coverage: "Dhaka, Chittagong, Sylhet, Cox's Bazar, Saidpur",
    locationArea: "divisional-gateways",
    badge: "Fastest Transit",
    price: 250,
    priceDisplay: "From ৳250 / kg",
    priceTier: "enterprise",
    rating: 4.8,
    reviewCount: 168,
    sla: "6 - 12 Hours",
    speedHours: 10,
    description:
      "Domestic scheduled air freight for ultra-critical consignments connecting Hazrat Shahjalal International with regional airports.",
    longDescription:
      "When highway transit is not fast enough, Waypoint Air Express books scheduled cargo space on domestic daily passenger and freighter flights. Parcels receive expedited security screening at terminal airside checkpoints and rapid last-mile courier transfer upon landing.",
    image:
      "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Scheduled daily flight allocations on Biman & US-Bangla",
      "Dedicated airside customs and airport cargo ramp transfer",
      "Terminal-to-door courier dispatch within 90 minutes of touchdown",
      "High-value priority handling for electronics and urgent spare parts",
    ],
    specifications: {
      maxWeight: "Up to 40 kg per package",
      volumetricFormula: "IATA Air Standard: L × W × H (cm) / 6000",
      pickupCutoff: "11:00 (11:00 AM) for morning flight dispatch",
      transitWindow: "6 – 12 Hours inter-city",
      insuranceCoverage: "Aviation Transit Policy up to ৳500,000",
      trackingUpdateFreq: "Flight manifest loading & touchdown scans",
      securityVerification: "Civil Aviation Security Screening & OTP",
      handlingType: "Air Freight Certified Carton",
    },
    popular: false,
    reviews: [
      {
        id: "rev-8",
        author: "Asif Chowdhury",
        company: "Chittagong Marine Spares",
        rating: 5,
        date: "2 months ago",
        comment:
          "Critical engine parts from Dhaka to Chittagong port in 7 hours saved a cargo vessel thousands in demurrage fees. Incredible reliability.",
        verified: true,
      },
    ],
  },
  {
    id: "reverse-logistics",
    title: "Reverse Logistics & Exchange Delivery",
    tagline: "Automated Customer Returns & QC Verification",
    category: "E-Commerce COD",
    coverage: "All 64 Districts",
    locationArea: "all-bangladesh",
    badge: "Exchange Flow",
    price: 65,
    priceDisplay: "From ৳65 Flat",
    priceTier: "budget",
    rating: 4.7,
    reviewCount: 289,
    sla: "24 - 48 Hours",
    speedHours: 36,
    description:
      "Seamless customer return management with doorstep quality inspection, reverse barcode labels, and automated warehouse return dispatch.",
    longDescription:
      "Convert return headaches into customer loyalty. Waypoint Reverse Logistics empowers couriers to conduct doorstep quality checks (size check, intact tags) while simultaneously delivering replacement items, cutting return cycle times in half for fashion and footwear brands.",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Doorstep product verification against return reasons",
      "Simultaneous replacement delivery & defective item pickup",
      "Direct return routing to merchant central fulfillment depot",
      "Real-time customer refund approval webhook triggers",
    ],
    specifications: {
      maxWeight: "Up to 15 kg per return parcel",
      volumetricFormula: "L × W × H (cm) / 5000",
      pickupCutoff: "17:00 (5:00 PM)",
      transitWindow: "24 – 48 Hours to merchant warehouse",
      insuranceCoverage: "Included up to ৳10,000",
      trackingUpdateFreq: "Pickup QC inspection scan & warehouse intake",
      securityVerification: "Merchant QC Checklist & Customer OTP",
      handlingType: "Resealable Return Pouch",
    },
    popular: false,
    reviews: [
      {
        id: "rev-9",
        author: "Nabila Karim",
        company: "StyleHub BD",
        rating: 5,
        date: "3 weeks ago",
        comment:
          "Our return processing time dropped from 7 days to 48 hours. The courier checking size tags at the door prevented fraudulent returns completely.",
        verified: true,
      },
    ],
  },
];

export function getServiceById(id: string): ServiceItem | undefined {
  return LOGISTICS_SERVICES.find((s) => s.id === id);
}

export function getFeaturedServices(): ServiceItem[] {
  return LOGISTICS_SERVICES.filter((s) => s.popular).slice(0, 4);
}
