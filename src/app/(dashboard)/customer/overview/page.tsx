import type { Metadata } from "next";
import { CustomerOverview } from "@/features/shipments/components/CustomerOverview";

export const metadata: Metadata = {
  title: "Customer Overview",
  description: "Consignment telemetry, delivery milestones, and operational KPIs.",
};

export default function CustomerOverviewPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <CustomerOverview />
    </div>
  );
}
