import type { Metadata } from "next";
import { PublicTrackingView } from "@/features/tracking";

interface TrackShipmentPageProps {
  params: Promise<{
    trackingNumber: string;
  }>;
}

export async function generateMetadata({
  params,
}: TrackShipmentPageProps): Promise<Metadata> {
  const { trackingNumber } = await params;
  const decoded = decodeURIComponent(trackingNumber).toUpperCase();

  return {
    title: `Live Tracking: ${decoded} — Waypoint Logistics`,
    description: `Track consignment ${decoded} across Waypoint's 64-district network. View active delivery stage, hub scans, courier contact, and OTP status.`,
  };
}

export default async function TrackShipmentPage({
  params,
}: TrackShipmentPageProps) {
  const { trackingNumber } = await params;
  const decoded = decodeURIComponent(trackingNumber).toUpperCase();

  return <PublicTrackingView trackingNumber={decoded} />;
}
