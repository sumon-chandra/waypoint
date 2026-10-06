import type { Metadata } from "next";
import { AdminDashboardOverview } from "@/features/analytics";

export const metadata: Metadata = {
  title: "Admin Command Center",
  description: "Nationwide logistics monitoring, hub orchestration, and system telemetry.",
};

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminDashboardOverview />
    </div>
  );
}
