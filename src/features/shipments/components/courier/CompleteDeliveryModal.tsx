"use client";

import * as React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Banknote,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Lock,
  AlertTriangle,
  Mail,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCompleteDelivery } from "../../api/useCompleteDelivery";
import { useResendDeliveryOtp } from "../../api/useResendDeliveryOtp";
import type { Shipment, ShipmentDetail } from "@/types";
import { cn } from "@/lib/utils";

interface CompleteDeliveryModalProps {
  shipment: Shipment | ShipmentDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const MAX_FAILED_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;

export function CompleteDeliveryModal({
  shipment,
  open,
  onOpenChange,
  onSuccess,
}: CompleteDeliveryModalProps) {
  const completeMutation = useCompleteDelivery();
  const resendMutation = useResendDeliveryOtp();

  // Destination email address for delivery OTP notification
  const targetEmail =
    shipment.receiverEmail ||
    ("customer" in shipment && shipment.customer?.email) ||
    null;

  // 4-digit OTP state
  const [digits, setDigits] = React.useState<string[]>(["", "", "", ""]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Security lockdown & attempt tracking
  const [failedAttempts, setFailedAttempts] = React.useState<number>(0);
  const isLocked = failedAttempts >= MAX_FAILED_ATTEMPTS;

  // Resend OTP cooldown timer
  const [cooldown, setCooldown] = React.useState<number>(0);

  // Focus first input when modal opens
  React.useEffect(() => {
    if (open) {
      setDigits(["", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [open]);

  // Cooldown interval timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleDigitChange = (index: number, value: string) => {
    if (isLocked) return;

    // Support paste of 4-digit OTP
    if (value.length > 1) {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      if (cleaned.length > 0) {
        const nextDigits = ["", "", "", ""];
        for (let i = 0; i < 4; i++) {
          nextDigits[i] = cleaned[i] || "";
        }
        setDigits(nextDigits);
        const nextIndex = Math.min(cleaned.length, 3);
        inputRefs.current[nextIndex]?.focus();
        return;
      }
    }

    const singleChar = value.slice(-1);
    if (!/^\d*$/.test(singleChar)) return;

    const nextDigits = [...digits];
    nextDigits[index] = singleChar;
    setDigits(nextDigits);

    // Auto-advance
    if (singleChar && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || resendMutation.isPending || isLocked) return;
    try {
      await resendMutation.mutateAsync({ shipmentId: shipment.id });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      // Handled by onError in hook
    }
  };

  const otpCode = digits.join("");
  const isOtpComplete = otpCode.length === 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || !isOtpComplete) return;

    try {
      await completeMutation.mutateAsync({
        shipmentId: shipment.id,
        otp: otpCode,
        cashCollected:
          shipment.paymentType === "CASH" ? (shipment.codAmount ?? 0) : undefined,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch {
      setFailedAttempts((prev) => prev + 1);
      // Clear digits for retry
      setDigits(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl border border-border/80 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Verify & Handover Parcel
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Tracking #{shipment.trackingNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Lockout Warning Banner */}
          {isLocked ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 space-y-2 text-destructive animate-in fade-in-0">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Lock className="size-4 shrink-0" />
                <span>Security Terminal Locked</span>
              </div>
              <p className="text-xs leading-relaxed">
                Maximum 5 failed OTP attempts reached. Handover is locked.
                Please contact dispatch supervisor to re-issue delivery
                credentials.
              </p>
            </div>
          ) : failedAttempts > 0 ? (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 space-y-1 text-amber-700 dark:text-amber-400 text-xs animate-in fade-in-0">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="size-3.5 shrink-0" />
                <span>Incorrect OTP Code</span>
              </div>
              <p>
                {MAX_FAILED_ATTEMPTS - failedAttempts} attempts remaining before
                security lockout.
              </p>
            </div>
          ) : null}

          {/* PAYMENT TYPE DISPLAY & COD CASH ADVISORY */}
          {shipment.paymentType === "CASH" ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Banknote className="size-4" />
                  <span>Collect Cash on Delivery</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold px-2.5 py-0.5"
                >
                  Due: ৳{shipment.codAmount ?? 0}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Collect exact cash amount of <strong className="text-foreground">৳{shipment.codAmount ?? 0}</strong> from the recipient before entering the 4-digit verification code.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="size-4" />
                  <span>Prepaid Order</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paid securely via Card. No cash collection required.
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-bold shrink-0"
              >
                Prepaid (Card)
              </Badge>
            </div>
          )}

          {/* 4-DIGIT OTP INPUT (AGENTS.md Section 9) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">
                Customer Delivery OTP (4 Digits){" "}
                <span className="text-destructive">*</span>
              </Label>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || resendMutation.isPending || isLocked}
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer",
                  cooldown > 0 || isLocked
                    ? "text-muted-foreground opacity-60 cursor-not-allowed"
                    : "text-primary hover:underline",
                )}
              >
                <RotateCcw className="size-3" />
                <span>
                  {resendMutation.isPending
                    ? "Sending..."
                    : cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Resend OTP"}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4} // Allows paste
                  value={digit}
                  disabled={isLocked || completeMutation.isPending}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={cn(
                    "h-14 rounded-2xl border text-center text-2xl font-black font-mono transition-all outline-hidden select-none",
                    digit
                      ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                      : "border-border/80 bg-muted/20 text-muted-foreground",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20",
                    isLocked && "opacity-50 cursor-not-allowed bg-muted",
                  )}
                />
              ))}
            </div>

            {targetEmail && (
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 py-1 px-3 rounded-full w-fit mx-auto">
                <Mail className="size-3 text-primary shrink-0" />
                <span>
                  Dispatched to:{" "}
                  <strong className="text-foreground">{targetEmail}</strong>
                </span>
              </div>
            )}

            <p className="text-[11px] text-muted-foreground text-center">
              Ask the recipient for the 4-digit verification code sent to their
              email.
            </p>
          </div>

          {/* MODAL ACTION BUTTONS */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={completeMutation.isPending}
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isLocked || !isOtpComplete || completeMutation.isPending
              }
              className="flex-1 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
            >
              {completeMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  <span>Confirm Handover</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
