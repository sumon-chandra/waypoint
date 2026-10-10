"use client";

import * as React from "react";
import {
  ShieldAlert,
  UserCheck,
  Loader2,
  ShieldCheck,
  UserCog,
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
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useUpdateUser } from "../../api/useUpdateUser";
import type { User, UserStatus, Role } from "@/types";

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
  const [role, setRole] = React.useState<Role>("CUSTOMER");
  const [status, setStatus] = React.useState<UserStatus>("ACTIVE");
  const [banReason, setBanReason] = React.useState<string>("");

  const { mutate, isPending } = useUpdateUser();

  React.useEffect(() => {
    if (open && user) {
      setRole(user.role);
      setStatus(user.status);
      setBanReason(user.banReason || "");
    }
  }, [open, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: Record<string, unknown> = {};

    // Only include changed fields
    if (role !== user.role) payload.role = role;
    if (status !== user.status) payload.status = status;
    if (status === "BANNED" && banReason.trim()) {
      payload.banReason = banReason.trim();
    }

    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }

    mutate(
      { userId: user.id, payload },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl border border-border/80 shadow-2xl space-y-4">
        <DialogHeader className="space-y-1.5 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <UserCog className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Manage User Account & Permissions
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {user.name} ({user.email})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* 1. User Role (Positioned ABOVE Account Status as requested) */}
          <div className="space-y-1.5">
            <Label htmlFor="userRole" className="text-xs font-semibold">
              User Role <span className="text-destructive">*</span>
            </Label>
            {user.role === "ADMIN" ? (
              <div className="flex items-center gap-2 p-3 rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                <ShieldCheck className="size-4 shrink-0" />
                <span>
                  ADMIN — System Administrator (Role is protected against
                  accidental changes)
                </span>
              </div>
            ) : (
              <Select
                id="userRole"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="text-xs rounded-xl"
              >
                <option value="CUSTOMER">
                  CUSTOMER — Standard Merchant / Shipper
                </option>
                <option value="COURIER">
                  COURIER — Assigned Delivery Rider
                </option>
              </Select>
            )}
            <p className="text-[11px] text-muted-foreground">
              {user.role === "ADMIN"
                ? "Administrator privileges can only be modified through the central server config."
                : "Switch account between Customer merchant privileges and Courier rider delivery flow."}
            </p>
          </div>

          {/* 2. Account Status */}
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
              <option value="INACTIVE">
                INACTIVE — Temporary Deactivation
              </option>
              <option value="BANNED">BANNED — Platform Restriction</option>
            </Select>
          </div>

          {/* Conditional Ban Reason */}
          {status === "BANNED" && (
            <div className="space-y-1.5 animate-in fade-in-0">
              <Label htmlFor="banReason" className="text-xs font-semibold">
                Reason for Ban / Suspension{" "}
                <span className="text-destructive">*</span>
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
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <UserCheck className="size-4" />
                  <span>Save Account Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
