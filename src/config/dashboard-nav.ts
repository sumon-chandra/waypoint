import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Truck,
  Building2,
  PackageCheck,
  History,
  Users,
  Boxes,
  BarChart3,
  User,
  Settings,
} from "lucide-react";
import type { Role } from "@/features/auth/schemas/auth.schemas";

export interface DashboardNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
  exact?: boolean;
  description?: string;
}

export interface DashboardNavSection {
  title?: string;
  items: DashboardNavItem[];
}

export interface RoleDashboardMeta {
  role: Role;
  label: string;
  badgeLabel: string;
  rootPath: string;
  description: string;
  themeColor: {
    badge: string;
    accent: string;
  };
}

export const ROLE_DASHBOARD_METADATA: Record<Role, RoleDashboardMeta> = {
  CUSTOMER: {
    role: "CUSTOMER",
    label: "Customer Command Center",
    badgeLabel: "Customer Portal",
    rootPath: "/customer",
    description: "Manage bookings, consignments, and real-time tracking.",
    themeColor: {
      badge: "bg-primary/10 text-primary border-primary/20",
      accent: "text-primary",
    },
  },
  COURIER: {
    role: "COURIER",
    label: "Courier Fleet Operations",
    badgeLabel: "Courier Field App",
    rootPath: "/courier",
    description: "Accept pickups, update delivery statuses, and manage assigned runs.",
    themeColor: {
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      accent: "text-amber-500",
    },
  },
  ADMIN: {
    role: "ADMIN",
    label: "Platform Command Center",
    badgeLabel: "Admin Command",
    rootPath: "/admin",
    description: "Nationwide logistics telemetry, hub management, and user auditing.",
    themeColor: {
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      accent: "text-purple-500",
    },
  },
};

export const CUSTOMER_NAV_SECTIONS: DashboardNavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Overview",
        href: "/customer",
        icon: LayoutDashboard,
        exact: true,
        description: "Dashboard summary, delivery statistics, and quick actions.",
      },
    ],
  },
  {
    title: "Consignments",
    items: [
      {
        title: "Book Parcel",
        href: "/customer/book",
        icon: PlusCircle,
        description: "Create new delivery consignment with instant QR waybill.",
      },
      {
        title: "My Shipments",
        href: "/customer/shipments",
        icon: Package,
        description: "Track all booked shipments, invoices, and payments.",
      },
      {
        title: "Live Tracking",
        href: "/customer/tracking",
        icon: Truck,
        badge: "Live",
        badgeVariant: "success",
        description: "Real-time route tracing and delivery milestones.",
      },
    ],
  },
];

export const COURIER_NAV_SECTIONS: DashboardNavSection[] = [
  {
    title: "Operations",
    items: [
      {
        title: "Overview",
        href: "/courier",
        icon: LayoutDashboard,
        exact: true,
        description: "Courier performance metrics, active tasks, and completion rate.",
      },
      {
        title: "Assigned Parcels",
        href: "/courier/shipments",
        icon: PackageCheck,
        badge: "Active",
        badgeVariant: "warning",
        description: "Shipments assigned for pickup, transit, and delivery.",
      },
      {
        title: "Delivery History",
        href: "/courier/history",
        icon: History,
        description: "Completed deliveries, recipient signatures, and logs.",
      },
    ],
  },
];

export const ADMIN_NAV_SECTIONS: DashboardNavSection[] = [
  {
    title: "Executive",
    items: [
      {
        title: "Command Center",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
        description: "Platform-wide volume, revenue trends, and operational metrics.",
      },
      {
        title: "Global Shipments",
        href: "/admin/shipments",
        icon: Boxes,
        description: "All nationwide shipments, courier assignments, and status overrides.",
      },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      {
        title: "Hub Network",
        href: "/admin/hubs",
        icon: Building2,
        description: "Manage sorting hubs, capacity limits, and divisional gateways.",
      },
      {
        title: "User Management",
        href: "/admin/users",
        icon: Users,
        description: "User directory, role assignments, and ban controls.",
      },
      {
        title: "Platform Revenue",
        href: "/admin/revenue",
        icon: BarChart3,
        description: "Stripe transactions, COD collections, and payouts.",
      },
    ],
  },
];

export const COMMON_NAV_SECTION: DashboardNavSection = {
  title: "Account",
  items: [
    {
      title: "My Profile",
      href: "/profile",
      icon: User,
      description: "Manage profile information, display name, and avatar.",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Account security, notification preferences, and privacy.",
    },
  ],
};

/**
 * Returns role-specific navigation sections along with common account sections.
 */
export function getNavSectionsForRole(role: Role): DashboardNavSection[] {
  let roleSections: DashboardNavSection[] = [];

  switch (role) {
    case "ADMIN":
      roleSections = ADMIN_NAV_SECTIONS;
      break;
    case "COURIER":
      roleSections = COURIER_NAV_SECTIONS;
      break;
    case "CUSTOMER":
    default:
      roleSections = CUSTOMER_NAV_SECTIONS;
      break;
  }

  return [...roleSections, COMMON_NAV_SECTION];
}

/**
 * Helper to check if a navigation item is active based on current pathname.
 */
export function isNavItemActive(pathname: string, item: DashboardNavItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
