import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard";

export const metadata: Metadata = {
  title: {
    template: "%s | Waypoint Logistics",
    default: "Dashboard | Waypoint Logistics",
  },
  description: "Enterprise Waypoint Logistics Command Center and Operations Portal.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
