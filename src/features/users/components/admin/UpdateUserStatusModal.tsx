"use client";

import * as React from "react";
import { ShieldAlert, UserCheck, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useUpdateUserStatus } from "../../api/useUpdateUserStatus";
import type { User, UserStatus } from "@/types";

interface UpdateUserStatusModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateUserStatusModal({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UpdateUserStatusModalProps) {
  const [status, setStatus] = React.useState<UserStatus>("ACTIVE");
  const [banReason, setBanReason] = React.useState<string>("");

  const updateMutation = useUpdateUserStatus();

  React.useEffect(() => {
    if (open && user) {
      setStatus(user.status);
      setBanReason(user.banReason || "");
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateMutation.mutateAsync({
        userId: user.id,
        userName: user.name,
        payload: {
          status,
          banReason: status === "BANNED" ? banReason.trim() : undefined,
        },
      });

      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Error handled by mutation onError
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl border border-border/80 shadow-2xl space-y-4">
        <DialogHeader className="space-y-1.5 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Manage Account Status
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {user.name} ({user.email})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Status Select */}
          <div className="space-y-1.5">
            <Label htmlFor="accountStatus" className="text-xs font-semibold">
              Account Status <span className="text-destructive">*</span>
            </Label>
            <Select
              id="accountStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="text-xs rounded-xl"
            >
              <option value="ACTIVE">ACTIVE — Normal System Access</option>
              <option value="INACTIVE">INACTIVE — Temporary Deactivation</option>
              <option value="BANNED">BANNED — Platform Restriction</option>
            </Select>
          </div>

          {/* Conditional Ban Reason */}
          {status === "BANNED" && (
            <div className="space-y-1.5 animate-in fade-in-0">
              <Label htmlFor="banReason" className="text-xs font-semibold">
                Reason for Ban / Suspension <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="banReason"
                rows={3}
                placeholder="Specify violation (e.g. fraudulent activity, failed deliveries, policy violation)..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="text-xs rounded-xl"
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={() => onOpenChange(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs gap-1.5"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <UserCheck className="size-4" />
                  <span>Apply Status Change</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
