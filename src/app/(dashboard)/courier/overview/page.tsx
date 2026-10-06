import type { Metadata } from "next";
import { CourierOverview } from "@/features/shipments/components/courier";

export const metadata: Metadata = {
  title: "Courier Overview",
  description: "Field courier operations, active delivery routes, and consignment status updates.",
};

export default function CourierOverviewPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <CourierOverview />
    </div>
  );
}
