"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Banknote,
  ShieldCheck,
  Search,
  RotateCw,
  ExternalLink,
  Inbox,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCourierShipments } from "../../api/useCourierShipments";
import { cn } from "@/lib/utils";

export function CourierDeliveryHistoryTable() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
  } = useCourierShipments({
    status: "DELIVERED",
    limit: 100,
  });

  const deliveredShipments = data?.shipments ?? [];

  // Filter by search query
  const filteredShipments = React.useMemo(() => {
    if (!searchQuery.trim()) return deliveredShipments;
    const q = searchQuery.toLowerCase().trim();
    return deliveredShipments.filter(
      (s) =>
        s.trackingNumber.toLowerCase().includes(q) ||
        s.receiverName.toLowerCase().includes(q) ||
        s.receiverPhone.includes(q) ||
        s.receiverDistrict?.toLowerCase().includes(q)
    );
  }, [deliveredShipments, searchQuery]);

  // Aggregate completed summary
  const summary = React.useMemo(() => {
    const totalCount = deliveredShipments.length;
    const totalCod = deliveredShipments
      .filter((s) => s.paymentType === "CASH")
      .reduce((sum, s) => sum + (s.codAmount ?? 0), 0);
    const totalPrepaid = deliveredShipments.filter(
      (s) => s.paymentType === "CARD"
    ).length;

    return { totalCount, totalCod, totalPrepaid };
  }, [deliveredShipments]);

  return (
    <div className="space-y-6">
      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Total Completed Deliveries
          </span>
          <p className="text-2xl font-black text-foreground font-mono">
            {isLoading ? "—" : summary.totalCount}
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Total COD Remittance Collected
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {isLoading ? "—" : `৳${summary.totalCod.toLocaleString()}`}
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Prepaid Card Deliveries
          </span>
          <p className="text-2xl font-black text-primary font-mono">
            {isLoading ? "—" : summary.totalPrepaid}
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search completed deliveries by tracking #, recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-2xl h-11 text-xs sm:text-sm"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="rounded-2xl gap-2 font-medium cursor-pointer"
        >
          <RotateCw
            className={cn("size-3.5", isRefetching && "animate-spin text-primary")}
          />
          <span>Refresh History</span>
        </Button>
      </div>

      {/* Completed Shipments List/Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-border/80 bg-card p-8 text-center text-xs text-muted-foreground animate-pulse">
          Loading completed delivery records...
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-3">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Inbox className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              No Delivery History Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No completed deliveries matched "${searchQuery}".`
                : "Deliveries you complete with OTP verification will appear in this audit log."}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Tracking Number</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Delivery Route</th>
                  <th className="py-3.5 px-4">Settlement & COD</th>
                  <th className="py-3.5 px-4">Completion Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                {filteredShipments.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>{s.trackingNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-foreground">
                          {s.receiverName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {s.receiverPhone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[10px] py-0">
                          {s.deliveryType === "LOCAL" ? "Local" : "Inter-District"}
                        </Badge>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                          {s.receiverDistrict}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {s.paymentType === "CASH" ? (
                        <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                          <Banknote className="size-3.5" />
                          <span>৳{s.codAmount ?? 0}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="size-3.5" />
                          <span>Prepaid Card</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>
                          {new Date(s.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <Link
                        href={`/courier/shipments/${s.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold text-xs"
                      >
                        <span>View</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
