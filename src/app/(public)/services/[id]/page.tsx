import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOGISTICS_SERVICES, getServiceById, ServiceDetailsView } from "@/features/services";

interface ServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return LOGISTICS_SERVICES.map((service) => ({
    id: service.id,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    return {
      title: "Service Not Found — Waypoint",
    };
  }

  return {
    title: `${service.title} — Waypoint Logistics Bangladesh`,
    description: `${service.tagline}. ${service.description} Starting from ${service.priceDisplay} with guaranteed ${service.sla} delivery.`,
    openGraph: {
      title: `${service.title} — Waypoint Logistics`,
      description: service.description,
      images: [service.image],
    },
  };
}

export default async function ServiceDetailsPage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    notFound();
  }

  return <ServiceDetailsView service={service} />;
}
