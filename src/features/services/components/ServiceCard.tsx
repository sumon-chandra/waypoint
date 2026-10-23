"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, MapPin, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "../data/services-data";

interface ServiceCardProps {
  service: ServiceItem;
  priority?: boolean;
}

export function ServiceCard({ service, priority = false }: ServiceCardProps) {
  return (
    <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300">
      {/* Top Image Showcase */}
      <div className="relative w-full aspect-16/10 overflow-hidden bg-muted/60 shrink-0">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Ambient Dark Gradient for Contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Floating Category Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-background/90 text-foreground backdrop-blur-md border border-border/60 shadow-xs">
            {service.popular && <Sparkles className="size-2.5 text-amber-500" />}
            <span>{service.category}</span>
          </span>
        </div>

        {/* Star Rating Badge (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-xs">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span>{service.rating.toFixed(1)}</span>
            <span className="text-[10px] text-white/70 font-normal">({service.reviewCount})</span>
          </div>
        </div>

        {/* Bottom Tagline Overlay on Image */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10">
          <p className="text-[11px] font-medium text-white/90 truncate drop-shadow-sm">
            {service.tagline}
          </p>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3 justify-between">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {service.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Meta Info Section (Price, SLA, Coverage) */}
        <div className="pt-3 border-t border-border/60 space-y-2">
          {/* Price & SLA Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-primary font-bold font-mono">
              <span>{service.priceDisplay}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
              <Clock className="size-3 text-muted-foreground/80 shrink-0" />
              <span>{service.sla}</span>
            </div>
          </div>

          {/* Coverage / Location Row */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1 truncate max-w-[70%]">
              <MapPin className="size-3 text-primary shrink-0" />
              <span className="truncate">{service.coverage}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
              <ShieldCheck className="size-3" />
              <span>Verified SLA</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="pt-2">
          <Link
            href={`/services/${service.id}`}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "w-full rounded-xl font-semibold text-xs justify-between group/btn shadow-xs hover:shadow-md transition-all cursor-pointer"
            )}
          >
            <span>View Details</span>
            <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
