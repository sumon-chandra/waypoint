"use client";

import * as React from "react";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  X,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
} from "../api/user.api";
import { UserProfile } from "../schemas/user.schemas";

interface EmailVerificationDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function EmailVerificationDialog({
  profile,
  isOpen,
  onClose,
}: EmailVerificationDialogProps) {
  const [code, setCode] = React.useState("");
  const [cooldown, setCooldown] = React.useState(0);

  const sendMutation = useSendVerificationEmailMutation();
  const verifyMutation = useVerifyEmailMutation();

  // Cooldown countdown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleSendEmail = async () => {
    if (cooldown > 0 || sendMutation.isPending) return;

    await sendMutation.mutateAsync(undefined, {
      onSuccess: () => {
        setCooldown(60); // 60s cooldown
      },
    });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || verifyMutation.isPending) return;

    await verifyMutation.mutateAsync(code.trim(), {
      onSuccess: () => {
        setCode("");
        onClose();
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header with Close */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Mail className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Verify Email Address
              </h2>
              <p className="text-xs text-muted-foreground">
                Confirm your ownership of this email
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Email Target Details */}
        <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
          <p className="text-[11px] text-muted-foreground font-medium">
            Account Email
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground truncate">
              {profile.email}
            </p>
            {profile.emailVerified ? (
              <Badge variant="success" className="text-[10px] gap-1">
                <CheckCircle2 className="size-2.5" /> Verified
              </Badge>
            ) : (
              <Badge variant="warning" className="text-[10px]">
                Unverified
              </Badge>
            )}
          </div>
        </div>

        {/* Action 1: Send Verification Link */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Click below to receive a verification link or a 6-digit one-time code in your inbox.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSendEmail}
            disabled={sendMutation.isPending || cooldown > 0}
            className="w-full gap-2 text-xs"
          >
            {sendMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Sending email...</span>
              </>
            ) : cooldown > 0 ? (
              <>
                <Clock className="size-3.5" />
                <span>Resend available in {cooldown}s</span>
              </>
            ) : (
              <>
                <Send className="size-3.5 text-primary" />
                <span>Send Verification Email</span>
              </>
            )}
          </Button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <span className="relative bg-card px-2 text-[10px] uppercase font-medium text-muted-foreground">
            Or enter code below
          </span>
        </div>

        {/* Action 2: Enter OTP / Code */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="verification-code" className="text-xs font-medium">
              Verification Code or Token
            </Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="e.g. 123456 or paste verification token"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={verifyMutation.isPending}
              className="text-center font-mono tracking-widest text-sm"
              autoComplete="one-time-code"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={verifyMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!code.trim() || verifyMutation.isPending}
              className="gap-1.5 text-xs shadow-xs"
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-3.5" />
                  <span>Verify Email</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
