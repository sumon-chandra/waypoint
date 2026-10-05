# 🎨 Waypoint — Agent & Contributor Guidelines

> **Read this file fully before writing a single line of code.**
> This is the single source of truth for the Waypoint logistics platform frontend.
> The implementation task tracker lives in [`task.md`](./task.md) — not here.

---

## 0. Approved Architecture Decisions

All decisions below are **final**. Do not re-open them without explicit user confirmation.

| Concern | Decision |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Token / Session Storage** | HTTP-only cookies (set by the backend on login) |
| **Real-Time** | Socket.io Client (`socket.io-client`) — see Section 7 for full protocol |
| **File Uploads** | UploadThing (`@uploadthing/react`) |
| **Map Rendering** | Deferred — do not implement in current iterations |
| **Form Library** | TanStack Form + Zod |
| **Data Fetching** | TanStack Query v5 (`@tanstack/react-query`) |
| **UI Components** | shadcn/ui |
| **Styling** | Tailwind CSS (strict theme tokens only — no arbitrary bracket values) |
| **Icons** | Lucide React (`lucide-react`) |
| **Global Client State** | Zustand |
| **Repository** | Standalone frontend repo (separate from backend) |

---

## 1. Safety Guardrails ⚠️ (Read Before Every Task)

These require **explicit user confirmation** before acting — do not infer consent from a general task description.

- **Never** modify authentication, token, or session logic as a side effect of another change.
- **Never** touch payment, billing, or Stripe code paths without explicit confirmation.
- **Never** commit `.env`, `.env.local`, API keys, or any credential-bearing file.
- **Never** delete files or data without explicit confirmation.
- **PII Flag:** Any change touching customer addresses, phone numbers, OTP codes, or delivery photos → add a one-line PII notice in your response even if the change was requested.
- **Ask, don't guess:** If a task requires choosing between two reasonable approaches and this document doesn't decide it, ask the user.

---

## 2. API — Base URL & Response Envelope

### Base URL
```
https://waypointapi.vercel.app/api/v1
```

### Standard Success Envelope
Every endpoint returns this shape — no exceptions, no defensive fallback code:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {}
}
```
`data` is `{}` for single-resource responses, `[]` for lists, and `null` for void operations (e.g., logout).

### Paginated List Envelope
All list endpoints that support pagination return:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {
    "result": [],
    "meta": {
      "total": 120,
      "page": 1,
      "limit": 10,
      "totalPages": 12
    }
  }
}
```
Query params for pagination: `?page=1&limit=10`. Default `limit` is `10` unless specified.

### Error Envelopes

**Validation / Field Error (422):**
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    { "field": "receiverPhone", "message": "Invalid Bangladeshi phone number" },
    { "field": "weightKg", "message": "Weight must be a positive number" }
  ]
}
```
→ Map `errors[]` to TanStack Form field-level errors. Show inline under the input.

**Business Logic / Auth / Server Error (4xx / 5xx):**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Shipment cannot be cancelled after pickup"
}
```
→ Show as a `toast` notification. Do **not** show this in form field errors.

**Rule:** Never mix field errors and toast errors in the same error handler.

---

## 3. API Endpoint Contracts

> Use **exact** method, path, body fields, and `data` shape listed here. Do not invent alternatives.

### 3.1 Authentication

| Method | Path | Body | `data` Response | Role |
|---|---|---|---|---|
| `POST` | `/auth/register` | `{ name, email, password, role: 'CUSTOMER'\|'COURIER' }` | `User` | Public |
| `POST` | `/auth/login` | `{ email, password }` | `User` + sets httpOnly cookie | Public |
| `POST` | `/auth/logout` | — | `null` + clears cookie | Auth |
| `GET` | `/auth/me` | — | `User` | Auth |
| `GET` | `/auth/google` | — | OAuth redirect | Public |

### 3.2 Shipments

| Method | Path | Body | `data` Response | Role |
|---|---|---|---|---|
| `POST` | `/shipments` | `CreateShipmentBody` (see below) | `Shipment` | CUSTOMER |
| `GET` | `/shipments` | Query: `?page&limit&status&deliveryType` | `PaginatedResult<Shipment>` | All (auto-scoped by role) |
| `GET` | `/shipments/:id` | — | `ShipmentDetail` (with relations) | Owner / ADMIN |
| `GET` | `/shipments/track/:trackingNumber` | — | `ShipmentDetail` | Public |
| `POST` | `/shipments/:id/cancel` | `{ reason: string }` | `Shipment` | CUSTOMER (PENDING only) |
| `POST` | `/shipments/:id/resend-delivery-otp` | — | `null` | CUSTOMER |
| `PATCH` | `/shipments/:id/assign-courier` | `{ courierId: string }` | `Shipment` | ADMIN |
| `POST` | `/shipments/:id/origin-hub-checkin` | — | `Shipment` | ADMIN |
| `POST` | `/shipments/:id/dispatch-transit` | — | `Shipment` | ADMIN |
| `POST` | `/shipments/:id/dest-hub-checkin` | — | `Shipment` | ADMIN |
| `POST` | `/shipments/:id/pickup` | — | `Shipment` | COURIER |
| `POST` | `/shipments/:id/out-for-delivery` | — | `Shipment` | COURIER |
| `POST` | `/shipments/:id/complete-delivery` | `{ otp: string, cashCollected?: number }` | `Shipment` | COURIER |

**`CreateShipmentBody`:**
```ts
{
  receiverName: string        // required
  receiverPhone: string       // required, matches ^01[3-9]\d{8}$
  weightKg: number            // required, > 0
  deliveryType: DeliveryType  // 'LOCAL' | 'INTER_DISTRICT'
  paymentType: PaymentType    // 'CARD' | 'CASH'
  codAmount?: number          // required if paymentType === 'CASH', > 0
  senderAddress?: string
  senderDistrict?: string
  senderUpazila?: string
  receiverAddress?: string
  receiverDistrict?: string
  receiverUpazila?: string
}
```

**`ShipmentDetail` — relations included in `GET /shipments/:id` response `data`:**
```ts
Shipment & {
  customer: User | null
  courier: User | null
  originHub: Hub | null
  destinationHub: Hub | null
  trackingLogs: ShipmentTrackingLog[]
  payment: Payment | null
}
```

### 3.3 Hubs

| Method | Path | Body | `data` Response | Role |
|---|---|---|---|---|
| `GET` | `/hubs` | Query: `?page&limit&status&district` | `PaginatedResult<Hub>` | Auth |
| `GET` | `/hubs/:id` | — | `Hub` | Auth |
| `POST` | `/hubs` | `CreateHubBody` (see below) | `Hub` | ADMIN |
| `PATCH` | `/hubs/:id` | `Partial<CreateHubBody>` | `Hub` | ADMIN |
| `DELETE` | `/hubs/:id` | — | `null` | ADMIN |

**`CreateHubBody`:**
```ts
{
  code: string       // unique short code, e.g. "CTG-01"
  name: string
  district: string
  division: string
  upazila: string
  address: string
  cutoff: string     // e.g. "18:00"
  capacity: number   // integer
  phone: string      // BD phone, matches ^01[3-9]\d{8}$
  isGateway?: boolean
  status?: HubStatus // 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  latitude?: number
  longitude?: number
}
```

### 3.4 Users

| Method | Path | Body | `data` Response | Role |
|---|---|---|---|---|
| `GET` | `/users` | Query: `?page&limit&role&status` | `PaginatedResult<User>` | ADMIN |
| `GET` | `/users/:id` | — | `User` | ADMIN / Self |
| `PATCH` | `/users/:id` | `{ name?, displayUsername?, avatar? }` | `User` | Self (profile update) |
| `PATCH` | `/users/:id/status` | `{ status: UserStatus, banReason?: string, banExpires?: string }` | `User` | ADMIN |

### 3.5 Payments

| Method | Path | Body | `data` Response | Role |
|---|---|---|---|---|
| `POST` | `/payments/create-checkout-session` | `{ shipmentId: string }` | `{ url: string }` | CUSTOMER |
| `GET` | `/payments` | Query: `?page&limit` | `PaginatedResult<Payment>` | CUSTOMER (own) |

---

## 4. Backend Data Models (Source of Truth)

Use these **exact field names** everywhere — TypeScript types, Zod schemas, UI labels, API calls. Never alias them.

```prisma
enum Role           { ADMIN CUSTOMER COURIER }
enum UserStatus     { ACTIVE INACTIVE BANNED }
enum HubStatus      { ACTIVE INACTIVE MAINTENANCE }
enum PaymentType    { CARD CASH }
enum PaymentStatus  { UNPAID PENDING PAID FAILED EXPIRED }
enum DeliveryType   { LOCAL INTER_DISTRICT }
enum ShipmentStatus {
  PENDING ASSIGNED PICKED_UP
  RECEIVED_AT_ORIGIN_HUB IN_TRANSIT RECEIVED_AT_DEST_HUB
  OUT_FOR_DELIVERY DELIVERED CANCELLED
}

model User {
  id               String      // UUID
  name             String
  email            String      // unique
  username         String?     // unique
  displayUsername  String?
  password         String?
  avatar           String?
  role             Role
  status           UserStatus
  googleId         String?
  emailVerified    Boolean
  banned           Boolean?
  banReason        String?
  banExpires       DateTime?
  stripeCustomerId String?
  hubId            String?     // courier's assigned hub
  createdAt        DateTime
  updatedAt        DateTime
}

model Shipment {
  id               String
  trackingNumber   String         // unique, public-facing
  receiverName     String
  receiverPhone    String
  weightKg         Float
  status           ShipmentStatus
  paymentType      PaymentType
  paymentStatus    PaymentStatus
  codAmount        Float?         // only if paymentType === 'CASH'
  senderAddress    String?
  senderDistrict   String?
  senderUpazila    String?
  receiverAddress  String?
  receiverDistrict String?
  receiverUpazila  String?
  deliveryType     DeliveryType
  customerId       String
  courierId        String?
  originHubId      String?
  destinationHubId String?
  createdAt        DateTime
  updatedAt        DateTime
}

model ShipmentTrackingLog {
  id         String
  shipmentId String
  fromStatus ShipmentStatus?
  toStatus   ShipmentStatus
  action     String
  actorId    String
  location   String?
  notes      String?
  createdAt  DateTime
}

model Hub {
  id        String
  code      String     // unique, e.g. "DHK-01"
  name      String
  district  String
  division  String
  upazila   String
  address   String
  cutoff    String     // "HH:mm" format
  capacity  Int
  phone     String
  isGateway Boolean
  status    HubStatus
  latitude  Float?
  longitude Float?
  createdAt DateTime
  updatedAt DateTime
}

model Payment {
  id                    String
  amount                Float
  currency              String        // default "usd"
  status                PaymentStatus
  stripeSessionId       String?
  stripePaymentIntentId String?
  stripeCustomerId      String?
  paymentMethod         String?       // default "card"
  shipmentId            String        // unique
  customerId            String
  createdAt             DateTime
  updatedAt             DateTime
}
```

### Anti-Speculation Rules

- **Exact field names only.** Never invent aliases (`recipientName` for `receiverName`, `trackingId` for `trackingNumber`).
- **One endpoint, one shape.** Do not write fallback chains guessing response formats.
- **Nullables are nullable.** If a field is `String?` in Prisma, type it as `string | null` in TypeScript — never fill with a hardcoded default like `"N/A"`.
- **No normalizer bloat.** Cast API responses directly to types — don't write 50-line mapping functions.
- **Ask, don't guess.** If a field or endpoint is unclear, stop and ask — don't write defensive code for multiple hypothetical shapes.

---

## 5. TypeScript Type Catalog

All shared types live in `src/types/`. Do not duplicate types inside feature folders.

```
src/types/
├── api.ts        → ApiResponse<T>, PaginatedResult<T>, PaginatedMeta
├── user.ts       → User, Role, UserStatus
├── shipment.ts   → Shipment, ShipmentDetail, ShipmentStatus, DeliveryType, ShipmentTrackingLog
├── hub.ts        → Hub, HubStatus
├── payment.ts    → Payment, PaymentStatus, PaymentType
└── index.ts      → re-exports all of the above
```

**Canonical utility types (`src/types/api.ts`):**
```ts
export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResult<T> {
  result: T[]
  meta: PaginatedMeta
}
```

**Rules:**
- `type FormValues = z.infer<typeof schema>` — no redundant interface declarations alongside Zod schemas.
- `any` is **forbidden**. Use `unknown` and narrow with type guards.
- Never re-declare a type that already exists in `src/types/`.

---

## 6. Directory Structure & Naming Conventions

```text
src/
├── app/
│   ├── (auth)/                   # /login, /register
│   │   └── layout.tsx
│   ├── (dashboard)/              # Role-guarded layouts
│   │   ├── layout.tsx            # Sidebar + auth guard wrapper
│   │   ├── admin/                # /admin — overview, hubs, shipments, users
│   │   ├── courier/              # /courier — overview, shipments, [id]
│   │   └── customer/             # /customer — overview, book, shipments, [id]
│   ├── track/
│   │   └── [trackingNumber]/     # Public live tracking (no auth required)
│   ├── payment/
│   │   ├── success/              # Stripe return: /payment/success?session_id=...
│   │   └── cancel/               # Stripe cancel return
│   ├── (public)/                 # Landing page, marketing
│   ├── layout.tsx                # Root layout (Providers, fonts, metadata)
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui primitives only — never modify these
│   └── common/                   # Shared compositions: Sidebar, Navbar, StatusBadge,
│                                 # DeliveryStepper, DataTable, EmptyState, PageHeader
├── features/
│   ├── auth/
│   │   ├── components/           # LoginForm, RegisterForm
│   │   ├── api/                  # useLogin, useRegister, useLogout, useMe
│   │   ├── context/              # AuthContext, AuthProvider
│   │   └── schemas/              # loginSchema, registerSchema
│   ├── shipments/
│   │   ├── components/           # ShipmentTable, ShipmentCard, TrackingTimeline,
│   │   │                         # BookingForm, CancelDialog, CompleteDeliveryModal
│   │   ├── api/                  # useShipments, useShipment, useCreateShipment,
│   │   │                         # usePickup, useOutForDelivery, useCompleteDelivery,
│   │   │                         # useCancelShipment, useAssignCourier, useHubCheckins
│   │   └── schemas/              # createShipmentSchema, cancelShipmentSchema,
│   │                             # completeDeliverySchema, assignCourierSchema
│   ├── hubs/
│   │   ├── components/           # HubTable, HubForm, HubDialog
│   │   ├── api/                  # useHubs, useHub, useCreateHub, useUpdateHub, useDeleteHub
│   │   └── schemas/              # createHubSchema
│   ├── users/
│   │   ├── components/           # UserTable, UpdateStatusDialog, ProfileForm
│   │   ├── api/                  # useUsers, useUser, useUpdateUserStatus, useUpdateProfile
│   │   └── schemas/              # updateStatusSchema, updateProfileSchema
│   ├── payments/
│   │   ├── api/                  # useCreateCheckoutSession, usePayments
│   │   └── components/           # PaymentStatusBadge
│   ├── analytics/
│   │   └── components/           # KpiCard, RevenueChart, ShipmentVolumeChart
│   └── tracking/
│       ├── components/           # LiveTrackingFeed, TrackingAuditLog
│       └── hooks/                # useTrackingSocket
├── lib/
│   ├── api-client.ts             # Axios instance — auto-attaches cookies, handles 401
│   ├── socket.ts                 # Socket.io singleton (autoConnect: false)
│   ├── query-client.ts           # TanStack Query global config (retry, staleTime)
│   ├── query-keys.ts             # All TanStack Query key factories (see Section 10)
│   └── utils.ts                  # cn() and other shared utilities
├── hooks/
│   ├── use-auth.ts               # useAuth() — session, role, redirect helpers
│   └── use-socket.ts             # Global WebSocket lifecycle hook
├── store/
│   └── ui-store.ts               # Zustand: modal open states, notification count, sidebar
└── types/
    ├── api.ts
    ├── user.ts
    ├── shipment.ts
    ├── hub.ts
    ├── payment.ts
    └── index.ts
```

### Component & File Naming Rules

| Type | Convention | Example |
|---|---|---|
| Component file | PascalCase | `ShipmentTable.tsx`, `BookingForm.tsx` |
| One default export per file | Same name as file | `export default function ShipmentTable()` |
| Hook file | kebab-case prefixed `use-` | `use-auth.ts`, `use-socket.ts` |
| Zod schema file | camelCase + `Schema` suffix | `createShipmentSchema.ts` |
| Page files | `page.tsx` (Next.js convention) | lowercase always |
| Utility / lib files | kebab-case | `api-client.ts`, `query-keys.ts` |

No barrel re-exports inside feature folders unless exposing a feature's public API to other features.

---

## 7. Real-Time — Socket.io Protocol

Socket.io is **the** real-time layer. Do not use polling as a substitute.

### Client Singleton (`src/lib/socket.ts`)
```typescript
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,       // Connect explicitly — never auto-connect on import
  withCredentials: true,    // Required for httpOnly cookie auth
  transports: ["websocket", "polling"],
});
```

### Connection Rules
- Connect inside `AuthProvider` **after** a successful `GET /auth/me`.
- Disconnect and clear `socket.auth` on logout.
- For the public tracking page (`/track/[trackingNumber]`) — connect without credentials.
- Every `socket.on(...)` call inside a `useEffect` **must** return a cleanup with `socket.off(...)`.

### Room Subscriptions

#### A. Public Tracking Page (`/track/[trackingNumber]`)
```typescript
useEffect(() => {
  if (!trackingNumber) return;
  socket.connect();
  socket.emit("join_tracking_room", { trackingNumber });

  socket.on("shipment:status_changed", () => {
    queryClient.invalidateQueries({ queryKey: shipmentKeys.track(trackingNumber) });
  });

  return () => {
    socket.emit("leave_tracking_room", { trackingNumber });
    socket.off("shipment:status_changed");
    socket.disconnect();
  };
}, [trackingNumber]);
```

#### B. Authenticated Notification Stream (all roles)
```typescript
// Inside AuthProvider, after confirming session
socket.auth = { token: `Bearer ${accessToken}` };
socket.connect();

socket.on("notification", (payload: { title: string; message: string }) => {
  toast({ title: payload.title, description: payload.message });
  queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
});

// Admin-only live dispatch events
socket.on("admin:shipment_event", () => {
  queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
});
```

### Reconnection Behavior
- Silent retry with exponential backoff (Socket.io default).
- Show a visible `"Reconnecting…"` indicator in the UI — do **not** fail silently.

---

## 8. Shipment FSM — UI Rendering Rules

> ⚠️ Most domain-critical UI logic in the codebase. Read fully before building any stepper or tracking component.

The backend enforces a 9-stage Finite State Machine. The frontend stepper **branches on `shipment.deliveryType`**.

### Status → UI Badge Mapping

| `status` | UI Label | Badge Variant |
|---|---|---|
| `PENDING` | Order Placed | `secondary` (Yellow) |
| `ASSIGNED` | Courier Assigned | `outline` (Blue) |
| `PICKED_UP` | Parcel Collected | `default` (Sky) |
| `RECEIVED_AT_ORIGIN_HUB` | In Origin Hub | `secondary` (Amber) |
| `IN_TRANSIT` | In Line-Haul Transit | `default` (Indigo) |
| `RECEIVED_AT_DEST_HUB` | At Destination Hub | `secondary` (Purple) |
| `OUT_FOR_DELIVERY` | Out for Delivery | `default` (Orange) |
| `DELIVERED` | Delivered | `default` (Green) |
| `CANCELLED` | Cancelled | `destructive` (Red) |

### Dynamic Stepper: `LOCAL` Delivery (5 active steps)
```
PENDING → ASSIGNED → PICKED_UP → RECEIVED_AT_ORIGIN_HUB → OUT_FOR_DELIVERY → DELIVERED
```
- **Omit** `IN_TRANSIT` and `RECEIVED_AT_DEST_HUB` from the stepper entirely.
- Display tag: `Intra-Hub Local Delivery`.

### Dynamic Stepper: `INTER_DISTRICT` Delivery (8 active steps)
```
PENDING → ASSIGNED → PICKED_UP → RECEIVED_AT_ORIGIN_HUB → IN_TRANSIT → RECEIVED_AT_DEST_HUB → OUT_FOR_DELIVERY → DELIVERED
```
- Display the full 8 steps.
- Display tag: `Inter-District Line-Haul`.

### Cancelled State
`CANCELLED` is a **terminal state**. Render a distinct cancelled view — do not show it as a step in the stepper. Display the cancellation reason from `trackingLogs`.

---

## 9. COD & Stripe Payment Flows

### Booking Form — Payment Type Selection
- Radio group or segmented tabs: `CARD` vs `CASH`.
- If `CASH` → `codAmount` becomes **required** (positive number, BDT ৳). Show helper text: *"Our courier will collect this exact amount from the recipient upon delivery."*
- If `CARD` → on submit call `POST /payments/create-checkout-session { shipmentId }` → redirect to `data.url`.

### Stripe Return Pages
- `/payment/success?session_id=...` → confirm payment, show success state, link to shipment detail.
- `/payment/cancel` → show cancellation message, link back to `/customer/shipments`.

### Courier — Complete Delivery Modal
When `status === 'OUT_FOR_DELIVERY'`:

| `paymentType` | Modal Contents |
|---|---|
| `CASH` | ⚠️ Banner: `Collect Cash: ৳{codAmount}` + OTP input (4 digits) + cash collected field (must be `>= codAmount`) |
| `CARD` | Green badge: `Prepaid (Card)` + OTP input only |

- Use shadcn `InputOTP` primitive for the 4-digit input.
- Lock after 5 failed OTP attempts — show remaining attempts countdown.
- "Resend OTP" button with 60-second cooldown. Calls `POST /shipments/:id/resend-delivery-otp`.

---

## 10. Data Fetching — TanStack Query

### Query Key Factories (`src/lib/query-keys.ts`)

Use these factories everywhere — do not improvise per component or feature.

```typescript
export const shipmentKeys = {
  all:     ["shipments"] as const,
  lists:   () => [...shipmentKeys.all, "list"] as const,
  list:    (filters: Record<string, unknown>) => [...shipmentKeys.lists(), filters] as const,
  details: () => [...shipmentKeys.all, "detail"] as const,
  detail:  (id: string) => [...shipmentKeys.details(), id] as const,
  track:   (trackingNumber: string) => [...shipmentKeys.all, "track", trackingNumber] as const,
};

export const hubKeys = {
  all:     ["hubs"] as const,
  lists:   () => [...hubKeys.all, "list"] as const,
  list:    (filters: Record<string, unknown>) => [...hubKeys.lists(), filters] as const,
  details: () => [...hubKeys.all, "detail"] as const,
  detail:  (id: string) => [...hubKeys.details(), id] as const,
};

export const userKeys = {
  all:     ["users"] as const,
  lists:   () => [...userKeys.all, "list"] as const,
  list:    (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail:  (id: string) => [...userKeys.details(), id] as const,
  me:      () => [...userKeys.all, "me"] as const,
};

export const paymentKeys = {
  all:   ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list:  (filters: Record<string, unknown>) => [...paymentKeys.lists(), filters] as const,
};
```

### Query Client Config (`src/lib/query-client.ts`)
```typescript
import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,   // 1 minute
      retry: (failureCount, error) => {
        // Retry only on network errors — NOT on 4xx responses
        if (error instanceof AxiosError && error.response) return false;
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // exponential backoff
    },
  },
});
```

### Rules
- **Never** use `fetch` or `axios` directly inside a `useEffect`. Always use `useQuery` / `useMutation`.
- Pagination filters and sort params are part of the query key — not a separate `useState`.
- After a successful mutation, invalidate the relevant list key: `queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() })`.

---

## 11. Forms — Validation Rules

- All forms use **TanStack Form** + **Zod**.
- `type FormValues = z.infer<typeof schema>` — no redundant interfaces alongside schemas.
- Show Zod errors inline immediately below the input with class `text-destructive text-sm`.

### Critical Validation Rules (Apply Everywhere)

| Field | Rule |
|---|---|
| `receiverPhone`, `hub.phone` | `z.string().regex(/^01[3-9]\d{8}$/, "Invalid BD mobile number")` |
| `weightKg` | `z.number().positive()` |
| `codAmount` | `z.number().positive()` — required when `paymentType === 'CASH'` |
| `hub.code` | Uppercase, alphanumeric + hyphen, e.g. `CTG-01` |
| `otp` | `z.string().length(4).regex(/^\d{4}$/, "OTP must be 4 digits")` |
| `reason` (cancel) | `z.string().min(10, "Please provide a meaningful reason")` |
| District selectors | Populated from BD's 64 official administrative districts (static data) |
| Upazila selectors | Cascades dynamically from selected district |

---

## 12. UI & Styling Rules

- **shadcn/ui First:** Always use shadcn/ui primitives for buttons, inputs, dialogs, cards, tables, badges, sheets, tabs, toasts. Never rebuild these from scratch.
- **No Arbitrary Tailwind Values:**
  - **Forbidden:** `w-[320px]`, `h-[52px]`, `text-[#0284c7]`, `bg-[#1e293b]`
  - **Required:** Canonical tokens — `w-80`, `h-12`, `text-primary`, `bg-muted`
  - **Exception:** pixel-exact SVG/map positioning — add an inline comment explaining why the token scale doesn't fit.
- **Conditional Classes:** Always use `cn()` from `@/lib/utils` for all dynamic class merging.
- **Mobile-First:** All layouts start from mobile (`sm:`, `md:`, `lg:`). Couriers use budget Android devices on 3G — avoid heavy client bundles on first load.
- **Dark Mode:** All components must work in both light and dark modes using CSS variables from the shadcn/ui theme.

---

## 13. Loading, Skeleton & Empty States

Every data-dependent UI section must handle all three states — no exceptions.

| State | Implementation |
|---|---|
| **Loading** | shadcn `Skeleton` matching the shape of the loaded content (table rows, cards). Do **not** use a full-page spinner for data loading. |
| **Empty** | Shared `<EmptyState />` component from `components/common/` with icon, heading, and optional CTA. Example: *"No shipments yet"* + *"Book a Parcel"* button. |
| **Error** | shadcn `Alert` with `variant="destructive"` + a retry button calling `refetch()`. |

For mutations (form submit, action buttons): show a spinner inside the button using `isPending` from `useMutation`. Disable the button while `isPending`.

---

## 14. Authentication & Role-Based Routing

### Auth Flow
1. On app load, `AuthProvider` calls `GET /auth/me`.
2. On success → store user in context, connect Socket.io.
3. On 401 → redirect to `/login`.
4. After login → redirect by `user.role`:
   - `CUSTOMER` → `/customer`
   - `COURIER` → `/courier`
   - `ADMIN` → `/admin`

### Protected Routes
- `/customer/*` → `CUSTOMER` only
- `/courier/*` → `COURIER` only
- `/admin/*` → `ADMIN` only
- `/track/*` → **public**, no auth required
- A user navigating to another role's route redirects to their own dashboard.

### `useAuth()` Contract
```typescript
interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  role: Role | null
  isCustomer: boolean
  isCourier: boolean
  isAdmin: boolean
}
```

---

## 15. Code Quality & Pre-Commit Checklist

Run all of these before every commit — zero failures allowed:

1. `bunx tsc --noEmit` — zero TypeScript errors. `any` is forbidden.
2. `bun run lint` — zero ESLint errors or unused imports.
3. No arbitrary Tailwind bracket classes in changed files.
4. All `useEffect` socket listeners have `socket.off(...)` cleanup.
5. No `fetch`/`axios` calls inside `useEffect` — all fetching via TanStack Query.
6. No field name aliases — verify against Section 4 models.

### Commit Message Convention
Use conventional commits. Be specific:

```
feat(shipments): add COD complete-delivery modal with OTP and cash validation
fix(auth): correct redirect loop on 401 for public track route
feat(admin): implement assign-courier modal with courier search dropdown
chore(types): add PaginatedResult<T> and ApiResponse<T> to src/types/api.ts
refactor(shipments): extract DeliveryStepper into components/common
```

---

## 16. Current Implementation Status

> See [`task.md`](./task.md) for the live task tracker (what is done ✅, in progress 🔄, and remaining ⬜).

**Do not assume a feature is unbuilt just because it is mentioned in this document.**
Always check `task.md` and the existing `src/` directory before generating code for a feature.
