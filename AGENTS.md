# 🎨 Waypoint — Frontend Architecture & Guidelines

This document is read by AI coding agents (and human contributors) working on the Waypoint logistics platform frontend. It defines what to build with, what to decide vs. what's already decided, and what requires explicit confirmation before acting.

---

## 1. Tech Stack & Core Libraries

- **Framework:** Next.js (App Router)
- **Data Fetching & State:** TanStack Query (React Query)
- **Form Management:** TanStack Form with Zod validation
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Real-time:** [DECIDE — see Section 8]

---

## 2. Safety Guardrails (Critical — read first)

These require explicit user confirmation before proceeding. Do not infer consent from a general task description.

- Never modify authentication, token, or session logic without explicit confirmation — even as a side effect of another change.
- Never touch payment, billing, or invoicing code paths without explicit confirmation.
- Never commit `.env`, `.env.local`, API keys, or any credential-bearing file.
- Never delete files or drop generated data without explicit confirmation.
- Any change touching PII (customer addresses, phone numbers, courier location history, delivery photos) needs a one-line flag in the response, even if the change itself was requested.
- If a task requires choosing between two reasonable approaches and this doc doesn't decide it, ask — don't silently pick one (see Section 9, "Decisions").

---

## 3. Strict UI & Styling Rules

- **shadcn/ui First:** Always import and use components from shadcn/ui for interactive or standard UI elements (Buttons, Inputs, Dialogs, Cards, etc.). Don't build these primitives from scratch unless shadcn/ui has no equivalent.
- **No Arbitrary Tailwind Values (default):** Avoid arbitrary value classes (e.g., `w-[100px]`, `text-[#123456]`). Use canonical theme tokens (`w-24`, `max-w-xs`, `text-muted-foreground`).
  - **Exception:** Arbitrary values are allowed for pixel-exact requirements that can't be expressed in the token scale — map overlay positioning, SVG/icon alignment, brand asset dimensions. When used, add a one-line comment explaining why the token scale didn't fit.
- **Conditional Styling:** Use the `cn()` utility (`@/lib/utils`) for merging Tailwind classes dynamically.
- **Responsive Design:** Mobile-first, using standard breakpoints (`sm:`, `md:`, `lg:`, `xl:`). Given the BD user base, assume a meaningful share of traffic is on slower mobile connections — avoid heavy client-side bundles on first-load routes.

---

## 4. Data Fetching & Server Communication

- **TanStack Query:** Always use `useQuery` / `useMutation` for backend communication. Never plain `fetch`/`axios` inside `useEffect`.
- **Query Key Schema (fixed — do not improvise per feature):**
  ```
  [domain, resource, scope, ...params]
  // e.g.
  ['shipments', 'list', { status, page }]
  ['shipments', 'detail', shipmentId]
  ['couriers', 'list', { region }]
  ```
  Filters and pagination params are part of the key, not separate state. If a new domain needs a key, follow this shape — don't invent a new pattern.
- **API Client:** Centralized client (Axios or fetch wrapper) that auto-attaches `Authorization: Bearer <token>`.
- **Retry/Resilience:** Given inconsistent mobile network conditions in the target market, configure TanStack Query with retry + exponential backoff on network errors (not on 4xx). Don't leave this at library defaults without deciding it.
- **Error Handling:** Backend returns a structured validation error envelope.
  - Field-level errors → map to TanStack Form field errors, shown inline under the field.
  - Non-field errors (auth failures, server errors, conflict errors) → toast notification.
  - Don't mix the two per-form; pick one per error type, consistently.

---

## 5. Form Management & Validation

- **TanStack Form** for all form state.
- **Zod Validation (strict):** Every form backed by a Zod schema matching backend requirements (e.g., `receiverPhone` matches `^01[3-9]\d{8}$`).
- **Type Inference:** `type FormValues = z.infer<typeof schema>` — no redundant interface declarations.

---

## 6. File Uploads

Used for proof-of-delivery photos, ID/KYC verification, and courier documents.

- **Method:** [DECIDE — presigned URL direct-to-storage, or proxied through backend]
- **Limits:** [DECIDE — max size, accepted MIME types per upload type]
- **Client behavior:** Validate type/size client-side before upload attempt; show upload progress for anything over ~1MB; never block form submission on upload completion without a visible loading state.

---

## 7. Directory Structure & Consistency

```text
src/
├── app/                  # Next.js App Router pages, layouts, loading states
├── components/
│   ├── ui/               # Raw shadcn/ui primitives
│   └── common/           # Shared reusable composition components (Navbars, Footers)
├── features/             # Domain-driven feature slices (shipment, auth, dashboard, tracking)
│   ├── shipment/
│   │   ├── components/
│   │   ├── api/          # TanStack queries and mutations
│   │   └── schemas/      # Zod validation schemas
│   └── ...
├── lib/                  # Shared utilities (cn, API client setup)
├── hooks/                # Custom reusable React hooks
├── types/                # Global TypeScript definitions
└── store/                # Global state (if any, e.g., Zustand)
```

New domains follow the same `features/<domain>/{components,api,schemas}` shape. Don't restructure an existing feature slice without flagging it.

---

## 8. Real-Time / Live Tracking

Courier location and shipment status updates are core to the product and are **not** a good fit for TanStack Query's pull-based caching alone.

- **Mechanism:** [DECIDE — WebSocket connection, SSE, or short-interval polling as fallback]
- **State ownership:** Live location/status state lives outside the TanStack Query cache (e.g., a dedicated store or a query with a `refetchInterval` explicitly justified as a stopgap, not the long-term mechanism).
- **Reconnection:** Define behavior on connection drop — silent retry with backoff, plus a visible "reconnecting" indicator for the user; don't fail silently.
- **Map rendering:** [DECIDE — mapping library, e.g., Mapbox/Leaflet/Google Maps — and confirm it's compatible with the licensing/cost model for BD-scale traffic before adopting]

---

## 9. Authentication & Roles

- **Role-Based UI:** UI adapts to role (`CUSTOMER`, `COURIER`, `ADMIN`) via a centralized auth hook/context.
- **Protected Routes:** Unauthenticated users redirect to `/login`. Users cannot access another role's dashboard, even via direct URL.
- **Token Storage:** [DECIDE — httpOnly cookie vs. local storage. This must be picked once and applied everywhere; don't let it vary by feature or by which agent session built it.]

---

## 11. Code Quality & Git Strategy

- **TypeScript Strict Mode:** `any` is forbidden.
- **Component Anatomy:** Small, modular, single-responsibility components.
- **Commits:** Conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`). Code must lint and format successfully before pushing.

# Waypoint Frontend Implementation Plan

This plan details the implementation strategy for the Waypoint logistics platform frontend.

## Approved Architecture Decisions

> [!NOTE]
> Based on user feedback, the following key decisions have been made:
>
> 1. **Token Storage:** HTTP-only cookies will be used for security.
> 2. **Real-time Updates:** Manual shipment status updates (no WebSockets/SSE for now).
> 3. **File Uploads:** UploadThing integration.
> 4. **Map Rendering:** Deferred to future iterations.
> 5. **Repository Strategy:** The frontend will be housed in a completely separate repository.

## Proposed Architecture & Structure

### Tech Stack

- **Framework**: Next.js (App Router)
- **Data Fetching**: TanStack Query (React Query)
- **Forms & Validation**: TanStack Form + Zod
- **UI Components**: shadcn/ui + Tailwind CSS

### Directory Structure

```text
src/
├── app/
│   ├── (auth)/           # /login, /register
│   ├── (dashboard)/
│   │   ├── admin/        # Admin routes
│   │   ├── courier/      # Courier routes
│   │   └── customer/     # Customer routes
│   ├── profile/          # Profile management
│   └── layout.tsx        # Root layout with providers
├── components/
│   ├── ui/               # shadcn/ui primitives
│   └── common/           # Shared components (Sidebar, Navbar)
├── features/
│   ├── auth/             # Login, Register, Google OAuth hooks
│   ├── shipments/        # Booking, Listing, Tracking, Courier assignment
│   ├── hubs/             # Hub CRUD
│   ├── analytics/        # Charts and Metric cards
│   └── users/            # Profile and user management
├── lib/
│   ├── api.ts            # Axios instance with interceptors
│   ├── utils.ts          # Tailwind cn() utility
│   └── query-client.ts   # TanStack Query configuration
└── types/
```

## Features & Pages

### 1. Authentication & Onboarding

- **Pages**: `/login`, `/register`
- **Features**:
  - Email/Password login and registration (Customer/Courier roles).
  - Google OAuth integration.
  - Auth context to handle role-based redirection (e.g., redirecting an Admin away from the Customer dashboard).

### 2. Customer Portal (`/customer`)

- **`/customer/overview`**: Dashboard showing total spend, shipment counts, and a breakdown of delivered statuses.
- **`/customer/book`**: Form to book a new parcel (Receiver Name, Phone, Weight). Uses TanStack Form + Zod.
- **`/customer/shipments`**: List of booked shipments. Includes a "Pay Now" button linking to Stripe Checkout if `paymentStatus` is `UNPAID`.
- **`/customer/shipments/[id]`**: Detailed view of a shipment's progress.

### 3. Courier Portal (`/courier`)

- **`/courier/overview`**: Dashboard displaying assigned deliveries, completed count, and completion rate.
- **`/courier/shipments`**: List of shipments assigned to them.
- **`/courier/shipments/[id]`**: Detailed view allowing status updates (`IN_TRANSIT` ➔ `DELIVERED`).

### 4. Admin Portal (`/admin`)

- **`/admin/overview`**: Platform-wide metrics (volume, revenue, success rate, charts for trends).
- **`/admin/hubs`**: Table view to list hubs, with a modal to Create/Edit/Delete hubs.
- **`/admin/shipments`**: Global list of shipments. Includes an action to assign a Courier and Hub to a `PENDING` shipment.
- **`/admin/users`**: List of all users. Ability to update user status (`BANNED`, `INACTIVE`, `ACTIVE`).
- **Export Reports**: Buttons to download CSV reports for shipments and payments.

### 5. Profile Management (`/profile`)

- Unified page for all roles to update their name, display username, avatar, and password.

## Verification Plan

### Automated Checks

- Run `bun run lint` and `bun run build` to ensure no TypeScript or Next.js build errors.
- Ensure Zod schemas match the backend validation requirements perfectly.

### Manual Verification

- **Auth Flow**: Register, login, and verify correct role redirection.
- **Customer Flow**: Book a shipment, proceed to Stripe checkout mock, verify shipment appears in list.
- **Admin Flow**: Create a hub, assign a courier to a shipment, view analytics.
- **Courier Flow**: View assigned shipment, update status to `IN_TRANSIT` and `DELIVERED`.
- **UI/UX**: Check responsiveness and dark mode compatibility across the shadcn/ui components.
