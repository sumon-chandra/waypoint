"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteHub } from "../api/useDeleteHub";
import type { Hub } from "@/types";

interface DeleteHubDialogProps {
  hub: Hub | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteHubDialog({
  hub,
  open,
  onOpenChange,
  onSuccess,
}: DeleteHubDialogProps) {
  const deleteMutation = useDeleteHub();

  const handleDelete = async () => {
    if (!hub) return;
    try {
      await deleteMutation.mutateAsync({ id: hub.id, name: hub.name });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Handled by onError in hook
    }
  };

  if (!hub) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl border border-destructive/30 shadow-2xl space-y-4">
        <DialogHeader className="space-y-2">
          <div className="size-11 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="size-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Decommission Sorting Hub?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to permanently delete hub facility{" "}
            <strong className="text-foreground">
              {hub.name} ({hub.code})
            </strong>
            ? This action cannot be undone. Ensure no active line-haul routes or shipments are currently assigned.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={deleteMutation.isPending}
            onClick={() => onOpenChange(false)}
            className="rounded-xl cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            className="rounded-xl font-bold cursor-pointer shadow-xs gap-1.5"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Decommissioning...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
