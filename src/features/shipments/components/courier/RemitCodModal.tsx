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
  QrCode,
  ArrowRight,
  Receipt,
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RemitCodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unremittedAmount: number;
  courierName?: string;
  onRemittedSuccess?: (amount: number) => void;
}

export function RemitCodModal({
  open,
  onOpenChange,
  unremittedAmount,
  courierName = "Courier Rider",
  onRemittedSuccess,
}: RemitCodModalProps) {
  const [method, setMethod] = React.useState<"ONLINE" | "HUB">("ONLINE");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [hubNotes, setHubNotes] = React.useState("");

  const referenceCode = React.useMemo(() => {
    return `COD-REM-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [open]);

  const handleRemit = async () => {
    if (unremittedAmount <= 0) return;
    setIsProcessing(true);

    try {
      // Simulate gateway authorization / backend settlement
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (method === "ONLINE") {
        toast.success("COD Cash Remittance Processed!", {
          description: `Successfully remitted ৳${unremittedAmount.toLocaleString()} via electronic digital payment. Reference: ${referenceCode}.`,
        });
      } else {
        toast.success("Hub Cash Deposit Slip Generated!", {
          description: `Deposit slip #${referenceCode} issued. Please hand over ৳${unremittedAmount.toLocaleString()} cash to your assigned Hub Supervisor.`,
        });
      }

      onRemittedSuccess?.(unremittedAmount);
      onOpenChange(false);
    } catch {
      toast.error("Remittance failed. Please try again or contact your dispatch manager.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl border border-border/80 shadow-2xl space-y-4">
        <DialogHeader className="space-y-1.5 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Banknote className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Remit COD Cash Collected
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Clear cash in hand from completed cash-on-delivery shipments
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount Due Card */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Outstanding Balance to Remit
              </span>
              <p className="text-2xl font-black text-foreground font-mono tracking-tight">
                ৳{unremittedAmount.toLocaleString()}
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono text-xs px-2.5 py-1"
            >
              Cash In Hand
            </Badge>
          </div>

          {/* Settlement Method Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Select Remittance Method</Label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod("ONLINE")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer space-y-1.5",
                  method === "ONLINE"
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-xs"
                    : "border-border/80 hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <CreditCard className="size-5" />
                <div>
                  <p className="font-bold text-xs text-foreground">Online Digital</p>
                  <p className="text-[10px] text-muted-foreground">Instant card clearance</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod("HUB")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer space-y-1.5",
                  method === "HUB"
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-xs"
                    : "border-border/80 hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <Building2 className="size-5" />
                <div>
                  <p className="font-bold text-xs text-foreground">Hub Deposit</p>
                  <p className="text-[10px] text-muted-foreground">In-person cash handover</p>
                </div>
              </button>
            </div>
          </div>

          {/* Method Specific Details */}
          {method === "ONLINE" ? (
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                <span>Instant Digital Clearing</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Pay the collected cash directly to Waypoint Corporate Treasury via corporate debit/credit card or mobile financial services. Your COD ledger resets immediately.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-3.5 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Deposit Slip Ref:</span>
                <span className="font-mono font-bold text-foreground">{referenceCode}</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Rider Name:</span>
                <span className="font-semibold text-foreground">{courierName}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">
                Present this reference code along with the physical cash at your hub station. The Hub Manager will reconcile and approve your deposit.
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            onClick={() => onOpenChange(false)}
            className="rounded-xl cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={unremittedAmount <= 0 || isProcessing}
            onClick={handleRemit}
            className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs gap-1.5"
          >
            {isProcessing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : method === "ONLINE" ? (
              <>
                <CreditCard className="size-4" />
                <span>Pay ৳{unremittedAmount.toLocaleString()} Now</span>
              </>
            ) : (
              <>
                <Receipt className="size-4" />
                <span>Generate Deposit Slip</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
