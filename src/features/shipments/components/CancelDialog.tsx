"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCancelShipment } from "../api/useCancelShipment";
import { cancelShipmentSchema } from "../schemas/cancelShipmentSchema";
import type { Shipment } from "@/types";

interface CancelDialogProps {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelDialog({ shipment, open, onOpenChange }: CancelDialogProps) {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const cancelMutation = useCancelShipment();

  const handleClose = () => {
    setReason("");
    setError(null);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;

    const validation = cancelShipmentSchema.safeParse({ reason });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Reason must be at least 10 characters.");
      return;
    }

    try {
      await cancelMutation.mutateAsync({
        id: shipment.id,
        reason: validation.data.reason,
      });
      handleClose();
    } catch (err: unknown) {
      // Handled in mutation onError
    }
  };

  if (!shipment) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="mx-auto size-14 rounded-full bg-destructive/15 text-destructive flex items-center justify-center border border-destructive/30 mb-2">
              <AlertTriangle className="size-7" />
            </div>
            <DialogTitle className="text-center text-lg sm:text-xl font-bold">
              Cancel Consignment
            </DialogTitle>
            <DialogDescription className="text-center text-xs sm:text-sm">
              Are you sure you want to cancel waybill{" "}
              <span className="font-mono font-bold text-foreground">
                #{shipment.trackingNumber}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="cancel-reason" className="text-xs font-semibold">
              Reason for Cancellation <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="Please explain why you need to cancel this consignment (minimum 10 characters)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              rows={3}
              className="resize-none"
            />
            {error ? (
              <p className="text-[11px] text-destructive font-medium">{error}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Minimum 10 characters required for dispatch log audit.
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={cancelMutation.isPending}
              className="rounded-xl w-full sm:w-auto"
            >
              Keep Shipment
            </Button>

            <Button
              type="submit"
              variant="destructive"
              disabled={cancelMutation.isPending || reason.trim().length < 10}
              className="rounded-xl w-full sm:w-auto gap-1.5 font-bold"
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Confirm Cancellation</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
