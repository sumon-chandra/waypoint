import type { Metadata } from "next";
import { CourierShipmentTerminal } from "@/features/shipments/components/courier";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Consignment Action Terminal",
  description: "Field delivery terminal, waypoint stepper, recipient contacts, and OTP verification.",
};

export default async function CourierShipmentDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <CourierShipmentTerminal shipmentId={id} />
    </div>
  );
}
