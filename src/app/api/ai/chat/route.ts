import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const OPENROUTER_MODEL = "nvidia/nemotron-3.5-super-vl:free";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const WAYPOINT_SYSTEM_PROMPT = `You are the Waypoint AI Logistics Copilot, the intelligent virtual assistant for Waypoint Logistics (Bangladesh's premier node-to-node consignment tracking and cross-dock distribution network).

Your role:
Assist customers, merchants, and couriers with parcel tracking, delivery rate calculation, service tier recommendations, hub information, Cash on Delivery (COD) policies, and general customer support across Bangladesh.

### Core Domain Knowledge:
1. Geographic Reach:
- 100% geographic coverage across all 64 Districts and 495+ Upazilas in Bangladesh.
- 8 Central Divisional Cross-Dock Gateways:
  * Dhaka: Central Sorting Gateway (Tejgaon Industrial Area)
  * Chittagong: Port Terminal Hub (Agrabad Commercial Area)
  * Sylhet: Zindabazar Express Terminal
  * Rajshahi: Bogra Crossdock & Shaheb Bazar
  * Khulna: Shibbari Divisional Gateway
  * Barishal: Sadhanar Mor River Terminal
  * Rangpur: Jahangirabad Northern Depot
  * Mymensingh: Ganginarpar Hub

2. Service Offerings & Pricing:
- Express Parcel Delivery (Next-Day Nationwide):
  * From ৳60 intra-city / ৳110 inter-district
  * Delivery window: 12 - 24 Hours
  * Full node-to-node barcode scanning, free transit insurance up to ৳5,000
- Same-Day City Transit (Within-Metro Rush):
  * From ৳120 flat in Dhaka and Chittagong Metro
  * Delivery window: 4 - 8 Hours
  * Direct point-to-point courier routing, live GPS tracking, OTP drop-off
- Hub-to-Hub Linehaul Freight (Heavy Cargo & Bulk B2B):
  * Bulk consignments 50kg+, custom volume discount tiers
  * Delivery window: 24 - 48 Hours
  * Containerized weather-sealed transit across national highway corridors
- Cash on Delivery (COD) & Automated Settlement:
  * 1% COD collection charge on collected amount
  * Next-business-day automated payouts via BEFTN, bKash, or Nagad
  * Recipient 4-digit OTP verification required before cash handover
- Cold-Chain & Perishable Transit:
  * Temperature-regulated (-18°C to +4°C) vans for pharmaceuticals and perishables

3. Consignment Tracking & 9-Stage FSM:
- 9 Statuses in order:
  1. PENDING (Order Booked)
  2. ASSIGNED (Courier Allocated)
  3. PICKED_UP (Collected by Courier)
  4. RECEIVED_AT_ORIGIN_HUB (Intake scan at origin hub)
  5. IN_TRANSIT (Line-haul highway transit between divisional hubs - omitted for LOCAL deliveries)
  6. RECEIVED_AT_DEST_HUB (Arrival scan at destination hub - omitted for LOCAL deliveries)
  7. OUT_FOR_DELIVERY (Out with rider for final recipient drop-off)
  8. DELIVERED (Handover completed with 4-digit OTP)
  9. CANCELLED (Terminal state with cancellation reason)
- Consignment tracking numbers typically format as 'WP-' followed by digits (e.g. WP-849201).
- Recipients can track live at: /track/[trackingNumber] (e.g. /track/WP-849201).

4. Operational Guidelines:
- Counter drop-off daily cutoff: 18:00 (6:00 PM) for guaranteed next-day dispatch.
- Customer Support Hotline: 09612-WAYPOINT (09612-92976468), 24/7 live desk.
- Support Email: support@waypoint.com.bd
- Head Office: Tejgaon Industrial Area, Dhaka-1208, Bangladesh.
- Prohibited goods: hazardous materials, firearms, currency notes, unsealed liquids, illegal contraband.

5. Behavioral Guidelines:
- Professional, knowledgeable, friendly, concise, and courteous.
- Always use Bangladeshi Taka (৳ / BDT) for currency.
- Use clean GitHub-flavored markdown (bullet points, bold text, clean spacing).
- If the user provides a tracking number like 'WP-XXXXX', provide helpful tracking information and encourage them to view live progress at /track/<trackingNumber>.
- Keep responses focused and readable without unnecessary filler.`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Intelligent domain fallback response generator when OpenRouter API is unavailable or rate-limited.
 */
function generateDomainFallback(userMessage: string): string {
  const q = userMessage.toLowerCase();

  // Tracking query
  const trackingMatch = userMessage.match(/WP-?\d{4,8}/i);
  if (trackingMatch || q.includes("track") || q.includes("consignment") || q.includes("status")) {
    const trackingCode = trackingMatch ? trackingMatch[0].toUpperCase() : "your consignment number";
    return `### 📦 Live Tracking Guidance\n\nFor **${trackingCode}**, Waypoint provides real-time node-to-node tracking:\n\n* **Active Status**: Enter or click the public tracking link: \`/track/${trackingMatch ? trackingMatch[0].toUpperCase() : "[trackingNumber]"}\`.\n* **9-Stage Lifecycle**: Consignments proceed through \`PENDING\` ➔ \`ASSIGNED\` ➔ \`PICKED_UP\` ➔ \`ORIGIN HUB\` ➔ \`IN_TRANSIT\` ➔ \`DEST HUB\` ➔ \`OUT_FOR_DELIVERY\` ➔ \`DELIVERED\`.\n* **Recipient Handover**: Deliveries require a 4-digit OTP sent to the recipient's phone number.\n\n*Need urgent rider assistance? Call our 24/7 hotline at **09612-WAYPOINT**.*`;
  }

  // Pricing / Rates query
  if (q.includes("rate") || q.includes("price") || q.includes("cost") || q.includes("fare") || q.includes("calculator")) {
    return `### 💰 Waypoint Shipping Rate Card\n\nHere are our standard transparent logistics rates across Bangladesh:\n\n* **Same-Day Metro Rush**: From **৳120** flat (Dhaka & Chittagong Metro, 4–8 hour SLA).\n* **Express Parcel Delivery**: From **৳60** (intra-city) / **৳110** (inter-district) for standard 1kg consignments (12–24 hour next-day SLA).\n* **Heavy Line-Haul Freight**: Volume discount tiers starting at **50kg+** connecting all 8 divisions.\n* **Cash on Delivery (COD)**: Flat **1% fee** on collected value with next-business-day bank / MFS payout.\n\n*You can calculate exact weights using our shipping estimator on the [Pricing Page](/pricing).*`;
  }

  // Cash on delivery query
  if (q.includes("cod") || q.includes("cash on delivery") || q.includes("payout") || q.includes("remittance")) {
    return `### 💳 Cash on Delivery (COD) Policy\n\n* **Collection Fee**: Transparent **1% COD fee** with zero hidden surcharges.\n* **Automated Settlement**: Daily automated remittance batches paid out via **BEFTN**, **bKash**, or **Nagad** on the next business day.\n* **Security Handshake**: Riders cannot complete a COD delivery without entering the recipient's secure **4-digit SMS OTP** and verifying the exact cash collected.`;
  }

  // Hubs / coverage query
  if (q.includes("hub") || q.includes("coverage") || q.includes("district") || q.includes("location") || q.includes("area") || q.includes("tejgaon") || q.includes("chittagong")) {
    return `### 🏢 64-District Hub Network & Coverage\n\nWaypoint connects **all 64 Districts** through **8 Central Cross-Dock Gateways**:\n\n* **Dhaka**: Tejgaon Central Sorting Gateway\n* **Chittagong**: Agrabad Port Terminal Depot\n* **Sylhet**: Zindabazar Express Cross-dock\n* **Rajshahi**: Bogra Highway Cross-dock & Shaheb Bazar\n* **Khulna**: Shibbari Divisional Gateway\n* **Barishal**: Sadhanar Mor River Terminal\n* **Rangpur**: Jahangirabad Northern Depot\n* **Mymensingh**: Ganginarpar Hub\n\n*Daily intake cutoff: **18:00 (6:00 PM)** for guaranteed next-day line-haul dispatch.*`;
  }

  // Booking query
  if (q.includes("book") || q.includes("send") || q.includes("ship") || q.includes("parcel") || q.includes("order")) {
    return `### 🚀 How to Book a Parcel with Waypoint\n\n1. Log into your [Customer Portal](/customer/book).\n2. Fill in the recipient details (Name, BD Mobile, District, Upazila).\n3. Select your delivery type (**LOCAL** or **INTER_DISTRICT**) and weight (kg).\n4. Choose payment: **Prepaid (Card)** or **Cash on Delivery (COD)**.\n5. Click **Confirm Booking** to generate your waybill and QR shipping label instantly!`;
  }

  // General fallback
  return `### 👋 Welcome to Waypoint Logistics\n\nI am your **AI Logistics Copilot**. How can I assist your supply chain today?\n\n* 📦 **Track a Parcel**: Type your consignment number (e.g. *WP-849201*)\n* 💰 **Calculate Rates**: Ask about shipping rates to any district\n* 🏢 **Hub Network**: Find cutoff times and gateways in all 64 districts\n* 💳 **COD Settlements**: Inquire about automated 1% COD payouts\n\n*You can also call our 24/7 hotline at **09612-WAYPOINT**.*`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawMessages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];

    // Extract the latest user query
    const latestUserMessage =
      [...rawMessages].reverse().find((m) => m.role === "user")?.content ||
      body?.prompt ||
      "";

    if (!latestUserMessage.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Message content cannot be empty",
          reply: "Please provide a query or tracking number so I can assist you.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // If API key is missing, return intelligent domain fallback immediately
    if (!apiKey) {
      const fallbackReply = generateDomainFallback(latestUserMessage);
      return NextResponse.json({
        success: true,
        reply: fallbackReply,
        model: "waypoint-domain-engine",
        fallback: true,
      });
    }

    // Build conversation history with domain system prompt
    const conversation: ChatMessage[] = [
      { role: "system", content: WAYPOINT_SYSTEM_PROMPT },
      // Include up to the last 6 messages for context
      ...rawMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // Ensure the latest message is in the payload if rawMessages was empty
    if (!rawMessages.length) {
      conversation.push({ role: "user", content: latestUserMessage });
    }

    // Call OpenRouter with NVIDIA Nemotron 3.5 Super VL model
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://waypoint.app",
        "X-Title": "Waypoint Logistics",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: conversation,
        temperature: 0.35,
        max_tokens: 800,
      }),
      // 15-second timeout to guarantee fast UX
      signal: AbortSignal.timeout(15000),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text().catch(() => "");
      console.warn(`[Waypoint AI] OpenRouter returned status ${openRouterResponse.status}: ${errorText}`);
      // Fallback gracefully to domain engine so the user is never left without an answer
      const fallbackReply = generateDomainFallback(latestUserMessage);
      return NextResponse.json({
        success: true,
        reply: fallbackReply,
        model: "waypoint-domain-engine",
        fallback: true,
      });
    }

    const data = await openRouterResponse.json();
    const assistantReply =
      data?.choices?.[0]?.message?.content?.trim() ||
      generateDomainFallback(latestUserMessage);

    return NextResponse.json({
      success: true,
      reply: assistantReply,
      model: OPENROUTER_MODEL,
      fallback: false,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Waypoint AI] Chat route error:", error?.message || error);

    // Resilient fallback on any network error, timeout, or parsing failure
    const fallbackReply = generateDomainFallback("help");
    return NextResponse.json({
      success: true,
      reply: fallbackReply,
      model: "waypoint-domain-engine",
      fallback: true,
    });
  }
}
