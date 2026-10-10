"use client";

import * as React from "react";
import {
  Banknote,
  CreditCard,
  Building2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Receipt,
  Boxes,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Shipment } from "@/types";
import { useRemitCourierCod } from "@/features/revenue/api/useRemitCourierCod";
import { useHubs } from "@/features/hubs";

interface RemitCodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipments?: Shipment[];
  unremittedAmount?: number;
  courierName?: string;
  onRemittedSuccess?: (amount: number) => void;
}

export function RemitCodModal({
  open,
  onOpenChange,
  shipments = [],
  unremittedAmount: fallbackAmount = 0,
  courierName = "Courier Rider",
  onRemittedSuccess,
}: RemitCodModalProps) {
  const [method, setMethod] = React.useState<"HUB" | "ONLINE">("HUB");
  const [selectedHubId, setSelectedHubId] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Mutation and Hubs query
  const remitMutation = useRemitCourierCod();
  const { data: hubs = [], isLoading: isHubsLoading } = useHubs();

  // Filter delivered COD shipments awaiting hub remittance
  const pendingShipments = React.useMemo(() => {
    if (shipments.length > 0) {
      return shipments.filter(
        (s) =>
          s.status === "DELIVERED" &&
          s.paymentType === "CASH" &&
          s.remittanceStatus !== "REMITTED_TO_HUB" &&
          s.remittanceStatus !== "SETTLED_TO_MERCHANT"
      );
    }
    return [];
  }, [shipments]);

  // Synchronize initial selected IDs when modal opens
  React.useEffect(() => {
    if (open) {
      if (pendingShipments.length > 0) {
        setSelectedIds(pendingShipments.map((s) => s.id));
      } else {
        setSelectedIds([]);
      }
      setNotes("");
    }
  }, [open, pendingShipments]);

  // Auto-select first hub when loaded
  React.useEffect(() => {
    if (hubs.length > 0 && !selectedHubId) {
      setSelectedHubId(hubs[0].id);
    }
  }, [hubs, selectedHubId]);

  // Calculate total cash sum for selected shipments
  const calculatedTotal = React.useMemo(() => {
    if (pendingShipments.length > 0) {
      return pendingShipments
        .filter((s) => selectedIds.includes(s.id))
        .reduce((sum, s) => sum + (s.codAmount ?? 0), 0);
    }
    return fallbackAmount;
  }, [pendingShipments, selectedIds, fallbackAmount]);

  const toggleSelectAll = () => {
    if (selectedIds.length === pendingShipments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingShipments.map((s) => s.id));
    }
  };

  const toggleShipment = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const referenceCode = React.useMemo(() => {
    return `COD-REM-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [open]);

  const handleRemit = async () => {
    if (calculatedTotal <= 0 && selectedIds.length === 0) return;

    try {
      await remitMutation.mutateAsync({
        shipmentIds: selectedIds.length > 0 ? selectedIds : pendingShipments.map((s) => s.id),
        amount: calculatedTotal,
        notes: notes.trim() || undefined,
        hubId: selectedHubId || undefined,
      });

      onRemittedSuccess?.(calculatedTotal);
      onOpenChange(false);
    } catch {
      // Error is handled in useRemitCourierCod onError
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 rounded-3xl border border-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Banknote className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Remit COD Cash Collected
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Deposit collected recipient cash at Hub finance desk or settle digitally
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Outstanding Balance Banner */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Total Cash to Deposit
              </span>
              <p className="text-2xl font-black text-foreground font-mono tracking-tight">
                ৳{calculatedTotal.toLocaleString()}
              </p>
            </div>
            <div className="text-right space-y-1">
              <Badge
                variant="outline"
                className="border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono text-xs px-2.5 py-1"
              >
                Cash In Hand
              </Badge>
              {pendingShipments.length > 0 && (
                <p className="text-xs text-muted-foreground font-mono">
                  {selectedIds.length} of {pendingShipments.length} selected
                </p>
              )}
            </div>
          </div>

          {/* Delivered COD Parcels Checklist */}
          {pendingShipments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-foreground">
                  Delivered COD Parcels Awaiting Handover
                </Label>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  {selectedIds.length === pendingShipments.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-muted/20 p-2 space-y-1.5 max-h-44 overflow-y-auto">
                {pendingShipments.map((shipment) => {
                  const isSelected = selectedIds.includes(shipment.id);
                  return (
                    <div
                      key={shipment.id}
                      onClick={() => toggleShipment(shipment.id)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            "size-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground/40 bg-background"
                          )}
                        >
                          {isSelected && <Check className="size-3.5 stroke-[3]" />}
                        </div>
                        <div className="truncate">
                          <p className="font-mono font-bold text-foreground">
                            #{shipment.trackingNumber}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {shipment.receiverName} • {shipment.receiverDistrict || "Local"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono font-bold text-amber-600 dark:text-amber-400">
                        ৳{(shipment.codAmount ?? 0).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remittance Settlement Method */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">
              Remittance Handover Channel
            </Label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod("HUB")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer space-y-1.5",
                  method === "HUB"
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <Building2 className="size-5" />
                <div>
                  <p className="font-bold text-xs text-foreground">Hub Cash Desk</p>
                  <p className="text-xs text-muted-foreground">In-person cash deposit</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod("ONLINE")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer space-y-1.5",
                  method === "ONLINE"
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <CreditCard className="size-5" />
                <div>
                  <p className="font-bold text-xs text-foreground">Online Digital</p>
                  <p className="text-xs text-muted-foreground">Direct digital clearing</p>
                </div>
              </button>
            </div>
          </div>

          {/* Hub Destination Selector */}
          {method === "HUB" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Target Sorting Hub Finance Counter
              </Label>
              <Select
                value={selectedHubId}
                onChange={(e) => setSelectedHubId(e.target.value)}
                disabled={isHubsLoading}
                className="rounded-xl text-xs h-10"
              >
                {hubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.code} — {hub.name} ({hub.district})
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Deposit Notes / Supervisor memo */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Deposit Memo / Desk Notes (Optional)
            </Label>
            <Input
              type="text"
              placeholder="e.g. Handed to Finance Supervisor at Counter 2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl text-xs h-10"
            />
          </div>

          {/* Security & Reference Info */}
          <div className="rounded-2xl border border-border bg-muted/20 p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Deposit Reference:</span>
              <span className="font-mono font-bold text-foreground">{referenceCode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Depositor Rider:</span>
              <span className="font-semibold text-foreground">{courierName}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Once submitted, consignments update to{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                REMITTED_TO_HUB
              </span>
              , reconciling your cash float and releasing merchant settlement payouts.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            disabled={remitMutation.isPending}
            onClick={() => onOpenChange(false)}
            className="rounded-xl cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={calculatedTotal <= 0 || remitMutation.isPending}
            onClick={handleRemit}
            className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            {remitMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Processing Remittance...</span>
              </>
            ) : method === "HUB" ? (
              <>
                <Receipt className="size-4" />
                <span>Remit ৳{calculatedTotal.toLocaleString()} to Hub</span>
              </>
            ) : (
              <>
                <CreditCard className="size-4" />
                <span>Settle ৳{calculatedTotal.toLocaleString()} Digitally</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
